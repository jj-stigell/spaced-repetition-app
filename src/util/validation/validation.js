const yup = require('yup');
const errors = require('../errors/errors');
const validationRules = require('./validationRules');

const fetchCardsSchema = yup.object().shape({
  deckId: validationRules.deckId,
  languageId: validationRules.languageId,
  newCards: validationRules.isBoolean
});

const rescheduleCardSchema = yup.object().shape({
  cardId: yup
    .number(errors.inputValueTypeError)
    .required(errors.inputValueMissingError)
    .min(1, errors.negativeNumberTypeError)
    .max(100, errors.nonExistingDeckError)
    .integer(errors.inputValueTypeError),
  reviewResult: yup
    .string()
    .min(3, '')
    .max(255),
  newInterval: yup
    .string()
    .min(3, '')
    .max(255),
  newEasyFactor: yup
    .string()
    .min(3, '')
    .max(255),
  extraReview: yup
    .string()
    .min(3, '')
    .max(255),
  timing: yup
    .string()
    .min(3, '')
    .max(255)
});

const validateDeckId = yup.object().shape({
  deckId: validationRules.deckId
});

const validateId = yup.object().shape({
  id: validationRules.id
});

const validateType = yup.object().shape({
  cardType: validationRules.type
});

const validateDeckSettings = yup.object().shape({
  deckId: validationRules.deckId,
  favorite: validationRules.isBoolean,
  reviewInterval: validationRules.reviewInterval,
  reviewsPerDay: validationRules.reviewsPerDay,
  newCardsPerDay: validationRules.newCardsPerDay
});

const validatePushCards = yup.object().shape({
  deckId: validationRules.deckIdNotRequired,
  days: validationRules.days
});

const emailAvailableSchema = yup.object().shape({
  email: validationRules.email
});

const validateEditAccountCard = yup.object().shape({
  cardId: validationRules.cardId,
  story: validationRules.story,
  hint: validationRules.hint
});

const createAccountSchema = yup.object().shape({
  email: validationRules.email,
  password: validationRules.password,
  passwordConfirmation: validationRules.passwordConfirmation,
  languageId: validationRules.languageId
});

const loginSchema = yup.object().shape({
  email: validationRules.email,
  password: validationRules.password
});

const changePasswordSchema = yup.object().shape({
  currentPassword: validationRules.currentPassword,
  password: validationRules.newPassword,
  passwordConfirmation: validationRules.passwordConfirmation
});

module.exports = {
  fetchCardsSchema,
  rescheduleCardSchema,
  validateDeckId,
  validateId,
  validateType,
  validateDeckSettings,
  validatePushCards,
  emailAvailableSchema,
  validateEditAccountCard,
  createAccountSchema,
  loginSchema,
  changePasswordSchema
};
