export enum CardType {
  KANJI = 'KANJI',
  HIRAGANA = 'HIRAGANA',
  KATAKANA = 'KATAKANA',
  VOCABULARY = 'VOCABULARY',
  SENTENCE = 'SENTENCE'
}

export enum ReviewType {
  RECALL = 'RECALL',
  RECOGNISE = 'RECOGNISE',
  WRITE = 'WRITE'
}

export type AnswerOption = {
  option: string
  correct: boolean
}

export type KanaCard = {
  story: string
  hint: string
}

export type KanjiCard = {
  story: string
  hint: string
  onyomi: string
  kunyomi: string
  onyomiRomaji: string
  kunyomiRomaji: string
}

export type Example = {
  id: number
  type: string | undefined
  example: string
  translation: string
  furigana: string
  audio: string
}

export type VocabularyCard = {
  reading: string
  readingRomaji: string
}

export type Card = {
  id: number
  learningOrder: number
  cardType: CardType
  reviewType: ReviewType
  card: {
    value: string
    keyword: string // English translation of the value.
    answerOptions: AnswerOption[],
    jlptLevel: number
  } & (KanjiCard | VocabularyCard | KanaCard)
}
