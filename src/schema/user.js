const { UserInputError } = require('apollo-server');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_SECRET } = require('../util/config');

const typeDef = `
  type User {
    id: ID!
    email: String
    username: String
    password: String
  }

  type Token {
    value: String!
  }

  type Query {
    userInformation: User!
  }

  type Mutation {
    createUser(
      email: String!
      username: String!
      password: String!
      passwordConfirmation: String!
    ): User

    login(
      email: String!
      password: String!
    ): Token
  }
`;

const resolvers = {
  Query: {
    userInformation: async (root, args) => {
      // temp placeholder
      const user = {
        id: 12345,
        email: 'test@google.com',
        username: 'username',
        password: 'password',
      };

      return user;
    },
  },
  Mutation: {
    createUser: async (root, { email, username, password, passwordConfirmation }) => {

      /**
       * Validate new user input:
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

      // temp placeholder
      const user = {
        id: 12345,
        email: 'test@google.com',
        username: username,
        password: password,
      };

      return user;
    },
    login: async (root, { email, password }) => {

      // Confirm that email and password not empty
      if (!email || !password) {
        throw new UserInputError('Email and/or password is missing');
      }

      // Confirm for valid email
      if (!validator.isEmail(email)) {
        throw new UserInputError('Email is not a valid email');
      }

      // const user = await User.findOne({ email: email });
      // temp placeholder
      const user = {
        id: 12345,
        username: 'mr.test',
        passwordHash: 'examplehashthisissaidyodawhendrinkingbeerwithobiwan'
      };

      // If user is found, compare the crypted password to the hash fetched from database
      const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash);

      console.log('user is ok:', user !== null);
      console.log('password is correct:', passwordCorrect);
    
      if (!user || !passwordCorrect) {
        throw new UserInputError('Username or password invalid');
      }
    
      const userForToken = {
        username: user.username,
        id: user.id,
      };

      return { value: jwt.sign(userForToken, JWT_SECRET) };
    },
  }
};

module.exports = {
  typeDef,
  resolvers
};
