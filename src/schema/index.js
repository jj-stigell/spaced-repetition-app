/* Create an executable scheme from all the typedefs and merged resolvers */
const { merge } = require('lodash');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { typeDefs: Account, resolvers: accountResolvers } = require('./account/');
const { typeDefs: Card, resolvers: cardResolvers } = require('./card/');
const { typeDefs: Deck, resolvers: deckResolvers } = require('./deck/');
const { typeDefs: Bug, resolvers: bugResolvers } = require('./bug/');

const schema = makeExecutableSchema({
  typeDefs: [ Account, Card, Deck, Bug ],
  resolvers: merge(accountResolvers, cardResolvers, deckResolvers, bugResolvers),
});

module.exports = schema;
