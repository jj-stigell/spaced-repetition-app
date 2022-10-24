const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_SECRET } = require('../../util/config');
const { Account } = require('../../models');
const { Op } = require('sequelize');
const constants = require('../../util/constants');
const errors = require('../../util/errors');

const typeDef = `
  type Account {
    id: ID!
    email: String
  }

  type Token {
    value: String!
  }

  type AccountToken {
    token: Token!
    user: Account!
  }

  type Success {
    status: Boolean!
  }

  type Error {
    errorCode: String!
  }

  union LoginPayload = AccountToken | Error
  union RegisterResult = Account | Error
  union ChangePasswordResult = Success | Error

  type Query {
    emailAvailable(
      email: String!
    ): Boolean!
  }

  type Mutation {
    createAccount(
      email: String!
      password: String!
      passwordConfirmation: String!
      languageId: String
    ): RegisterResult!

    login(
      email: String!
      password: String!
    ): LoginPayload!

    changePassword(
      currentPassword: String!
      newPassword: String!
      newPasswordConfirmation: String!
    ): ChangePasswordResult!
  }
`;

const resolvers = {
  Query: {
    // eslint-disable-next-line no-unused-vars
    emailAvailable: async (_, { email }) => {
      // Check that username is not in use, case insensitive
      const emailInUse = await Account.findOne({
        where: {
          email: {
            [Op.iLike]: email
          }
        }
      });
      if (emailInUse) {
        return false;
      }

      return true;
    },
  },
  Mutation: {
    createAccount: async (_, { email, password, passwordConfirmation, languageId }) => {

      /**
       * Validate new account input:
       * - check email is valid and not in use
       * - check password matches with confirmation, correct length and includes required symbols
       */

      // Confirm that no value is empty
      if (!email || !password || !passwordConfirmation) {
        return { 
          __typename: 'Error',
          errorCode: errors.inputValueMissingError
        };
      }

      // Check that confirmation matches to password
      if (password !== passwordConfirmation) {
        return { 
          __typename: 'Error',
          errorCode: errors.passwordMismatchError
        };
      }

      // Chack that language id is one of the available
      if (languageId && !validator.isIn(languageId.toLowerCase(), constants.availableLanguages)) {
        return { 
          __typename: 'Error',
          errorCode: errors.invalidLanguageIdError
        };
      }

      // Password must contain min 8 chars, at least one lower, upper and number character
      if (!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
        returnScore: false
      }) || password.length > 50) {
        return { 
          __typename: 'Error',
          errorCode: errors.passwordValidationError
        };
      }

      // Check for valid email
      if (!validator.isEmail(email)) {
        return { 
          __typename: 'Error',
          errorCode: errors.notEmailError
        };
      }

      // Check that email not reserved, emails stored in lowercase
      const emailInUse = await Account.findOne({ where: { email: email.toLowerCase() } });
      if (emailInUse) {
        return { 
          __typename: 'Error',
          errorCode: errors.emailInUseError
        };
      }

      // Create a new account if all validations pass
      try {
        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const account = await Account.create({
          email: email.toLowerCase(),
          passwordHash: passwordHash,
        });
        return {
          __typename: 'Account',
          id: account.id,
          email: account.email,
        };
      } catch(error) {
        console.log(error.errors);
        return { 
          __typename: 'Error',
          errorCode: errors.connectionError
        };
      }
    },
    login: async (_, { email, password }) => {

      // Confirm that email and password not empty
      if (!email || !password) {
        return { 
          __typename: 'Error',
          errorCode: errors.inputValueMissingError
        };
      }

      // Confirm for valid email
      if (!validator.isEmail(email)) {
        return { 
          __typename: 'Error',
          errorCode: errors.notEmailError
        };
      }

      const account = await Account.findOne({ where: { email: email.toLowerCase() } });

      // If user is found, compare the crypted password to the hash fetched from database
      const passwordCorrect = account === null
        ? false
        : await bcrypt.compare(password, account.passwordHash);

      if (!account || !passwordCorrect) {
        return { 
          __typename: 'Error',
          errorCode: errors.userOrPassIncorrectError
        };
      }
    
      const payload = {
        id: account.id,
      };

      const accountInfo = {
        id: account.id,
        email: account.email,
      };

      return { 
        __typename: 'AccountToken',
        token: { value: jwt.sign(payload, JWT_SECRET, { expiresIn: 60*60*300 })},
        user: accountInfo
      };
    },
    changePassword: async (_, { currentPassword, newPassword, newPasswordConfirmation }, { currentUser }) => {

      if (!currentUser) {
        return { 
          __typename: 'Error',
          errorCode: errors.notAuthError
        };
      }

      // Confirm that currentPassword, newPassword, newPasswordConfirmation not empty
      if (!currentPassword || !newPassword || !newPasswordConfirmation) {
        return { 
          __typename: 'Error',
          errorCode: errors.changePasswordValueMissingError
        };
      }

      // Check that confirmation matches to password
      if (newPassword !== newPasswordConfirmation) {
        return { 
          __typename: 'Error',
          errorCode: errors.passwordMismatchError
        };
      }

      // Check that new password is not same ass old one
      if (newPassword === currentPassword) {
        return { 
          __typename: 'Error',
          errorCode: errors.currAndNewPassEqualError
        };
      }

      // Password must contain min 8 chars, at least one lower, upper and number character
      if (!validator.isStrongPassword(newPassword, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
        returnScore: false
      }) || newPassword.length > 50) {
        return { 
          __typename: 'Error',
          errorCode: errors.passwordValidationError
        };
      }

      const account = await Account.findByPk(currentUser.id);

      // If user is found, compare the crypted password to the hash fetched from database
      const passwordCorrect = account === null
        ? false
        : await bcrypt.compare(currentPassword, account.passwordHash);

      if (!passwordCorrect) {
        return { 
          __typename: 'Error',
          errorCode: errors.currentPasswordIncorrect
        };
      }

      // Update password if all validations pass
      try {
        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(newPassword, saltRounds);

        // Update new password hash to account and save
        account.passwordHash = passwordHash;
        await account.save();
        return { 
          __typename: 'Success',
          status: true
        };
      } catch(error) {
        console.log(error.errors);
        return { 
          __typename: 'Error',
          errorCode: errors.connectionError
        };
      }
    },
  }
};

module.exports = {
  typeDef,
  resolvers
};
