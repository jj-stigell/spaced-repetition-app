const yup = require('yup');
const validationRules = require('./validationRules');

const fetchCards = yup.object().shape({
  deckId: validationRules.deckIdRequired,
  languageId: validationRules.languageId,
  newCards: validationRules.isBoolean
});

const rescheduleCard = yup.object().shape({
  cardId: validationRules.cardIdRequired,
  reviewResult: validationRules.resultType,
  newInterval: validationRules.reviewIntervalRequired,
  newEasyFactor: validationRules.easyFactor,
  extraReview: validationRules.isBoolean,
  timing: validationRules.timing
});

const deckId = yup.object().shape({
  deckId: validationRules.deckIdRequired
});

const id = yup.object().shape({
  id: validationRules.integer
});

const integer = yup.object().shape({
  id: validationRules.integer
});

const UUID = yup.object().shape({
  UUID: validationRules.UUID
});

const cardType = yup.object().shape({
  cardType: validationRules.cardType
});

const bugType = yup.object().shape({
  bugType: validationRules.bugType
});

const newBug = yup.object().shape({
  bugType: validationRules.bugType,
  bugMessage: validationRules.bugMessage,
  cardId: validationRules.integer
});

const solveBug = yup.object().shape({
  bugId: validationRules.integer,
  solvedMessage: validationRules.bugSolveMessage,
  solved: validationRules.isBoolean
});

const fetchKanji = yup.object().shape({
  kanjiId: validationRules.integer,
  includeAccountCard: validationRules.isBoolean
});

const deckSettings = yup.object().shape({
  deckId: validationRules.deckIdRequired,
  favorite: validationRules.isBoolean,
  reviewInterval: validationRules.reviewInterval,
  reviewsPerDay: validationRules.reviewsPerDay,
  newCardsPerDay: validationRules.newCardsPerDay
});

const pushCards = yup.object().shape({
  deckId: validationRules.deckId,
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

const fetchCardsByType = yup.object().shape({
  cardType: validationRules.cardType,
  languageId: validationRules.languageId
});

module.exports = {
  fetchCards,
  rescheduleCard,
  deckId,
  id,
  integer,
  UUID,
  cardType,
  bugType,
  newBug,
  solveBug,
  fetchKanji,
  deckSettings,
  pushCards,
  email,
  editAccountCard,
  createAccount,
  login,
  changePassword,
  fetchCardsByType
};
