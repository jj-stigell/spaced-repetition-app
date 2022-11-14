const yup = require('yup');
const errors = require('../errors/errors');
const constants = require('../constants');

const deckId = yup
  .number(errors.inputValueTypeError)
  .min(1, errors.negativeNumberTypeError)
  .max(constants.maxAmountOfDecks, errors.nonExistingDeckError)
  .integer(errors.inputValueTypeError);

const deckIdRequired = deckId
  .required(errors.inputValueMissingError);

const cardId = yup
  .number(errors.inputValueTypeError)
  .min(1, errors.negativeNumberTypeError)
  .integer(errors.inputValueTypeError);

const cardIdRequired = cardId
  .required(errors.inputValueMissingError);

const resultType = yup
  .string(errors.inputValueTypeError)
  .oneOf(constants.resultTypes, errors.invalidResultTypeError)
  .required(errors.requiredResultTypeError);

const easyFactor = yup
  .number(errors.inputValueTypeError)
  .min(0.01, errors.negativeNumberTypeError)
  .required(errors.requiredResultTypeError);

const timing = yup
  .number(errors.inputValueTypeError)
  .min(0.01, errors.negativeNumberTypeError);

const email = yup
  .string(errors.inputValueTypeError)
  .email(errors.notEmailError)
  .max(255, errors.emailMaxLengthError)
  .required(errors.requiredEmailError);

const languageId = yup
  .string(errors.inputValueTypeError)
  .oneOf(constants.availableLanguages, errors.invalidLanguageIdError);

const password = yup
  .string(errors.inputValueTypeError)
  .max(constants.passwordMaxLength, errors.passwordMaxLengthError)
  .min(constants.passwordMinLength, errors.passwordMinLengthError)
  .matches(constants.lowercaseRegex, errors.passwordLowercaseError)
  .matches(constants.uppercaseRegex, errors.passwordUppercaseError)
  .matches(constants.numberRegex, errors.passwordNumberError)
  .required(errors.requiredPasswordError);

const currentPassword = yup
  .string(errors.inputValueTypeError)
  .max(constants.passwordMaxLength, errors.passwordMaxLengthError)
  .min(constants.passwordMinLength, errors.passwordMinLengthError)
  .required(errors.requiredPasswordError);

const newPassword = yup
  .string(errors.inputValueTypeError)
  .notOneOf([yup.ref('currentPassword'), null], errors.currAndNewPassEqualError)
  .max(constants.passwordMaxLength, errors.passwordMaxLengthError)
  .min(constants.passwordMinLength, errors.passwordMinLengthError)
  .matches(constants.lowercaseRegex, errors.passwordLowercaseError)
  .matches(constants.uppercaseRegex, errors.passwordUppercaseError)
  .matches(constants.numberRegex, errors.passwordNumberError)
  .required(errors.requiredPasswordError);

const passwordConfirmation = yup
  .string(errors.inputValueTypeError)
  .oneOf([yup.ref('password'), null], errors.passwordMismatchError)
  .required(errors.requiredPasswordConfirmError);

const isBoolean = yup
  .boolean(errors.inputValueTypeError);

const cardType = yup
  .string(errors.inputValueTypeError)
  .oneOf(constants.cardTypes, errors.invalidCardType)
  .required(errors.inputValueMissingError);

const integer = yup
  .number(errors.inputValueTypeError)
  .min(1, errors.negativeNumberTypeError)
  .integer(errors.inputValueTypeError);

const UUID = yup
  .string(errors.inputValueTypeError)
  .uuid(errors.inputValueTypeError)
  .required(errors.inputValueMissingError);

const reviewInterval = yup
  .number(errors.inputValueTypeError)
  .min(constants.minReviewInterval, errors.minReviewIntervalError)
  .max(constants.maxReviewInterval, errors.maxReviewIntervalError)
  .integer(errors.inputValueTypeError);

const reviewIntervalRequired = reviewInterval
  .required(errors.inputValueMissingError);

const reviewsPerDay = yup
  .number(errors.inputValueTypeError)
  .min(constants.minLimitReviews, errors.minLimitReviewsError)
  .max(constants.maxLimitReviews, errors.maxLimitReviewsError)
  .integer(errors.inputValueTypeError);

const newCardsPerDay = yup
  .number(errors.inputValueTypeError)
  .min(constants.minNewReviews, errors.minNewReviewsError)
  .max(constants.maxNewReviews, errors.maxNewReviewsError)
  .integer(errors.inputValueTypeError);

const days = yup
  .number(errors.inputValueTypeError)
  .required(errors.inputValueMissingError)
  .min(1, errors.negativeNumberTypeError)
  .max(constants.maxPushReviewsDays, errors.pushReviewsLimitError)
  .integer(errors.inputValueTypeError);

const story = yup
  .string(errors.inputValueTypeError)
  .min(constants.card.storyMinLength, errors.storyTooShortError)
  .max(constants.card.storyMaxLength, errors.storyTooLongError);

const hint = yup
  .string(errors.inputValueTypeError)
  .min(constants.card.hintMinLength, errors.hintTooShortError)
  .max(constants.card.hintMaxLength, errors.hintTooLongError);

module.exports = {
  deckId,
  deckIdRequired,
  cardId,
  cardIdRequired,
  resultType,
  easyFactor,
  timing,
  email,
  languageId,
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
  hint
};
