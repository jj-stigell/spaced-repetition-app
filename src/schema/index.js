/** Create an executable scheme from all the typedefs and merged resolvers */
const { merge } = require('lodash');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { typeDef: Account, resolvers: accountResolvers } = require('./account/');

const schema = makeExecutableSchema({
  typeDefs: [ Account ],
  resolvers: merge(accountResolvers),
});

module.exports = schema;
