const { UserInputError } = require('apollo-server');
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
    password: String
  }

  type Token {
    value: String!
  }

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
    ): Account

    login(
      email: String!
      password: String!
    ): Token

    changePassword(
      currentPassword: String!
      newPassword: String!
      newPasswordConfirmation: String!
    ): Boolean!
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

      // Check for valid email
      if (!validator.isEmail(email)) {
        throw new UserInputError('Email is not a valid email');
      }

      // Check that email not reserved, emails stored in lowercase
      const emailInUse = await Account.findOne({ where: { email: email.toLowerCase() } });
      if (emailInUse) {
        throw new UserInputError('Email is already in use');
      }

      // Check that username is according to rules, length 1-14, and alphanumeric
      if (!validator.isAlphanumeric(username) || !validator.isLength(username, { min: 1, max: 14 })) {
        throw new UserInputError('Username must be 1 to 14 characters and contain only letters a-z and numbers 1-9');
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
        throw new UserInputError('Username is already in use');
      }

      // Check that confirmation matches to password
      if (password !== passwordConfirmation) {
        throw new UserInputError('Password and confirmation do not match');
      }

      // Password must contain min 8 chars, at least one lower, upper and number character
      if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0, returnScore: false })) {
        throw new UserInputError('Password must contain minimum 8 characters, at least one lower, upper and number character');
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
        return account;
      } catch(error) {
        console.log(error.errors);
        throw new UserInputError('Something went wrong, pleasy try again');
      }
    },
    login: async (_, { email, password }) => {

      // Confirm that email and password not empty
      if (!email || !password) {
        throw new UserInputError('Email and/or password is missing');
      }

      // Confirm for valid email
      if (!validator.isEmail(email)) {
        throw new UserInputError('Email is not a valid email');
      }

      const account = await Account.findOne({ where: { email: email.toLowerCase() } });

      // If user is found, compare the crypted password to the hash fetched from database
      const passwordCorrect = account === null
        ? false
        : await bcrypt.compare(password, account.passwordHash);

      if (!account || !passwordCorrect) {
        throw new UserInputError('Username or password invalid');
      }
    
      const accountForToken = {
        username: account.username,
        id: account.id,
      };

      return { value: jwt.sign(accountForToken, JWT_SECRET) };
    },
    changePassword: async (_, { currentPassword, newPassword, newPasswordConfirmation }, { currentUser }) => {

      if (!currentUser) {
        throw new UserInputError('Not authenticated');
      }

      // Check that confirmation matches to password
      if (newPassword !== newPasswordConfirmation) {
        throw new UserInputError('New password and confirmation do not match');
      }

      // Check that new password is not same ass old one
      if (newPassword === currentPassword) {
        throw new UserInputError('New password cannot be same with the old one');
      }

      const account = await Account.findByPk(currentUser.id);

      // If user is found, compare the crypted password to the hash fetched from database
      const passwordCorrect = account === null
        ? false
        : await bcrypt.compare(currentPassword, account.passwordHash);

      if (!passwordCorrect) {
        throw new UserInputError('Current password invalid');
      }

      // Update password if all validations pass
      try {
        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(newPassword, saltRounds);

        // Update new password hash to account and save
        account.passwordHash = passwordHash;
        await account.save();
        return true;
      } catch(error) {
        console.log(error.errors);
        throw new UserInputError('Something went wrong, pleasy try again');
      }
    },
  }
};

module.exports = {
  typeDef,
  resolvers
};
