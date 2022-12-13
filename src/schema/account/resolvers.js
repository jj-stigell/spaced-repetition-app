const errors = require('../../util/errors/errors');
const validator = require('../../util/validation//validator');
const graphQlErrors = require('../../util/errors/graphQlErrors');
const services = require('../services');
const { parseUserAgent, signJWT } = require('../../util/helper');
const { hashPassword, hashCompare } = require('../../util/helper');

const resolvers = {
  Query: {
    emailAvailable: async (_, { email }) => {
      await validator.validateEmail(email);
      const emailInUse = await services.accountService.findAccountByEmail(email);
      return emailInUse ? false : true;
    },
    usernameAvailable: async (_, { username }) => {
      await validator.validateUsername(username);
      const usernameInUse = await services.accountService.findAccountByUsernameCaseInsensitive(username);
      return usernameInUse ? false : true;
    },
    sessions: async (root, args, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      const sessions = await services.sessionService.findAllSessionsByAccountId(currentUser.id);
      if (sessions.length === 0) return graphQlErrors.defaultError(errors.session.sessionNotFoundError);
      return sessions;
    },
  },
  Mutation: {
    createAccount: async (_, { email, username, password, passwordConfirmation, languageId }) => {
      await validator.validateNewAccount(email, username, password, passwordConfirmation, languageId);
      const emailInUse = await services.accountService.findAccountByEmail(email);
      if (emailInUse) return graphQlErrors.defaultError(errors.account.emailInUseError);
      const usernameInUse = await services.accountService.findAccountByUsernameCaseInsensitive(username);
      if (usernameInUse) return graphQlErrors.defaultError(errors.account.usernameInUseError);
      const passwordHash = await hashPassword(password);
      // Create a new account if all validations pass
      const account = await services.accountService.createNewAccount(email, username, languageId, passwordHash);

      return {
        id: account.id,
        email: account.email,
        username: account.username,
        languageId: account.languageId,
        lastLogin: account.lastLogin,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt
      };
    },
    login: async (_, { email, password }, { userAgent }) => {
      await validator.validateLogin(email, password);
      const account = await services.accountService.findAccountByEmail(email);
      if (!account?.passwordHash) return graphQlErrors.defaultError(errors.userOrPassIncorrectError);
      const passwordCorrect = await hashCompare(password, account.passwordHash);
      if (!passwordCorrect) return graphQlErrors.defaultError(errors.userOrPassIncorrectError);
      const parsedUserAgent = parseUserAgent(userAgent);
      const session = await services.sessionService.createNewSession(account.id, parsedUserAgent);
      const token = signJWT(account.id, session.id);

      return { 
        token: token,
        session: session.id,
        account: {
          id: account.id,
          email: account.email,
          username: account.username,
          languageId: account.languageId,
          lastLogin: account.lastLogin,
          createdAt: account.createdAt,
          updatedAt: account.updatedAt
        }
      };
    },
    logout: async (root, args, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      const session = await services.sessionService.deactivateSession(currentUser.session);
      return session.id;
    },
    deleteSession: async (root, { sessionId }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      await validator.validateUUID(sessionId);
      const session = await services.sessionService.findSessionById(sessionId);
      if (session === null) return graphQlErrors.defaultError(errors.session.sessionNotFoundError);
      if (session.accountId !== currentUser.id) return graphQlErrors.defaultError(errors.session.notOwnerOfSession);
      await services.sessionService.deleteSession(sessionId);

      return sessionId;
    },
    changePassword: async (_, { currentPassword, newPassword, newPasswordConfirmation }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      await validator.validateChangePassword(currentPassword, newPassword, newPasswordConfirmation);
      const account = await services.accountService.findAccountById(currentUser.id);
      if (!account?.passwordHash) return graphQlErrors.defaultError(errors.userOrPassIncorrectError);
      const passwordCorrect = await hashCompare(currentPassword, account.passwordHash);
      if (!passwordCorrect) return graphQlErrors.defaultError(errors.currentPasswordIncorrect);
      const passwordHash = await hashPassword(newPassword);
      account.passwordHash = passwordHash;

      try {
        // Update password if all validations pass
        await account.save();
      } catch(error) {
        return graphQlErrors.internalServerError(error);
      }

      return {
        id: account.id,
        email: account.email,
        username: account.username,
        languageId: account.languageId,
        lastLogin: account.lastLogin,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt
      };
    },
  }
};

module.exports = resolvers;
