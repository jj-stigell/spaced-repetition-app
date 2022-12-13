const { ApolloServer } = require('apollo-server');
const { InMemoryLRUCache } = require('@apollo/utils.keyvaluecache');
const { internalServerError } = require('../util/errors/graphQlErrors');
const { JWT_SECRET, NODE_ENV } = require('./config');
const { validateSession } = require('./authorization');
const schema = require('../schema');
const jwt = require('jsonwebtoken');

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
        return internalServerError(error);
      }
      await validateSession(currentUser.session);
      const userAgent = req?.headers['user-agent'] ?? null;
      return { currentUser, userAgent };
    }
  }
});

module.exports = server;
