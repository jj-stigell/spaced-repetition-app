export type AccountAction = {
  id: number,
  accountId: number;
  type: string;
  expireAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type BugReport = {
  id: number;
  accountId: number;
  cardId: number;
  type: string;
  bugMessage: string;
  solvedMessage: string;
  solved: boolean;
  createdAt: Date;
  updatedAt: Date;
};






/*
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






export interface DeckAdmin extends Deck, Pick<Deck, 'id' | 'memberOnly' | 'cards'> {
  active: boolean
  category: DeckCategory
  deckName: string
  jlptLevel: JlptLevel
  languageId: string
  updatedAt: Date
  createdAt: Date
}

  declare id: CreationOptional<number>;
  declare accountId: ForeignKey<Account['id']>;
  declare cardId: CreationOptional<ForeignKey<Card['id']>>;
  declare type: string;
  declare bugMessage: string;
  declare solvedMessage: CreationOptional<string>;
  declare solved: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;





export interface BugReport {
  id: number
  accountId: number
  cardId: number
  type: string
  bugMessage: string
  solvedMessage: string
  solved: boolean
  createdAt: Date
  updatedAt: Date
}

export interface DeckAdmin {
  id: number //
  memberOnly: boolean //
  active: boolean
  category: DeckCategory
  deckName: string
  jlptLevel: JlptLevel
  languageId: string
  cards: number //
  updatedAt: Date
  createdAt: Date
}

export interface Deck extends Progress {
  id: number //
  memberOnly: boolean //
  translationAvailable: boolean
  title: string
  description: string
  cards: number //
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

export interface Example {
  id: number
  type: string | undefined
  example: string
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

export interface RadarChartPayload {
  label: string
  value: number
}

*/
