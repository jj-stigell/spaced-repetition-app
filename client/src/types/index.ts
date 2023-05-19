/* Type for weekly occurring event. */
export interface WeeklyEvent {
  weekday: number
  startHour: number
  endHour: number
  timeZone: string
  multiplier: number
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData extends LoginData {
  username: string
  passwordConfirmation: string
  allowNewsLetter?: boolean
  language: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  newPasswordConfirmation: string
}

export enum JlptLevel {
  N1 = 1,
  N2,
  N3,
  N4,
  N5,
}

export enum Role {
  NON_MEMBER = 'NON_MEMBER',
  MEMBER = 'MEMBER',
  READ_RIGHT = 'READ_RIGHT',
  WRITE_RIGHT = 'WRITE_RIGHT',
  SUPERUSER = 'SUPERUSER'
}

export enum DeckCategory {
  CUSTOM = 'CUSTOM',
  FAVORITE = 'FAVORITE',
  KANA = 'KANA',
  KANJI = 'KANJI',
  VOCABULARY = 'VOCABULARY',
  GRAMMAR = 'GRAMMAR'
}

export enum CardType {
  KANJI = 'KANJI',
  HIRAGANA = 'HIRAGANA',
  KATAKANA = 'KATAKANA',
  VOCABULARY = 'VOCABULARY'
}

export enum ReviewType {
  RECALL = 'RECALL',
  RECOGNISE = 'RECOGNISE',
}

export interface Category extends Progress {
  readonly category: DeckCategory
  readonly decks: number
}

export interface Deck extends Progress {
  id: number
  memberOnly: boolean
  translationAvailable: boolean
  title: string
  description: string
  cards: number
  favorite?: boolean
}

export interface Progress {
  progress?: {
    new: number
    learning: number
    mature: number
  }
}

export interface AnswerOption {
  option: string
  correct: boolean
}

export interface KanaCard {
  story: string
  hint: string
}

export interface KanjiCard {
  story: string
  hint: string
  onyomi: string
  kunyomi: string
  onyomiRomaji: string
  kunyomiRomaji: string
}

export interface ExampleSentence {
  id: number
  sentence: string
  translation: string
  furigana: string
  audio: string
}

export interface VocabularyCard {
  reading: string
  readingRomaji: string
}

export interface Card {
  id: number
  learningOrder: number
  cardType: CardType
  reviewType: ReviewType
  card: {
    value: string
    keyword: string
    answerOptions: AnswerOption[]
  } & (KanjiCard | VocabularyCard | KanaCard)
}

export interface CardStore {
  cards: string[]
  activeCard: boolean | null
  test: number
}

export interface JLPT {
  id: string
  name: string
}

/*
export interface Category {
  id: DeckCategory
  name: string
}
*/
