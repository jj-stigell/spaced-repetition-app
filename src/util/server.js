const { ApolloServer } = require('apollo-server');
const { InMemoryLRUCache } = require('@apollo/utils.keyvaluecache');
const { JWT_SECRET, NODE_ENV } = require('./config');
const schema = require('../schema');
const jwt = require('jsonwebtoken');
//const { Account } = require('../models');
const errorLogger = require('./errors/errorLogger');

const server = new ApolloServer({
  cache: new InMemoryLRUCache(),
  schema,
  introspection: NODE_ENV === 'development',
  context: async ({ req }) => {
    const auth = req?.headers?.authorization ?? null;
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      try {
        const currentUser = jwt.verify(
          auth.substring(7), JWT_SECRET
        );
        const userAgent = req?.headers['user-agent'] ?? null;
        //const currentUser = await Account.findByPk(decodedToken.id);
        return { currentUser, userAgent };
      } catch(error) {
        errorLogger(error);
      } 
    }
  }
});

module.exports = server;
