const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../util/config');
const errors = require('../../util/errors/errors');
const constants = require('../../util/constants');
const validator = require('../../util/validation//validator');
const graphQlErrors = require('../../util/errors/graphQlErrors');
const accountService = require('../services/accountService');

const resolvers = {
  Query: {
    emailAvailable: async (_, { email }) => {
      await validator.validateEmail(email);
      const emailInUse = await accountService.findAccountByEmail(email);

      return { 
        __typename: 'Success',
        status: emailInUse ? false : true
      };
    },
  },
  Mutation: {
    createAccount: async (_, { email, password, passwordConfirmation, languageId }) => {
      await validator.validateNewAccount(email, password, passwordConfirmation, languageId);
      const emailInUse = await accountService.findAccountByEmail(email);
      if (emailInUse) return graphQlErrors.defaultError(errors.emailInUseError);
      const passwordHash = await accountService.hashPassword(password);
      // Create a new account if all validations pass
      const account = await accountService.createNewAccount(email, passwordHash);

      return {
        __typename: 'Account',
        id: account.id,
        email: account.email,
      };
    },
    login: async (_, { email, password }) => {
      await validator.validateLogin(email, password);
      const account = await accountService.findAccountByEmail(email);
      if (!account?.passwordHash) return graphQlErrors.defaultError(errors.userOrPassIncorrectError);
      const passwordCorrect = await accountService.hashCompare(password, account.passwordHash);
      if (!passwordCorrect) return graphQlErrors.defaultError(errors.userOrPassIncorrectError);

      return { 
        __typename: 'AccountToken',
        token: { value: jwt.sign( { id: account.id }, JWT_SECRET, { expiresIn: constants.jwtExpiryTime } )},
        user: { id: account.id, email: account.email }
      };
    },
    changePassword: async (_, { currentPassword, newPassword, newPasswordConfirmation }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      await validator.validateChangePassword(currentPassword, newPassword, newPasswordConfirmation);
      const account = await accountService.findAccountById(currentUser.id);
      if (!account?.passwordHash) return graphQlErrors.defaultError(errors.userOrPassIncorrectError);
      const passwordCorrect = await accountService.hashCompare(currentPassword, account.passwordHash);
      if (!passwordCorrect) return graphQlErrors.defaultError(errors.currentPasswordIncorrect);
      const passwordHash = await accountService.hashPassword(newPassword);

      try {
        // Update password if all validations pass
        account.passwordHash = passwordHash;
        await account.save();
      } catch(error) {
        console.log(error);
        return graphQlErrors.internalServerError();
      }

      return { 
        __typename: 'Success',
        status: true
      };
    },
  }
};

module.exports = resolvers;
