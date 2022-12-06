/* Create an executable scheme from all the typedefs and merged resolvers */
const { merge } = require('lodash');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { typeDefs: Account, resolvers: accountResolvers } = require('./account/');
const { typeDefs: Card, resolvers: cardResolvers } = require('./card/');
const { typeDefs: Deck, resolvers: deckResolvers } = require('./deck/');
const { typeDefs: Kanji, resolvers: kanjiResolvers } = require('./kanji/');
const { typeDefs: Bug, resolvers: bugResolvers } = require('./bug/');

const schema = makeExecutableSchema({
  typeDefs: [ Account, Card, Deck, Kanji, Bug ],
  resolvers: merge(accountResolvers, cardResolvers, deckResolvers, kanjiResolvers, bugResolvers),
});

module.exports = schema;
