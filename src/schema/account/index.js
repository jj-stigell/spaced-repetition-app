const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_SECRET } = require('../../util/config');
const { Account } = require('../../models');
const { Op } = require('sequelize');
const errors = require('../../util/errors');
const constants = require('../../util/constants');
const { emailAvailableSchema, createAccountSchema, loginSchema, changePasswordSchema } = require('../../util/validation');
const formatYupError = require('../../util/errorFormatter');

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
    errorCodes: [String!]
  }

  union LoginPayload = AccountToken | Error
  union RegisterResult = Account | Error
  union ChangePasswordResult = Success | Error
  union emailAvailable = Success | Error

  type Query {
    emailAvailable(
      email: String!
    ): emailAvailable!
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
    emailAvailable: async (_, { email }) => {

      // Validate input
      try {
        await emailAvailableSchema.validate({ email }, { abortEarly: false });
      } catch (error) {
        return { 
          __typename: 'Error',
          errorCodes: formatYupError(error)
        };
      }
      
      // Check that email is not in use, case insensitive
      let result = false;
      try {
        const emailInUse = await Account.findOne({
          attributes: ['id'],
          where: {
            email: {
              [Op.iLike]: email
            }
          }
        });
        if (!emailInUse) {
          result = true;
        }
        return { 
          __typename: 'Success',
          status: result
        };
      } catch(error) {
        console.log(error.errors);
        return { 
          __typename: 'Error',
          errorCodes: [errors.internalServerError]
        };
      }
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
        const passwordHash = await bcrypt.hash(password, constants.saltRounds);

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

      // Validate input
      try {
        await changePasswordSchema.validate({ currentPassword, newPassword, newPasswordConfirmation }, { abortEarly: false });
      } catch (error) {
        return { 
          __typename: 'Error',
          errorCodes: formatYupError(error)
        };
      }

      let account;

      try {
        // Find user and check that password matches
        account = await Account.findByPk(currentUser.id);

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
      } catch(error) {
        console.log(error.errors);
        return { 
          __typename: 'Error',
          errorCodes: [errors.internalServerError]
        };
      }

      try {
        // Update password if all validations pass
        const passwordHash = await bcrypt.hash(newPassword, constants.saltRounds);

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
