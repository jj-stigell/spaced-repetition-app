const { UserInputError } = require('apollo-server');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_SECRET } = require('../util/config');
const { Account } = require('../models');

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
    accountInformation: Account!
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
  }
`;

const resolvers = {
  Query: {
    // eslint-disable-next-line no-unused-vars
    accountInformation: async (_, args) => {
      // temp placeholder
      const account = {
        id: 12345,
        email: 'test@google.com',
        username: 'username',
        password: 'password',
      };

      return account;
    },
  },
  Mutation: {
    createAccount: async (_, { email, username, password, passwordConfirmation }) => {

      /**
       * Validate new account input:
       * - check email is valid and not in use
       * - check username is correct length (4-12 char), not in use and sanitized
       * - check password matches with confirmation, correct length and includes required symbols
       */

      // Check for valid email
      if (!validator.isEmail(email)) {
        throw new UserInputError('Email is not a valid email');
      }

      // Check that confirmation matches to password
      if (password !== passwordConfirmation) {
        throw new UserInputError('Password and confirmation do not match');
      }

      try {
        const account = await Account.create({
          email: email.toLowerCase(),
          username: username,
          password: password,
        });
        return account;
      } catch(error) {
        console.log(error.errors);
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

      // const user = await User.findOne({ email: email.toLowerCase() });
      // temp placeholder
      const account = {
        id: 12345,
        username: 'mr.test',
        passwordHash: 'examplehashthisissaidyodawhendrinkingbeerwithobiwan'
      };

      // If user is found, compare the crypted password to the hash fetched from database
      const passwordCorrect = account === null
        ? false
        : await bcrypt.compare(password, account.passwordHash);

      console.log('account is ok:', account !== null);
      console.log('password is correct:', passwordCorrect);
    
      if (!account || !passwordCorrect) {
        throw new UserInputError('Username or password invalid');
      }
    
      const accountForToken = {
        username: account.username,
        id: account.id,
      };

      return { value: jwt.sign(accountForToken, JWT_SECRET) };
    },
  }
};

module.exports = {
  typeDef,
  resolvers
};
