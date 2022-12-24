const { defaultError, notAuthError, internalServerError } = require('../../util/errors/graphQlErrors');
const { hashPassword, hashCompare } = require('../../util/helper');
const { accountService, sessionService } = require('../services');
const { parseUserAgent, signJWT } = require('../../util/helper');
const validator = require('../../util/validation//validator');
const { accountFormatter } = require('../../util/formatter');
const errors = require('../../util/errors/errors');

const resolvers = {
  Query: {
    emailAvailable: async (_, { email }) => {
      await validator.validateEmail(email);
      const emailInUse = await accountService.findAccountByEmail(email);
      return emailInUse ? false : true;
    },
    usernameAvailable: async (_, { username }) => {
      await validator.validateUsername(username);
      const usernameInUse = await accountService.findAccountByUsernameCaseInsensitive(username);
      return usernameInUse ? false : true;
    },
    sessions: async (root, args, { currentUser }) => {
      if (!currentUser) return notAuthError();
      const sessions = await sessionService.findAllSessionsByAccountId(currentUser.id);
      if (sessions.length === 0) return defaultError(errors.sessionErrors.sessionNotFoundError);
      return sessions;
    },
  },
  Mutation: {
    createAccount: async (_, { email, username, password, passwordConfirmation, languageId }) => {
      await validator.validateNewAccount(email, username, password, passwordConfirmation, languageId);
      const emailInUse = await accountService.findAccountByEmail(email);
      if (emailInUse) return defaultError(errors.accountErrors.emailInUseError);
      const usernameInUse = await accountService.findAccountByUsernameCaseInsensitive(username);
      if (usernameInUse) return defaultError(errors.accountErrors.usernameInUseError);
      const passwordHash = await hashPassword(password);
      const account = await accountService.createNewAccount(email, username, languageId, passwordHash);
      return accountFormatter(account);
    },
    login: async (_, { email, password }, { userAgent }) => {
      await validator.validateLogin(email, password);
      const account = await accountService.findAccountByEmail(email);
      if (!account?.passwordHash) return defaultError(errors.validationErrors.userOrPassIncorrectError);
      const passwordCorrect = await hashCompare(password, account.passwordHash);
      if (!passwordCorrect) return defaultError(errors.validationErrors.userOrPassIncorrectError);
      if (!account.emailVerified) return defaultError(errors.accountErrors.emailNotVerifiedError);
      const parsedUserAgent = parseUserAgent(userAgent);
      const session = await sessionService.createNewSession(account.id, parsedUserAgent);
      const token = signJWT(account.id, session.id);
      return { 
        token: token,
        session: session.id,
        account: accountFormatter(account)
      };
    },
    logout: async (root, args, { currentUser }) => {
      if (!currentUser) return notAuthError();
      const session = await sessionService.deactivateSession(currentUser.session);
      return session.id;
    },
    deleteSession: async (root, { sessionId }, { currentUser }) => {
      if (!currentUser) return notAuthError();
      await validator.validateUUID(sessionId);
      const session = await sessionService.findSessionById(sessionId);
      if (session === null) return defaultError(errors.sessionErrors.sessionNotFoundError);
      if (session.accountId !== currentUser.id) return defaultError(errors.sessionErrors.notOwnerOfSession);
      await sessionService.deleteSession(sessionId);
      return sessionId;
    },
    changePassword: async (_, { currentPassword, newPassword, newPasswordConfirmation }, { currentUser }) => {
      if (!currentUser) return notAuthError();
      await validator.validateChangePassword(currentPassword, newPassword, newPasswordConfirmation);
      const account = await accountService.findAccountById(currentUser.id);
      if (!account?.passwordHash) return defaultError(errors.validationErrors.userOrPassIncorrectError);
      const passwordCorrect = await hashCompare(currentPassword, account.passwordHash);
      if (!passwordCorrect) return defaultError(errors.validationErrors.currentPasswordIncorrectError);
      const passwordHash = await hashPassword(newPassword);
      account.passwordHash = passwordHash;
      try {
        // Update password if all validations pass
        await account.save();
      } catch(error) {
        return internalServerError(error);
      }
      return accountFormatter(account);
    },
  }
};

module.exports = resolvers;
