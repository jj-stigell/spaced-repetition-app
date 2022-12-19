const { InMemoryLRUCache } = require('@apollo/utils.keyvaluecache');
const { ApolloServer } = require('apollo-server');
const jwt = require('jsonwebtoken');
const { defaultError } = require('../util/errors/graphQlErrors');
const { validateSession } = require('./authorization');
const { JWT_SECRET, NODE_ENV } = require('./config');
const errors = require('./errors/errors');
const schema = require('../schema');

const server = new ApolloServer({
  cache: new InMemoryLRUCache(),
  schema,
  introspection: NODE_ENV === 'development',
  context: async ({ req }) => {
    const auth = req?.headers?.authorization ?? null;
    let currentUser;
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      try {
        currentUser = jwt.verify(
          auth.substring(7), JWT_SECRET
        );
      } catch(error) {
        return defaultError(errors.session.jwtExpiredError);
      }
      await validateSession(currentUser.session);
      const userAgent = req?.headers['user-agent'] ?? null;
      return { currentUser, userAgent };
    }
  }
});

module.exports = server;
