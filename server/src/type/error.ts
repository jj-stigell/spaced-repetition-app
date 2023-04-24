// Project imports
import { HttpCode } from './httpCode';

export class ApiError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: HttpCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

export class InvalidCredentials extends Error {
  constructor() {
    super('invalid credentials');
  }
}

export type ApiErrorContent = {
  code: string
}

// Error Types.
export type AccountErrors = {
  readonly ERR_ACCOUNT_NOT_FOUND: string;
  readonly ERR_USERNAME_IN_USE: string;
  readonly ERR_EMAIL_IN_USE: string;
  readonly ERR_EMAIL_NOT_FOUND: string;
  readonly ERR_MEMBER_FEATURE: string;
  readonly ERR_EMAIL_NOT_CONFIRMED: string;
  readonly ERR_CONFIRMATION_CODE_NOT_FOUND: string;
  readonly ERR_CONFIRMATION_CODE_EXPIRED: string;
  readonly ERR_ALREADY_CONFIRMED: string;
  readonly ERR_INCORRECT_ACTION_TYPE: string;
  readonly ERR_EMAIL_OR_PASSWORD_INCORRECT: string;
  readonly ERR_CURRENT_AND_NEW_PASSWORD_EQUAL: string;
  readonly ERR_CURRENT_PASSWORD_INCORRECT: string;
};

export type AdminErrors = {
  readonly ERR_NO_ADMIN_RIGHTS: string;
  readonly ERR_NO_ADMIN_READ_RIGHTS: string;
  readonly ERR_NO_ADMIN_WRITE_RIGHTS: string;
};

export type BugErrors = {
  readonly ERR_BUG_BY_ID_NOT_FOUND: string;
  readonly ERR_INVALID_BUG_TYPE: string;
  readonly ERR_BUG_TYPE_REQUIRED: string;
  readonly ERR_BUG_PAGELIMIT_EXCEEDED: string;
  readonly ERR_BUG_MESSAGE_TOO_SHORT: string;
  readonly ERR_BUG_MESSAGE_TOO_LONG: string;
  readonly ERR_BUG_SOLVE_MESSAGE_TOO_SHORT: string;
  readonly ERR_BUG_SOLVE_MESSAGE_TOO_LONG: string;
};

export type CardErrors = {
  readonly ERR_REVIEW_INTERVAL_TOO_LONG: string;
  readonly ERR_REVIEW_INTERVAL_TOO_SHORT: string;
  readonly ERR_NO_DUE_CARDS: string;
  readonly ERR_STORY_TOO_LONG: string;
  readonly ERR_STORY_TOO_SHORT: string;
  readonly ERR_HINT_TOO_LONG: string;
  readonly ERR_HINT_TOO_SHORT: string;
  readonly ERR_PROVIDE_STORY_OR_HINT: string;
  readonly ERR_CARD_NOT_FOUND: string;
  readonly ERR_INVALID_CARD_TYPE: string;
};

export type DeckErrors = {
  readonly ERR_NO_DECKS_FOUND: string;
  readonly ERR_NOT_ACTIVE_DECK: string;
  readonly ERR_DECK_NOT_FOUND: string;
};

export type GeneralErrors = {
  readonly ERR_INVALID_JLPT_LEVEL: string;
  readonly ERR_INVALID_LANGUAGE_ID: string;
  readonly INTERNAL_SERVER_ERROR: string;
  readonly UNAUTHENTICATED: string;
  readonly UNAUTHORIZED: string;
  readonly FORBIDDEN: string;
};

export type ReviewErrors = {
  readonly ERR_LIMIT_REVIEWS_TOO_HIGH: string;
  readonly ERR_LIMIT_REVIEWS_TOO_LOW: string;
  readonly ERR_NEW_REVIEWS_VALUE_TOO_HIGH: string;
  readonly ERR_NEW_REVIEWS_VALUE_TOO_LOW: string;
  readonly ERR_PUSH_REVIEWS_LIMIT_EXCEEDED: string;
  readonly ERR_INVALID_RESULT_TYPE: string;
};

export type SessionErrors = {
  readonly ERR_SESSION_NOT_FOUND: string;
  readonly ERR_SESSION_EXPIRED: string;
  readonly ERR_NOT_OWNER_OF_SESSION: string;
  readonly ERR_JWT_EXPIRED: string;
};

export type ValidationErrors = {
  readonly ERR_INPUT_VALUE_MISSING: string;
  readonly ERR_INVALID_DATE: string;
  readonly ERR_DATE_REQUIRED: string;
  readonly ERR_NOT_VALID_EMAIL: string;
  readonly ERR_PASSWORD_REQUIRED: string;
  readonly ERR_EMAIL_TOO_LONG: string;
  readonly ERR_PASSWORD_MISMATCH: string;
  readonly ERR_INPUT_TYPE: string;
  readonly ERR_EMAIL_REQUIRED: string;
  readonly ERR_RESULT_TYPE_REQUIRED: string;
  readonly ERR_PASSWORD_NUMBER: string;
  readonly ERR_PASSWORD_UPPERCASE: string;
  readonly ERR_PASSWORD_LOWERCASE: string;
  readonly ERR_PASSWORD_TOO_LONG: string;
  readonly ERR_PASSWORD_TOO_SHORT: string;
  readonly ERR_ZERO_OR_NEGATIVE_NUMBER: string;
  readonly ERR_PASSWORD_CONFIRMATION_REQUIRED: string;
  readonly ERR_USERNAME_TOO_LONG: string;
  readonly ERR_USERNAME_TOO_SHORT: string;
  readonly ERR_USERNAME_REQUIRED: string;
  readonly ERR_TOS_NOT_ACCEPTED: string;
  readonly ERR_ACCEPT_TOS_REQUIRED: string;
  readonly ERR_CONFIRMATION_CODE_REQUIRED: string;
};
