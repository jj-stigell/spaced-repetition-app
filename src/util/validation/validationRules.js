const yup = require('yup');
const { calculateDateToString } = require('../helper');
const errors = require('../errors/errors');
const constants = require('../constants');

const deckId = yup
  .number(errors.validationErrors.inputValueTypeError)
  .min(1, errors.validationErrors.negativeNumberTypeError)
  .max(constants.deck.maxAmountOfDecks, errors.deckErrors.nonExistingDeckIdError)
  .integer(errors.validationErrors.inputValueTypeError);

const deckIdRequired = deckId
  .required(errors.validationErrors.inputValueMissingError);

const cardId = yup
  .number(errors.validationErrors.inputValueTypeError)
  .min(1, errors.validationErrors.negativeNumberTypeError)
  .integer(errors.validationErrors.inputValueTypeError);

const cardIdRequired = cardId
  .required(errors.validationErrors.inputValueMissingError);

const resultType = yup
  .string(errors.validationErrors.inputValueTypeError)
  .oneOf(constants.review.resultTypes, errors.reviewErrors.invalidResultTypeError)
  .required(errors.validationErrors.requiredResultTypeError);

const easyFactor = yup
  .number(errors.validationErrors.inputValueTypeError)
  .min(0.01, errors.validationErrors.negativeNumberTypeError)
  .required(errors.validationErrors.requiredResultTypeError);

const timing = yup
  .number(errors.validationErrors.inputValueTypeError)
  .min(0.01, errors.validationErrors.negativeNumberTypeError);

const email = yup
  .string(errors.validationErrors.inputValueTypeError)
  .email(errors.validationErrors.notValidEmailError)
  .max(constants.account.emailMaxLength, errors.validationErrors.emailMaxLengthError)
  .required(errors.validationErrors.requiredEmailError);

const username = yup
  .string(errors.validationErrors.inputValueTypeError)
  .max(constants.account.usernameMaxLength, errors.validationErrors.usernameMaxLengthError)
  .min(constants.account.usernameMinLength, errors.validationErrors.usernameMinLengthError)
  .required(errors.validationErrors.requiredUsernameError);

const languageId = yup
  .string(errors.validationErrors.inputValueTypeError)
  .oneOf(constants.general.availableLanguages, errors.generalErrors.invalidLanguageIdError);

const date = yup
  .date(errors.validationErrors.invalidDateError)
  .min(calculateDateToString(-1), errors.validationErrors.invalidDateError)
  .max(calculateDateToString(constants.review.maxReviewInterval), errors.validationErrors.invalidDateError);

const dateRequired = date
  .required(errors.validationErrors.requiredDateError);

const password = yup
  .string(errors.validationErrors.inputValueTypeError)
  .max(constants.account.passwordMaxLength, errors.validationErrors.passwordMaxLengthError)
  .min(constants.account.passwordMinLength, errors.validationErrors.passwordMinLengthError)
  .matches(constants.regex.lowercaseRegex, errors.validationErrors.passwordLowercaseError)
  .matches(constants.regex.uppercaseRegex, errors.validationErrors.passwordUppercaseError)
  .matches(constants.regex.numberRegex, errors.validationErrors.passwordNumberError)
  .required(errors.validationErrors.requiredPasswordError);

const currentPassword = yup
  .string(errors.validationErrors.inputValueTypeError)
  .max(constants.account.passwordMaxLength, errors.validationErrors.passwordMaxLengthError)
  .min(constants.account.passwordMinLength, errors.validationErrors.passwordMinLengthError)
  .required(errors.validationErrors.requiredPasswordError);

const newPassword = yup
  .string(errors.validationErrors.inputValueTypeError)
  .notOneOf([yup.ref('currentPassword'), null], errors.validationErrors.currAndNewPassEqualError)
  .max(constants.account.passwordMaxLength, errors.validationErrors.passwordMaxLengthError)
  .min(constants.account.passwordMinLength, errors.validationErrors.passwordMinLengthError)
  .matches(constants.regex.lowercaseRegex, errors.validationErrors.passwordLowercaseError)
  .matches(constants.regex.uppercaseRegex, errors.validationErrors.passwordUppercaseError)
  .matches(constants.regex.numberRegex, errors.validationErrors.passwordNumberError)
  .required(errors.validationErrors.requiredPasswordError);

