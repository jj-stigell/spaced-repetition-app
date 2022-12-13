const typeDefs = `
scalar Date

enum CardType {
  KANJI
  HIRAGANA
  KATAKANA
  WORD
  SENTENCE
}

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
  createdAt: Date
  updatedAt: Date
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
  translation: RadicalTranslation
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
  translation: KanjiTranslation
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
  translation: WordTranslation
}

type Card {
  id: Int
  type: String
  createdAt: Date
  updatedAt: Date
  accountCard: AccountCard
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

type Query {
  fetchCards(
    deckId: Int!
    languageId: Language! = EN
    newCards: Boolean
  ): [Card!]!

  cardsByType(
    cardType: CardType!
    languageId: Language! = EN
  ): [Card!]!

  reviewHistory(
    limitReviews: Int!
  ): [Day!]!

  dueCount(
    limitReviews: Int!
  ): [Day!]!

  learningStatistics(
    cardType: CardType!
  ): Statistics!
}

type Mutation {
  rescheduleCard(
    cardId: Int!
    reviewResult: String!
    newInterval: Int!
    newEasyFactor: Float!
    extraReview: Boolean
    timing: Int
  ): AccountCard!

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
