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

const validateFetchCards = async (deckId, languageId, newCards) => {
  try {
    await schema.fetchCards.validate({ deckId, languageId, newCards }, { abortEarly: constants.yupAbortEarly  });
  } catch (errors) {
    return validationError(formatYupError(errors));
  }
};

const validateRescheduleCard = async (cardId, reviewResult, newInterval, newEasyFactor, extraReview, timing) => {
  try {
    await schema.rescheduleCard.validate({
      cardId, reviewResult, newInterval, newEasyFactor, extraReview, timing
    }, { abortEarly: constants.yupAbortEarly  });
  } catch (errors) {
    return validationError(formatYupError(errors));
  }
};

const validateDeckSettings = async (deckId, favorite, reviewInterval, reviewsPerDay, newCardsPerDay) => {
  try {
    await schema.deckSettings.validate({
      deckId, favorite, reviewInterval, reviewsPerDay, newCardsPerDay
    }, { abortEarly: constants.yupAbortEarly  });
  } catch (errors) {
    return validationError(formatYupError(errors));
  }
};

const validateInteger = async (integer) => {
  try {
    await schema.integer.validate({ integer }, { abortEarly: constants.yupAbortEarly  });
  } catch (errors) {
    return validationError(formatYupError(errors));
  }
};

const validateUUID = async (UUID) => {
  try {
    await schema.UUID.validate({ UUID }, { abortEarly: constants.yupAbortEarly  });
  } catch (errors) {
    return validationError(formatYupError(errors));
  }
};

const validatePushCards = async (deckId, days) => {
  try {
    await schema.pushCards.validate({ deckId, days }, { abortEarly: constants.yupAbortEarly  });
  } catch (errors) {
    return validationError(formatYupError(errors));
  }
};

const validateDeckId = async (deckId) => {
  try {
    await schema.deckId.validate({ deckId }, { abortEarly: constants.yupAbortEarly  });
  } catch (errors) {
    return validationError(formatYupError(errors));
  }
};

const validateEditAccountCard = async (cardId, story, hint) => {
  try {
    await schema.editAccountCard.validate({ cardId, story, hint }, { abortEarly: constants.yupAbortEarly  });
  } catch (errors) {
    return validationError(formatYupError(errors));
  }
};

const validateFetchKanji = async (kanjiId, includeAccountCard) => {
  try {
    await schema.fetchKanji.validate({ kanjiId, includeAccountCard }, { abortEarly: constants.yupAbortEarly  });
  } catch (errors) {
    return validationError(formatYupError(errors));
  }
};

const validateFetchCardsByType = async (cardType, languageId) => {
  try {
    await schema.fetchCardsByType.validate({ cardType, languageId }, { abortEarly: constants.yupAbortEarly  });
  } catch (errors) {
    return validationError(formatYupError(errors));
  }
};

const validateCardType = async (cardType) => {
  try {
    await schema.cardType.validate({ cardType }, { abortEarly: constants.yupAbortEarly  });
  } catch (errors) {
    return validationError(formatYupError(errors));
  }
};

const validateBugType = async (bugType) => {
  try {
    await schema.bugType.validate({ bugType }, { abortEarly: constants.yupAbortEarly  });
  } catch (errors) {
    return validationError(formatYupError(errors));
  }
};

module.exports = {
  validateEmail,
  validateNewAccount,
  validateLogin,
  validateChangePassword,
  validateFetchCards,
  validateRescheduleCard,
  validateDeckSettings,
  validateInteger,
  validateUUID,
  validatePushCards,
  validateDeckId,
  validateEditAccountCard,
  validateFetchKanji,
  validateFetchCardsByType,
  validateCardType,
  validateBugType
};
