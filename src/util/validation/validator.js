const { validationError } = require('../errors/graphQlErrors');
const formatYupError = require('../errors/errorFormatter');
const constants = require('../constants');
const schema = require('./schema');

const validateEmail = async (email) => {
  try {
    await schema.email.validate({ email }, { abortEarly: constants.yupAbortEarly });
  } catch (errors) {
    return validationError(formatYupError(errors));
  }
};

const validateNewAccount = async (email, password, passwordConfirmation, languageId) => {
  try {
    await schema.createAccount.validate({ email, password, passwordConfirmation, languageId }, { abortEarly: constants.yupAbortEarly });
  } catch (errors) {
    return validationError(formatYupError(errors));
  }
};

const validateLogin = async (email, password) => {
  try {
    await schema.login.validate({ email, password }, { abortEarly: constants.yupAbortEarly });
  } catch (errors) {
    return validationError(formatYupError(errors));
  }
};

const validateChangePassword = async (currentPassword, newPassword, newPasswordConfirmation) => {
  try {
    await schema.changePassword.validate({
      currentPassword, password: newPassword, passwordConfirmation: newPasswordConfirmation
    }, { abortEarly: constants.yupAbortEarly });
  } catch (errors) {
    return validationError(formatYupError(errors));
  }
};

const validateInteger = async (integer) => {
  try {
    await schema.integer.validate({ integer }, { abortEarly: false });
  } catch (errors) {
    return validationError(formatYupError(errors));
  }
};

const validatePushCards = async (deckId, days) => {
  try {
    await schema.pushCards.validate({ deckId, days }, { abortEarly: false });
  } catch (errors) {
    return validationError(formatYupError(errors));
  }
};

module.exports = {
  validateEmail,
  validateNewAccount,
  validateLogin,
  validateChangePassword,
  validateInteger,
  validatePushCards
};
