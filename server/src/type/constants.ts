// Constant types.
export type AccountConstants = {
  readonly USERNAME_MAX_LENGTH: number;
  readonly USERNAME_MIN_LENGTH: number;
  readonly PASSWORD_MAX_LENGTH: number;
  readonly PASSWORD_MIN_LENGTH: number;
  readonly EMAIL_MAX_LENGTH: number;
  readonly CONFIRMATION_EXPIRY_TIME: number;
  readonly JWT_EXPIRY_TIME: number;
  readonly SESSION_LIFETIME: number;
};

export type BugConstants = {
  readonly BUG_REPORTS_PER_PAGE_MAX: number;
  readonly BUG_MESSAGE_MIN_LENGTH: number;
  readonly BUG_MESSAGE_MAX_LENGTH: number;
  readonly SOLVED_MESSAGE_MIN_LENGTH: number;
  readonly SOLVED_MESSAGE_MAX_LENGTH: number;
  readonly BUG_TYPES: Array<string>;
};

export type CardConstants = {
  readonly CARD_TYPES: Array<string>;
  readonly STORY_MIN_LENGTH: number;
  readonly STORY_MAX_LENGTH: number;
  readonly HINT_MIN_LENGTH: number;
  readonly HINT_MAX_LENGTH: number;
  readonly DEFAULT_EASY_FACTOR: number;
};

export type DeckConstants = {
  readonly MAX_AMOUNT_OF_DECKS: number;
};

export type GeneralConstants = {
  readonly FRONTEND_URL: string;
  readonly DEFAULT_LANGUAGE: string;
  readonly AVAILABLE_LANGUAGES: Array<string>;
  readonly JLPT_LEVELS: Array<number>;
};

export type RegexConstants = {
  readonly LOWERCASE_REGEX: RegExp;
  readonly UPPERCASE_REGEX: RegExp;
  readonly NUMBER_REGEX: RegExp;
  readonly DATE_REGEX: RegExp;
};

export type ReviewConstants = {
  readonly RESULT_TYPES: Array<string>;
  readonly REVIEW_TYPES: Array<string>;
  readonly MAX_LIMIT_REVIEWS: number;
  readonly MIN_LIMIT_REVIEWS: number;
  readonly MAX_NEW_REVIEWS: number;
  readonly MIN_NEW_REVIEWS: number;
  readonly  MAX_PUSH_REVIEWS_DAYS: number;
  readonly DEFAULT_INTERVAL: number;
  readonly  DEFAULT_REVIEW_PER_DAY: number;
  readonly  DEFAULT_NEW_PERDAY: number;
  readonly MATURE_INTERVAL: number;
  readonly  MAX_REVIEW_INTERVAL: number;
  readonly MIN_REVIEW_INTERVAL: number;
};
