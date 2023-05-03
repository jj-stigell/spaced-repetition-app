import { FindOptions } from 'sequelize';

declare module 'morgan';

export type AccountErrors = {
  readonly ERR_ACCOUNT_NOT_FOUND: string;
  readonly ERR_USERNAME_IN_USE: string;
  readonly ERR_EMAIL_IN_USE: string;
  readonly ERR_EMAIL_NOT_FOUND: string;
  readonly ERR_MEMBER_FEATURE: string;
  readonly ERR_EMAIL_NOT_CONFIRMED: string;
  readonly ERR_CONFIRMATION_CODE_NOT_FOUND: string;
  readonly ERR_CONFIRMATION_CODE_EXPIRED: string;
  readonly ERR_EMAIL_ALREADY_CONFIRMED: string;
  readonly ERR_INCORRECT_ACTION_TYPE: string;
  readonly ERR_EMAIL_OR_PASSWORD_INCORRECT: string;
  readonly ERR_PASSWORD_CURRENT_AND_NEW_EQUAL: string;
  readonly ERR_PASSWORD_CURRENT_INCORRECT: string;
};

export type AdminErrors = {
  readonly ERR_NO_ADMIN_RIGHTS: string;
  readonly ERR_NO_ADMIN_READ_RIGHTS: string;
  readonly ERR_NO_ADMIN_WRITE_RIGHTS: string;
};

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

export type ApiErrorContent = {
  readonly code: string
}

export type BugConstants = {
  readonly BUG_REPORTS_PER_PAGE_MAX: number;
  readonly BUG_MESSAGE_MIN_LENGTH: number;
  readonly BUG_MESSAGE_MAX_LENGTH: number;
  readonly SOLVED_MESSAGE_MIN_LENGTH: number;
  readonly SOLVED_MESSAGE_MAX_LENGTH: number;
  readonly BUG_TYPES: Array<string>;
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

export type BugReportData = {
  readonly bugMessage: string;
  readonly type: string;
  readonly cardId?: number;
};

export interface BugReportOptions extends FindOptions {
  where?: {
    type?: string;
  };
}

export type BugReportQueryParams = {
  readonly type?: string;
  readonly page?: number;
  readonly limit?: number;
}

export enum BugType {
  TRANSLATION = 'TRANSLATION',
  UI = 'UI',
  FUNCTIONALITY = 'FUNCTIONALITY',
  OTHER = 'OTHER'
}

export type CardConstants = {
  readonly CARD_TYPES: Array<string>;
  readonly STORY_MIN_LENGTH: number;
  readonly STORY_MAX_LENGTH: number;
  readonly HINT_MIN_LENGTH: number;
  readonly HINT_MAX_LENGTH: number;
  readonly DEFAULT_EASY_FACTOR: number;
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

export enum CardType {
  KANJI = 'KANJI',
  KANA = 'KANA',
  VOCABULARY = 'VOCABULARY',
  SENTENCE = 'SENTENCE'
}

export type ChangePasswordData = {
  readonly currentPassword: string;
  readonly newPassword: string;
}

export type ConfirmEmailPayload = {
  readonly translation: object;
  readonly email: string;
  readonly username: string;
  readonly url: string;
};

export enum DeckCategory {
  KANJI = 'KANJI',
  KANA = 'KANA',
  VOCABULARY = 'VOCABULARY',
  GRAMMAR = 'GRAMMAR'
}

export type DeckErrors = {
  readonly ERR_NO_DECKS_FOUND: string;
  readonly ERR_NOT_ACTIVE_DECK: string;
  readonly ERR_DECK_NOT_FOUND: string;
};

export type DeckWithCustomData = {
  id: number;
  memberOnly: boolean;
  name: string;
  description: string;
  cards: number;
  favorite: boolean;
} & Progress

export type EmailClientArgs<TemplateData> = {
  readonly to: string;
  readonly subject: string;
  readonly templatePath: string;
  readonly templateData: TemplateData;
};

export type Category = {
  readonly category: DeckCategory;
  readonly decks: number;
} & Progress

export type GeneralErrors = {
  readonly ERR_INVALID_LANGUAGE_ID: string;
  readonly INTERNAL_SERVER_ERROR: string;
  readonly UNAUTHENTICATED: string;
  readonly UNAUTHORIZED: string;
  readonly FORBIDDEN: string;
};

export enum HttpCode {
  Ok = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  UnprocessableEntity = 422,
  InternalServerError = 500,
  BadGateway = 502
}

export enum JlptLevel {
  N1 = 1,
  N2,
  N3,
  N4,
  N5
}

export type JwtPayload = {
  readonly id: number;
  readonly sessionId: string;
};

export type LoginResult = {
  readonly id: number;
  readonly role: Role;
  readonly username: string;
  readonly email: string;
  readonly allowNewsLetter: boolean;
  readonly language: string;
  readonly jlptLevel: number;
  readonly sessionId: string;
};

export type Progress = {
  progress: {
    new: number;
    learning: number;
    mature: number;
  }
}

export type RegisterData = {
  readonly email: string;
  readonly username: string;
  readonly password: string;
  readonly acceptTos: boolean;
  readonly allowNewsLetter: boolean | undefined | null;
  readonly language: string;
}

export type RegexConstants = {
  readonly LOWERCASE_REGEX: RegExp;
  readonly UPPERCASE_REGEX: RegExp;
  readonly NUMBER_REGEX: RegExp;
  readonly DATE_REGEX: RegExp;
};

export type ResetPasswordData = {
  readonly confirmationId: string;
  readonly password: string;
}

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

export type ReviewErrors = {
  readonly ERR_LIMIT_REVIEWS_TOO_HIGH: string;
  readonly ERR_LIMIT_REVIEWS_TOO_LOW: string;
  readonly ERR_NEW_REVIEWS_VALUE_TOO_HIGH: string;
  readonly ERR_NEW_REVIEWS_VALUE_TOO_LOW: string;
  readonly ERR_PUSH_REVIEWS_LIMIT_EXCEEDED: string;
  readonly ERR_INVALID_RESULT_TYPE: string;
};

export enum Role {
  NON_MEMBER = 'NON_MEMBER',
  MEMBER = 'MEMBER',
  READ_RIGHT = 'READ_RIGHT',
  WRITE_RIGHT = 'WRITE_RIGHT',
  SUPERUSER = 'SUPERUSER'
}

export type SessionErrors = {
  readonly ERR_SESSION_NOT_FOUND: string;
  readonly ERR_SESSION_EXPIRED: string;
  readonly ERR_NOT_OWNER_OF_SESSION: string;
  readonly ERR_JWT_EXPIRED: string;
};

export type SolvedBugReportData = {
  readonly solved: boolean;
  readonly solvedMessage: string;
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
  readonly ERR_INVALID_JLPT_LEVEL: string;
  readonly ERR_JLPT_LEVEL_REQUIRED: string;
  readonly ERR_INVALID_CATEGORY: string;
  readonly ERR_CATEGORY_REQUIRED: string;
};
