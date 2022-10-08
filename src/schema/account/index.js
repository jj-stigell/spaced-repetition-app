// eslint-disable-next-line no-unused-vars
const { UserInputError, AuthenticationError, ForbiddenError } = require('apollo-server');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_SECRET } = require('../../util/config');
const { Account } = require('../../models');
const { Op } = require('sequelize');

const typeDef = `
  type Account {
    id: ID!
    email: String
    username: String
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
    usernameAvailable(
      username: String!
    ): Boolean!
  }

  type Mutation {
    createAccount(
      email: String!
      username: String!
      password: String!
      passwordConfirmation: String!
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
    usernameAvailable: async (_, { username }) => {
      // Check that username is not in use, case insensitive
      const usernameInUse = await Account.findOne({
        where: {
          username: {
            [Op.iLike]: username
          }
        }
      });
      if (usernameInUse) {
        return false;
      }

      return true;
    },
  },
  Mutation: {
    createAccount: async (_, { email, username, password, passwordConfirmation }) => {

      /**
       * Validate new account input:
       * - check email is valid and not in use
       * - check username is correct length (1-14 char), not in use and sanitized
       * - check password matches with confirmation, correct length and includes required symbols
       */

      // Confirm that no value is empty
      if (!email || !username || !password || !passwordConfirmation) {
        return { 
          __typename: 'Error',
          errorCode: 'inputValueMissingError'
        };
        /*
        throw new UserInputError('Email and/or password is missing', {
          errorName: 'inputValueMissingError'
        });
        */
      }

      // Check that confirmation matches to password
      if (password !== passwordConfirmation) {
        return { 
          __typename: 'Error',
          errorCode: 'passwordMismatchError'
        };
        /*
        throw new UserInputError('Password and confirmation do not match', {
          errorName: 'passwordMismatchError'
        });
        */
      }

      // Password must contain min 8 chars, at least one lower, upper and number character
      if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0, returnScore: false }) || password.length > 50) {
        return { 
          __typename: 'Error',
          errorCode: 'passwordValidationError'
        };
        /*
        throw new UserInputError('Password validation error', {
          errorName: 'passwordValidationError'
        });
        */
      }

      // Check for valid email
      if (!validator.isEmail(email)) {
        return { 
          __typename: 'Error',
          errorCode: 'notEmailError'
        };
        /*
        throw new UserInputError('Email is not a valid email', {
          errorName: 'notEmailError'
        });
        */
      }

      // Check that username is according to rules, length 1-14, and alphanumeric
      if (!validator.isAlphanumeric(username) || !validator.isLength(username, { min: 1, max: 14 })) {
        return { 
          __typename: 'Error',
          errorCode: 'usernameValidationError'
        };
        /*
        throw new UserInputError('Username validation error', {
          errorName: 'usernameValidationError'
        });
        */
      }

      // Check that email not reserved, emails stored in lowercase
      const emailInUse = await Account.findOne({ where: { email: email.toLowerCase() } });
      if (emailInUse) {
        return { 
          __typename: 'Error',
          errorCode: 'emailInUseError'
        };
        /*
        throw new UserInputError('Email in use already', {
          errorName: 'emailInUseError'
        });
        */
      }

      // Check that username is not in use, case insensitive
      const usernameInUse = await Account.findOne({
        where: {
          username: {
            [Op.iLike]: username
          }
        }
      });
      if (usernameInUse) {
        return { 
          __typename: 'Error',
          errorCode: 'usernameInUseError'
        };
        /*
        throw new UserInputError('Username in use already', {
          errorName: 'usernameInUseError'
        });
        */
      }

      // Create a new account if all validations pass
      try {
        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const account = await Account.create({
          email: email.toLowerCase(),
          username: username,
          passwordHash: passwordHash,
        });
        return {
          __typename: 'Account',
          id: account.id,
          email: account.email,
          username: account.username
        };
      } catch(error) {
        console.log(error.errors);

        return { 
          __typename: 'Error',
          errorCode: 'connectionError'
        };
        /*
        throw new ForbiddenError('Something went wrong, pleasy try again', {
          errorName: 'somethingWrongTryAgainError'
        });
        */
      }
    },
    login: async (_, { email, password }) => {

      // Confirm that email and password not empty
      if (!email || !password) {
        return { 
          __typename: 'Error',
          errorCode: 'inputValueMissingError'
        };
        /*
        throw new UserInputError('Email and/or password is missing', {
          errorName: 'inputValueMissingError'
        });
        */
      }

      // Confirm for valid email
      if (!validator.isEmail(email)) {
        return { 
          __typename: 'Error',
          errorCode: 'notEmailError'
        };
        /*
        throw new UserInputError('Email is not a valid email', {
          errorName: 'notEmailError'
        });
        */
      }

      const account = await Account.findOne({ where: { email: email.toLowerCase() } });

      // If user is found, compare the crypted password to the hash fetched from database
      const passwordCorrect = account === null
        ? false
        : await bcrypt.compare(password, account.passwordHash);

      if (!account || !passwordCorrect) {
        return { 
          __typename: 'Error',
          errorCode: 'userOrPassIncorrectError'
        };
        /*
        throw new UserInputError('Username or password invalid', {
          errorName: 'userOrPassIncorrectError'
        });
        */
      }
    
      const payload = {
        username: account.username,
        id: account.id,
      };

      const accountInfo = {
        id: account.id,
        email: account.email,
        username: account.username
      };

      return { 
        __typename: 'AccountToken',
        token: { value: jwt.sign(payload, JWT_SECRET, { expiresIn: 60*60 })},
        user: accountInfo
      };
    },
    changePassword: async (_, { currentPassword, newPassword, newPasswordConfirmation }, { currentUser }) => {

      if (!currentUser) {
        return { 
          __typename: 'Error',
          errorCode: 'notAuthError'
        };
        /*
        throw new AuthenticationError('Not authenticated', {
          errorName: 'notAuthError'
        });
        */
      }

      // Confirm that currentPassword, newPassword, newPasswordConfirmation not empty
      if (!currentPassword || !newPassword || !newPasswordConfirmation) {
        return { 
          __typename: 'Error',
          errorCode: 'changePasswordValueMissingError'
        };
        /*
        throw new UserInputError('Current password, new password or confirmation is missing', {
          errorName: 'inputValueMissingError'
        });
        */
      }

      // Check that confirmation matches to password
      if (newPassword !== newPasswordConfirmation) {
        return { 
          __typename: 'Error',
          errorCode: 'passwordMismatchError'
        };
        /*
        throw new UserInputError('Password and confirmation do not match', {
          errorName: 'passwordMismatchError'
        });
        */
      }

      // Check that new password is not same ass old one
      if (newPassword === currentPassword) {
        return { 
          __typename: 'Error',
          errorCode: 'currAndNewPassEqualError'
        };
        /*
        throw new UserInputError('Old and new passwords cannot be equal', {
          errorName: 'currAndNewPassEqualError'
        });
        */
      }

      // Password must contain min 8 chars, at least one lower, upper and number character
      if (!validator.isStrongPassword(newPassword, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0, returnScore: false }) || newPassword.length > 50) {
        return { 
          __typename: 'Error',
          errorCode: 'passwordValidationError'
        };
        /*
        throw new UserInputError('Password validation error', {
          errorName: 'passwordValidationError'
        });
        */
      }

      const account = await Account.findByPk(currentUser.id);

      // If user is found, compare the crypted password to the hash fetched from database
      const passwordCorrect = account === null
        ? false
        : await bcrypt.compare(currentPassword, account.passwordHash);

      if (!passwordCorrect) {
        return { 
          __typename: 'Error',
          errorCode: 'currentPasswordIncorrect'
        };
        /*
        throw new AuthenticationError('Current password invalid', {
          errorName: 'currentPasswordIncorrect'
        });
        */
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
          errorCode: 'connectionError'
        };
        /*
        throw new ForbiddenError('Something went wrong, pleasy try again', {
          errorName: 'connectionError'
        });
        */
      }
    },
  }
};

module.exports = {
  typeDef,
  resolvers
};
