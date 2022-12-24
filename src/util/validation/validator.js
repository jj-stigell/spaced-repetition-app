const { validationError } = require('../errors/graphQlErrors');
const formatYupError = require('../errors/errorFormatter');
const constants = require('../constants');
const schema = require('./schema');

const validateEmail = async (email) => {
  try {
    await schema.email.validate({ email }, { abortEarly: constants.general.yupAbortEarly });
  } catch (errors) {
    return validationError(formatYupError(errors));
  }
};

const validateUsername = async (username) => {
  try {
    await schema.username.validate({ username }, { abortEarly: constants.general.yupAbortEarly });
  } catch (errors) {
    return validationError(formatYupError(errors));
  }
};

const validateNewAccount = async (email, username, password, passwordConfirmation, languageId) => {
  try {
    await schema.createAccount.validate({ email, username, password, passwordConfirmation, languageId }, { abortEarly: constants.general.yupAbortEarly });
  } catch (errors) {
    return validationError(formatYupError(errors));
  }
};

const validateLogin = async (email, password) => {
  try {
    await schema.login.validate({ email, password }, { abortEarly: constants.general.yupAbortEarly });
  } catch (errors) {
    return validationError(formatYupError(errors));
  }
};

const validateChangePassword = async (currentPassword, newPassword, newPasswordConfirmation) => {
  try {
    await schema.changePassword.validate({
      currentPassword, password: newPassword, passwordConfirmation: newPasswordConfirmation
    }, { abortEarly: constants.general.yupAbortEarly });
  } catch (errors) {
    return validationError(formatYupError(errors));
  }
};

const validateRescheduleCard = async (cardId, newInterval, newEasyFactor, extraReview, timing, newDueDate, reviewType) => {
  try {
    await schema.rescheduleCard.validate({
      cardId, newInterval, newEasyFactor, extraReview, timing, newDueDate, reviewType
    }, { abortEarly: constants.general.yupAbortEarly  });
  } catch (errors) {
    return validationError(formatYupError(errors));
  }
};

const validateDeckSettings = async (deckId, favorite, reviewInterval, reviewsPerDay, newCardsPerDay) => {
  try {
    await schema.deckSettings.validate({
      deckId, favorite, reviewInterval, reviewsPerDay, newCardsPerDay
    }, { abortEarly: constants.general.yupAbortEarly  });
  } catch (errors) {
    return validationError(formatYupError(errors));
  }
};

const validateInteger = async (id) => {
  try {
    await schema.integer.validate({ id }, { abortEarly: constants.general.yupAbortEarly  });
  } catch (errors) {
    return validationError(formatYupError(errors));
  }
};

const validateDate = async (date) => {
  try {
    await schema.date.validate({ date }, { abortEarly: constants.general.yupAbortEarly  });
  } catch (errors) {
    return validationError(formatYupError(errors));
  }
};

const validateUUID = async (UUID) => {
  try {
    await schema.UUID.validate({ UUID }, { abortEarly: constants.general.yupAbortEarly  });
  } catch (errors) {
    return validationError(formatYupError(errors));
  }
};

const validatePushCards = async (deckId, days, date) => {
  try {
    await schema.pushCards.validate({ deckId, days, date }, { abortEarly: constants.general.yupAbortEarly  });
  } catch (errors) {
    return validationError(formatYupError(errors));
  }
};

const validateEditAccountCard = async (cardId, story, hint) => {
  try {
    await schema.editAccountCard.validate({ cardId, story, hint }, { abortEarly: constants.general.yupAbortEarly  });
  } catch (errors) {
    return validationError(formatYupError(errors));
  }
};

const validateFetchKanji = async (kanjiId, includeAccountCard, languageId) => {
  try {
    await schema.fetchKanji.validate({ kanjiId, includeAccountCard, languageId }, { abortEarly: constants.general.yupAbortEarly  });
  } catch (errors) {
    return validationError(formatYupError(errors));
  }
};

const validateCardType = async (cardType) => {
  try {
    await schema.cardType.validate({ cardType }, { abortEarly: constants.general.yupAbortEarly  });
  } catch (errors) {
    return validationError(formatYupError(errors));
  }
};

const validateBugType = async (bugType) => {
  try {
    await schema.bugType.validate({ bugType }, { abortEarly: constants.general.yupAbortEarly  });
  } catch (errors) {
    return validationError(formatYupError(errors));
  }
};

const validateNewBug = async (bugMessage, cardId) => {
  try {
    await schema.newBug.validate({ bugMessage, cardId }, { abortEarly: constants.general.yupAbortEarly  });
  } catch (errors) {
    return validationError(formatYupError(errors));
  }
};

const validateBugSolve = async (bugId, solvedMessage, solved) => {
  try {
    await schema.solveBug.validate({ bugId, solvedMessage, solved }, { abortEarly: constants.general.yupAbortEarly  });
  } catch (errors) {
    return validationError(formatYupError(errors));
  }
};

module.exports = {
  validateEmail,
  validateUsername,
  validateNewAccount,
  validateLogin,
  validateChangePassword,
  validateRescheduleCard,
  validateDeckSettings,
  validateInteger,
  validateDate,
  validateUUID,
  validatePushCards,
  validateEditAccountCard,
  validateFetchKanji,
  validateCardType,
  validateBugType,
  validateNewBug,
  validateBugSolve
};
