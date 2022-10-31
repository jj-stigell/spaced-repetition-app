/* Create an executable scheme from all the typedefs and merged resolvers */
const { merge } = require('lodash');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { typeDef: Account, resolvers: accountResolvers } = require('./account/');
const { typeDef: Card, resolvers: cardResolvers } = require('./card/');
const { typeDef: Kanji, resolvers: kanjiResolvers } = require('./kanji/');

const schema = makeExecutableSchema({
  typeDefs: [ Account, Card, Kanji ],
  resolvers: merge(accountResolvers, cardResolvers, kanjiResolvers),
});

module.exports = schema;
