const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../util/config');
const errors = require('../../util/errors/errors');
const constants = require('../../util/constants');
const validator = require('../../util/validation//validator');
const graphQlErrors = require('../../util/errors/graphQlErrors');
const services = require('../services');
const { parseUserAgent } = require('../../util/helper');

const resolvers = {
  Query: {
    emailAvailable: async (_, { email }) => {
      await validator.validateEmail(email);
      const emailInUse = await services.accountService.findAccountByEmail(email);
      
      return { status: emailInUse ? false : true };
    },
    fetchSessions: async (root, args, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      const sessions = await services.sessionService.findAllSessions(currentUser.id);
      if (sessions.length === 0) return graphQlErrors.defaultError(errors.session.sessionNotFoundError);

      return sessions;
    },
  },
  Mutation: {
    createAccount: async (_, { email, password, passwordConfirmation, languageId }) => {
      await validator.validateNewAccount(email, password, passwordConfirmation, languageId);
      const emailInUse = await services.accountService.findAccountByEmail(email);
      if (emailInUse) return graphQlErrors.defaultError(errors.emailInUseError);
      const passwordHash = await services.accountService.hashPassword(password);
      // Create a new account if all validations pass
      const account = await services.accountService.createNewAccount(email, passwordHash);

      return {
        id: account.id,
        email: account.email,
      };
    },
    login: async (_, { email, password }, { userAgent }) => {
      await validator.validateLogin(email, password);
      const account = await services.accountService.findAccountByEmail(email);
      if (!account?.passwordHash) return graphQlErrors.defaultError(errors.userOrPassIncorrectError);
      const passwordCorrect = await services.accountService.hashCompare(password, account.passwordHash);
      if (!passwordCorrect) return graphQlErrors.defaultError(errors.userOrPassIncorrectError);
      const parsedUserAgent = parseUserAgent(userAgent);
      const session = await services.sessionService.createNewSession(account.id, parsedUserAgent);

      return { 
        token: { value: jwt.sign( { id: account.id, session: session.id }, JWT_SECRET, { expiresIn: constants.login.jwtExpiryTime } )},
        user: { id: account.id, email: account.email }
      };
    },
    logout: async (root, args, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      const res = await services.sessionService.deleteSession(currentUser.session);
      if (res === 0) return graphQlErrors.defaultError(errors.session.sessionNotFoundError);

      return { status: true };
    },
    deleteSession: async (root, { sessionId }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      await validator.validateUUID(sessionId);
      const session = await services.sessionService.findSessionById(sessionId);
      if (session === null) return graphQlErrors.defaultError(errors.session.sessionNotFoundError);
      if (session.accountId !== currentUser.id) return graphQlErrors.defaultError(errors.session.notOwnerOfSession);
      await services.sessionService.deleteSession(sessionId);

      return { status: true };
    },
    changePassword: async (_, { currentPassword, newPassword, newPasswordConfirmation }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      await validator.validateChangePassword(currentPassword, newPassword, newPasswordConfirmation);
      const account = await services.accountService.findAccountById(currentUser.id);
      if (!account?.passwordHash) return graphQlErrors.defaultError(errors.userOrPassIncorrectError);
      const passwordCorrect = await services.accountService.hashCompare(currentPassword, account.passwordHash);
      if (!passwordCorrect) return graphQlErrors.defaultError(errors.currentPasswordIncorrect);
      const passwordHash = await services.accountService.hashPassword(newPassword);

      try {
        // Update password if all validations pass
        account.passwordHash = passwordHash;
        await account.save();
      } catch(error) {
        return graphQlErrors.internalServerError(error);
      }

      return { status: true };
    },
  }
};

module.exports = resolvers;
