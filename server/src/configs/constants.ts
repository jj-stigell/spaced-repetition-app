import {
  AccountConstants, BugConstants, CardConstants,
  RegexConstants, ReviewConstants
} from '../types';

export const account: AccountConstants = {
  USERNAME_MAX_LENGTH: 14,
  USERNAME_MIN_LENGTH: 4,
  PASSWORD_MAX_LENGTH: 50,
  PASSWORD_MIN_LENGTH: 8,
  EMAIL_MAX_LENGTH: 255,
  CONFIRMATION_EXPIRY_TIME: 86400000, // 24 hours
  JWT_EXPIRY_TIME: 86400000 * 31, // 24 hours
  SESSION_LIFETIME: 28 // How long a new session will last in days, same as jwt expiry time
};

export const bugs: BugConstants = {
  BUG_REPORTS_PER_PAGE_MAX: 50,
  BUG_MESSAGE_MIN_LENGTH: 5,
  BUG_MESSAGE_MAX_LENGTH: 100,
  SOLVED_MESSAGE_MIN_LENGTH: 1,
  SOLVED_MESSAGE_MAX_LENGTH: 160,
  BUG_TYPES: ['TRANSLATION', 'UI', 'FUNCTIONALITY', 'OTHER']
};

export const card: CardConstants = {
  CARD_TYPES: ['KANJI', 'HIRAGANA', 'KATAKANA', 'VOCABULARY', 'SENTENCE'],
  STORY_MIN_LENGTH: 1,
  STORY_MAX_LENGTH: 160,
  HINT_MIN_LENGTH: 1,
  HINT_MAX_LENGTH: 25,
  DEFAULT_EASY_FACTOR: 2.5
};

export const regex: RegexConstants = {
  LOWERCASE_REGEX: /^(?=.*[a-z])/,
  UPPERCASE_REGEX: /^(?=.*[A-Z])/,
  NUMBER_REGEX: /^(?=.*[0-9])/,
  DATE_REGEX: /^\d{4}-(0?[1-9]|1[0-2])-(0?[1-9]|[12]\d|3[01])$/ // leap years?
};

export const review: ReviewConstants = {
  RESULT_TYPES: ['AGAIN', 'GOOD'],
  REVIEW_TYPES: ['RECALL', 'RECOGNISE'],
  MAX_LIMIT_REVIEWS: 999,
  MIN_LIMIT_REVIEWS: 0,
  MAX_NEW_REVIEWS: 100,
  MIN_NEW_REVIEWS: 0,
  MAX_PUSH_REVIEWS_DAYS: 7, // How many days can user at maximum push reviews ahead
  DEFAULT_INTERVAL: 999,
  DEFAULT_REVIEW_PER_DAY: 999,
  DEFAULT_NEW_PERDAY: 15,
  MATURE_INTERVAL: 21,
  MAX_REVIEW_INTERVAL: 999,
  MIN_REVIEW_INTERVAL: 1
};
