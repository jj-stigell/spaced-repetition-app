const typeDefs = `
scalar Date

enum CardType {
  KANJI
  HIRAGANA
  KATAKANA
  WORD
  SENTENCE
}

enum ReviewType {
  RECALL
  RECOGNISE
}

enum ReviewResult {
  AGAIN
  GOOD
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
  cardType: CardType
  reviewType: ReviewType
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
  count: Int
}

type Reviews {
  reviews: [Day]
}

type AccountCardCustomData {
  id: Int
  accountId: Int
  cardId: Int
  accountStory: String
  accountHint: String
  createdAt: Date
  updatedAt: Date
}

type Query {
  cardsFromDeck(
    deckId: Int!
    languageId: Language! = EN
    newCards: Boolean
    date: Date!
  ): [Card!]!

  cardsByType(
    cardType: CardType!
    languageId: Language = EN
  ): [Card!]!

  reviewHistory(
    limitReviews: Int!
  ): [Day!]!

  dueCount(
    limitReviews: Int!
    date: Date!
  ): [Day!]!

  learningStatisticsByType(
    cardType: CardType!
    reviewType: ReviewType!
  ): Statistics!
}

type Mutation {
  rescheduleCard(
    cardId: Int!
    reviewResult: ReviewResult!
    newInterval: Int!
    newEasyFactor: Float!
    extraReview: Boolean
    timing: Int
    date: Date!
    reviewType: ReviewType!
  ): AccountCard!

  pushCards(
    deckId: Int
    days: Int!
    date: Date!
  ): Boolean!

  editAccountCard(
    cardId: Int!
    story: String
    hint: String
  ): AccountCardCustomData!
}`;

module.exports = typeDefs;