const passwordConfirmation = yup
  .string(errors.validationErrors.inputValueTypeError)
  .oneOf([yup.ref('password'), null], errors.validationErrors.passwordMismatchError)
  .required(errors.validationErrors.requiredPasswordConfirmError);

const isBoolean = yup
  .boolean(errors.validationErrors.inputValueTypeError);

const cardType = yup
  .string(errors.validationErrors.inputValueTypeError)
  .oneOf(constants.card.cardTypes, errors.cardErrors.invalidCardTypeError)
  .required(errors.validationErrors.inputValueMissingError);

const integer = yup
  .number(errors.validationErrors.inputValueTypeError)
  .min(1, errors.validationErrors.negativeNumberTypeError)
  .integer(errors.validationErrors.inputValueTypeError);

const UUID = yup
  .string(errors.validationErrors.inputValueTypeError)
  .uuid(errors.validationErrors.inputValueTypeError)
  .required(errors.validationErrors.inputValueMissingError);

const reviewInterval = yup
  .number(errors.validationErrors.inputValueTypeError)
  .min(constants.review.minReviewInterval, errors.cardErrors.minReviewIntervalError)
  .max(constants.review.maxReviewInterval, errors.cardErrors.maxReviewIntervalError)
  .integer(errors.validationErrors.inputValueTypeError);

const reviewIntervalRequired = reviewInterval
  .required(errors.validationErrors.inputValueMissingError);

const reviewsPerDay = yup
  .number(errors.validationErrors.inputValueTypeError)
  .min(constants.review.minLimitReviews, errors.reviewErrors.minLimitReviewsError)
  .max(constants.review.maxLimitReviews, errors.reviewErrors.maxLimitReviewsError)
  .integer(errors.validationErrors.inputValueTypeError);

const newCardsPerDay = yup
  .number(errors.validationErrors.inputValueTypeError)
  .min(constants.review.minNewReviews, errors.reviewErrors.minNewReviewsError)
  .max(constants.review.maxNewReviews, errors.reviewErrors.maxNewReviewsError)
  .integer(errors.validationErrors.inputValueTypeError);

const days = yup
  .number(errors.validationErrors.inputValueTypeError)
  .required(errors.validationErrors.inputValueMissingError)
  .min(1, errors.validationErrors.negativeNumberTypeError)
  .max(constants.review.maxPushReviewsDays, errors.reviewErrors.pushReviewsLimitError)
  .integer(errors.validationErrors.inputValueTypeError);

const story = yup
  .string(errors.validationErrors.inputValueTypeError)
  .min(constants.card.storyMinLength, errors.cardErrors.storyTooShortError)
  .max(constants.card.storyMaxLength, errors.cardErrors.storyTooLongError);

const hint = yup
  .string(errors.validationErrors.inputValueTypeError)
  .min(constants.card.hintMinLength, errors.cardErrors.hintTooShortError)
  .max(constants.card.hintMaxLength, errors.cardErrors.hintTooLongError);

const bugMessage = yup
  .string(errors.validationErrors.inputValueTypeError)
  .min(constants.bugs.bugMessageMinLength, errors.bugErrors.bugMessageTooShortError)
  .max(constants.bugs.bugMessageMaxLength, errors.bugErrors.bugMessageTooLongError);

const bugSolveMessage = yup
  .string(errors.validationErrors.inputValueTypeError)
  .min(constants.bugs.solvedMessageMinLength, errors.bugErrors.bugSolveMessageTooShortError)
  .max(constants.bugs.solvedMessageMaxLength, errors.bugErrors.bugSolveMessageTooLongError);

module.exports = {
  deckId,
  deckIdRequired,
  cardId,
  cardIdRequired,
  resultType,
  easyFactor,
  timing,
  email,
  username,
  languageId,
  date,
  dateRequired,
  password,
  currentPassword,
  newPassword,
  passwordConfirmation,
  isBoolean,
  cardType,
  integer,
  UUID,
  reviewInterval,
  reviewIntervalRequired,
  reviewsPerDay,
  newCardsPerDay,
  days,
  story,
  hint,
  bugMessage,
  bugSolveMessage
};
