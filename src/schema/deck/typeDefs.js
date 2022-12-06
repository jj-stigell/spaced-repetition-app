const typeDefs = `
scalar Date

type DeckTranslation {
  id: Int
  languageId: String
  title: String
  description: String
  active: Boolean
  createdAt: Date
  updatedAt: Date
}

type Deck {
  id: Int
  deckName: String
  type: String
  subscriberOnly: Boolean
  languageId: String
  active: Boolean
  createdAt: Date
  updatedAt: Date
  deck_translations: [DeckTranslation]
}

type DeckSettings {
  id: Int
  accountId: Int
  deckId: Int
  favorite: Boolean
  reviewInterval: Int
  reviewsPerDay: Int
  newCardsPerDay: Int
  createdAt: Date
  updatedAt: Date
}

type DeckList {
  Decks: [Deck]
}

type Query {
  fetchDecks: DeckList!

  fecthDeckSettings(
    deckId: Int!
  ): DeckSettings!
}

type Mutation {
  changeDeckSettings(
    deckId: Int!
    favorite: Boolean
    reviewInterval: Int
    reviewsPerDay: Int
    newCardsPerDay: Int
  ): DeckSettings!
}`;

module.exports = typeDefs;