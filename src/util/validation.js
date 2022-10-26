const yup = require('yup');
const errors = require('./errors');

const fetchCardsSchema = yup.object().shape({
  deckId: yup
    .number(errors.inputValueTypeError)
    .required(errors.inputValueMissingError)
    .min(1, errors.negativeNumberTypeError)
    .max(100, errors.nonExistingDeckError)
    .integer(errors.inputValueTypeError),
  languageId: yup
    .string()
    .min(2, errors.invalidLanguageIdError)
    .max(2, errors.invalidLanguageIdError),
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



module.exports = {
  fetchCardsSchema,
  rescheduleCardSchema
};
