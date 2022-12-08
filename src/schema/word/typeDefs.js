const typeDefs = `
scalar Date

type AccountCard {
  id: Int
  reviewCount: Int
  easyFactor: Float
  accountStory: String
  accountHint: String
  dueAt: Date
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

type Kanjiset {
  KanjiList: [Kanji]
}

union KanjiCardPayload = Kanjiset | Kanji

type Query {
  fetchKanji(
    kanjiId: Int
    includeAccountCard: Boolean
  ): KanjiCardPayload!
}`;

module.exports = typeDefs;
