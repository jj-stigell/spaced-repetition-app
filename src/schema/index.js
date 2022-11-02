/* Create an executable scheme from all the typedefs and merged resolvers */
const { merge } = require('lodash');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { typeDefs: Account, resolvers: accountResolvers } = require('./account/');
const { typeDefs: Card, resolvers: cardResolvers } = require('./card/');
const { typeDefs: Kanji, resolvers: kanjiResolvers } = require('./kanji/');

const schema = makeExecutableSchema({
  typeDefs: [ Account, Card, Kanji ],
  resolvers: merge(accountResolvers, cardResolvers, kanjiResolvers),
});

module.exports = schema;
