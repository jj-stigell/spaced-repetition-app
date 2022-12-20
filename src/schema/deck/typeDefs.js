const typeDefs = `
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
  subscriberOnly: Boolean
  languageId: String
  active: Boolean
  createdAt: Date
  updatedAt: Date
  deckTranslations: [DeckTranslation]
  accountDeckSettings: DeckSettings
}

type DeckSettings {
  id: Int
  accountId: Int
  deckId: Int
  favorite: Boolean
  dueCards: Int
  reviewInterval: Int
  reviewsPerDay: Int
  newCardsPerDay: Int
  createdAt: Date
  updatedAt: Date
}

type Query {
  decks(
    date: Date!
  ): [Deck!]!

  deckSettings(
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
