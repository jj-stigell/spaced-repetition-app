const yup = require('yup');
const errors = require('../errors/errors');
const validationRules = require('./validationRules');

const fetchCards = yup.object().shape({
  deckId: validationRules.deckId,
  languageId: validationRules.languageId,
  newCards: validationRules.isBoolean
});

const rescheduleCard = yup.object().shape({
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

const deckId = yup.object().shape({
  deckId: validationRules.deckId
});

const id = yup.object().shape({
  id: validationRules.id
});

const integer = yup.object().shape({
  id: validationRules.integer
});

const cardType = yup.object().shape({
  cardType: validationRules.cardType
});

const fetchKanji = yup.object().shape({
  kanjiId: validationRules.id,
  includeAccountCard: validationRules.isBoolean
});

const deckSettings = yup.object().shape({
  deckId: validationRules.deckId,
  favorite: validationRules.isBoolean,
  reviewInterval: validationRules.reviewInterval,
  reviewsPerDay: validationRules.reviewsPerDay,
  newCardsPerDay: validationRules.newCardsPerDay
});

const pushCards = yup.object().shape({
  deckId: validationRules.deckIdNotRequired,
  days: validationRules.days
});

const email = yup.object().shape({
  email: validationRules.email
});

const editAccountCard = yup.object().shape({
  cardId: validationRules.cardId,
  story: validationRules.story,
  hint: validationRules.hint
});

const createAccount = yup.object().shape({
  email: validationRules.email,
  password: validationRules.password,
  passwordConfirmation: validationRules.passwordConfirmation,
  languageId: validationRules.languageId
});

const login = yup.object().shape({
  email: validationRules.email,
  password: validationRules.password
});

const changePassword = yup.object().shape({
  currentPassword: validationRules.currentPassword,
  password: validationRules.newPassword,
  passwordConfirmation: validationRules.passwordConfirmation
});

module.exports = {
  fetchCards,
  rescheduleCard,
  deckId,
  id,
  integer,
  cardType,
  fetchKanji,
  deckSettings,
  pushCards,
  email,
  editAccountCard,
  createAccount,
  login,
  changePassword
};
