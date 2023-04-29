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

export interface answerOption {
  option: string
  correct: boolean
}

export interface KanaCard {
  kana: string
  story: string
  hint: string
  answerOptions: answerOption[]
}

export interface KanjiCard {
  kanji: string
  keyword: string
  story: string
  hint: string
  onyomi: string
  kunyomi: string
  onyomiRomaji: string
  kunyomiRomaji: string
  answerOptions: answerOption[]
}

export interface VocabularyCard {
  word: string
  keyword: string
  reading: string
  readingRomaji: string
  answerOptions: answerOption[]
}

export interface Card {
  id: number
  cardType: CardType
  reviewType: ReviewType
  card: KanjiCard | VocabularyCard | KanaCard
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

export interface Category {
  id: DeckCategory
  name: string
}
