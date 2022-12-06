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

type Statistics {
  matured: Int
  learning: Int
  new: Int
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
  ): Statistics!

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
