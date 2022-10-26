const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_SECRET } = require('../../util/config');
const { Account } = require('../../models');
const { Op } = require('sequelize');
const errors = require('../../util/errors');
const { createAccountSchema, loginSchema } = require('../../util/validation');
const formatYupError = require('../../util/errorFormatter');
const constants = require('../../util/constants');

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
    errorCodess: [String!]
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

      // Validate input
      try {
        await createAccountSchema.validate({ email, password, passwordConfirmation, languageId }, { abortEarly: false });
      } catch (error) {
        return { 
          __typename: 'Error',
          errorCodes: formatYupError(error)
        };
      }

      try {
        // Check that email not reserved, emails stored in lowercase
        const emailInUse = await Account.findOne({
          attributes: ['id'],
          where: {
            email: email.toLowerCase()
          }
        });

        if (emailInUse) {
          return { 
            __typename: 'Error',
            errorCodes: [errors.emailInUseError]
          };
        }
      } catch(error) {
        console.log(error.errors);
        return { 
          __typename: 'Error',
          errorCodes: [errors.internalServerError]
        };
      }

      try {
        // Create a new account if all validations pass
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
          errorCodes: [errors.internalServerError]
        };
      }
    },
    login: async (_, { email, password }) => {
      // Validate input
      try {
        await loginSchema.validate({ email, password }, { abortEarly: false });
      } catch (error) {
        return { 
          __typename: 'Error',
          errorCodes: formatYupError(error)
        };
      }

      try {
        // Try to find the user from db
        const account = await Account.findOne({ where: { email: email.toLowerCase() } });

        // If user is found, compare the crypted password to the hash fetched from database
        const passwordCorrect = account === null
          ? false
          : await bcrypt.compare(password, account.passwordHash);
  
        if (!account || !passwordCorrect) {
          return { 
            __typename: 'Error',
            errorCodes: [errors.userOrPassIncorrectError]
          };
        }
  
        return { 
          __typename: 'AccountToken',
          token: { value: jwt.sign( { id: account.id }, JWT_SECRET, { expiresIn: constants.jwtExpiryTime } )},
          user: { id: account.id, email: account.email }
        };

      } catch(error) {
        console.log(error.errors);
        return { 
          __typename: 'Error',
          errorCodes: [errors.internalServerError]
        };
      }
    },
    changePassword: async (_, { currentPassword, newPassword, newPasswordConfirmation }, { currentUser }) => {

      if (!currentUser) {
        return { 
          __typename: 'Error',
          errorCodes: [errors.notAuthError]
        };
      }

      // Confirm that currentPassword, newPassword, newPasswordConfirmation not empty
      if (!currentPassword || !newPassword || !newPasswordConfirmation) {
        return { 
          __typename: 'Error',
          errorCodes: [errors.changePasswordValueMissingError]
        };
      }

      // Check that confirmation matches to password
      if (newPassword !== newPasswordConfirmation) {
        return { 
          __typename: 'Error',
          errorCodes: [errors.passwordMismatchError]
        };
      }

      // Check that new password is not same ass old one
      if (newPassword === currentPassword) {
        return { 
          __typename: 'Error',
          errorCodes: [errors.currAndNewPassEqualError]
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
          errorCodes: [errors.passwordValidationError]
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
          errorCodes: [errors.currentPasswordIncorrect]
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
          errorCodes: [errors.internalServerError]
        };
      }
    },
  }
};

module.exports = {
  typeDef,
  resolvers
};
