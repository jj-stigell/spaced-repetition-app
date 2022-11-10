const typeDefs = `
scalar Date

type Account {
  id: ID!
  email: String
  username: String
  password: String
}

type Success {
  status: Boolean!
}

type AccountCard {
  id: Int
  reviewCount: Int
  easyFactor: Float
  accountStory: String
  accountHint: String
  dueAt: Date
  mature: Boolean
}

type KanjiTranslation {
  keyword: String
  story: String
  hint: String
  otherMeanings: String
  description: String
  createdAt: Date
  updatedAt: Date
}

type WordTranslation {
  translation: String
  hint: String
  description: String
  createdAt: Date
  updatedAt: Date
}

type RadicalTranslation {
  translation: String
  description: String
  createdAt: Date
  updatedAt: Date
}

type Radical {
  radical: String
  reading: String
  readingRomaji: String
  strokeCount: Int
  createdAt: Date
  updatedAt: Date
  radical_translations: [RadicalTranslation]
}

type Kanji {
  id: Int
  kanji: String
  jlptLevel: Int
  onyomi: String
  onyomiRomaji: String
  kunyomi: String
  kunyomiRomaji: String
  strokeCount: Int
  createdAt: Date
  updatedAt: Date
  kanji_translations: [KanjiTranslation]
  radicals: [Radical]
}

type Word {
  id: Int
  word: String
  jlptLevel: Int
  furigana: Boolean
  reading: String
  readingRomaji: String
  createdAt: Date
  updatedAt: Date
  word_translations: [WordTranslation]
}

type Card {
  id: Int
  type: String
  createdAt: Date
  updatedAt: Date
  account_cards: [AccountCard]
  kanji: Kanji
  word: Word
}

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

type Statistics {
  status: String
  count: Int
}

type Day {
  date: Date
  reviews: Int
}

type Reviews {
  reviews: [Day]
}

type Cardset {
  Cards: [Card]
}

type DeckList {
  Decks: [Deck]
}

type Query {
  fetchCards(
    deckId: Int!
    languageId: String
    newCards: Boolean
  ): Cardset!

  fetchCardsByType(
    type: String!
    languageId: String
  ): Cardset!

  fetchLearningStatistics(
    cardType: String!
  ): [Statistics!]!

  fetchDecks: DeckList!

  fecthDeckSettings(
    deckId: Int!
  ): DeckSettings!

  fetchReviewHistory(
    limitReviews: Int!
  ): Reviews!

  fetchDueCount(
    limitReviews: Int!
  ): Reviews!
}

type Mutation {
  rescheduleCard(
    cardId: Int!
    reviewResult: String!
    newInterval: Int!
    newEasyFactor: Float!
    extraReview: Boolean
    timing: Float
  ): Success!

  changeDeckSettings(
    deckId: Int!
    favorite: Boolean
    reviewInterval: Int
    reviewsPerDay: Int
    newCardsPerDay: Int
  ): DeckSettings!

  pushCards(
    deckId: Int
    days: Int
  ): Success!

  editAccountCard(
    cardId: Int!
    story: String
    hint: String
  ): AccountCard!
}`;

module.exports = typeDefs;
