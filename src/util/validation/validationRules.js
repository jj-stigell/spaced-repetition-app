const yup = require('yup');
const errors = require('../errors/errors');
const constants = require('../constants');

const deckId = yup
  .number(errors.inputValueTypeError)
  .required(errors.inputValueMissingError)
  .min(1, errors.negativeNumberTypeError)
  .max(constants.maxAmountOfDecks, errors.nonExistingDeckError)
  .max(constants.maxAmountOfDecks, errors.nonExistingDeckError)
  .integer(errors.inputValueTypeError);

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

module.exports = {
  deckId,
  email,
  languageId,
  password,
  currentPassword,
  newPassword,
  passwordConfirmation,
  isBoolean
};
