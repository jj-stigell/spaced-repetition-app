const yup = require('yup');
const errors = require('./errors');
const constants = require('./constants');

const fetchCardsSchema = yup.object().shape({
  deckId: yup
    .number(errors.inputValueTypeError)
    .required(errors.inputValueMissingError)
    .min(1, errors.negativeNumberTypeError)
    .max(constants.maxAmountOfDecks, errors.nonExistingDeckError)
    .integer(errors.inputValueTypeError),
  languageId: yup
    .string(errors.inputValueTypeError)
    .oneOf(constants.availableLanguages, errors.invalidLanguageIdError),
  newCards: yup
    .boolean(errors.inputValueTypeError)
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

const createAccountSchema = yup.object().shape({
  email: yup
    .string(errors.inputValueTypeError)
    .email(errors.notEmailError)
    .max(255, errors.emailMaxLengthError)
    .required(errors.requiredEmailError),
  password: yup
    .string(errors.inputValueTypeError)
    .max(constants.passwordMaxLength, errors.passwordMaxLengthError)
    .min(constants.passwordMinLength, errors.passwordMinLengthError)
    .matches(/^(?=.*[a-z])/, errors.passwordLowercaseError)
    .matches(/^(?=.*[A-Z])/, errors.passwordUppercaseError)
    .matches(/^(?=.*[0-9])/, errors.passwordNumberError)
    .required(errors.requiredPasswordError),
  passwordConfirmation: yup
    .string(errors.inputValueTypeError)
    .oneOf([yup.ref('password'), null], errors.passwordMismatchError)
    .required(errors.requiredPasswordConfirmError),
  languageId: yup
    .string(errors.inputValueTypeError)
    .oneOf(constants.availableLanguages, errors.invalidLanguageIdError),
});

const loginSchema = yup.object().shape({
  email: yup
    .string(errors.inputValueTypeError)
    .email(errors.notEmailError)
    .max(255, errors.emailMaxLengthError)
    .required(errors.requiredEmailError),
  password: yup
    .string(errors.inputValueTypeError)
    .max(constants.passwordMaxLength, errors.passwordMaxLengthError)
    .min(constants.passwordMinLength, errors.passwordMinLengthError)
    .required(errors.requiredPasswordError),
});

module.exports = {
  fetchCardsSchema,
  rescheduleCardSchema,
  createAccountSchema,
  loginSchema
};
