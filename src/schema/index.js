const { merge } = require('lodash');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { typeDef: User, resolvers: userResolvers } = require('./user.js');

const schema = makeExecutableSchema({
  typeDefs: [ User ],
  resolvers: merge(userResolvers),
});

module.exports = schema;
