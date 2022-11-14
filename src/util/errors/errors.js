const errors = {
  inputValueMissingError: 'inputValueMissingError',
  inputValueTypeError: 'inputValueTypeError',
  passwordMismatchError: 'passwordMismatchError',
  passwordValidationError: 'passwordValidationError',
  requiredPasswordError: 'requiredPasswordError',
  notEmailError: 'notEmailError',
  emailMaxLengthError: 'emailMaxLengthError',
  requiredEmailError: 'requiredEmailError',
  requiredResultTypeError: 'requiredResultTypeError',
  usernameValidationError: 'usernameValidationError',
  emailInUseError: 'emailInUseError',
  usernameInUseError: 'usernameInUseError',
  //internalServerError: 'internalServerError',
  userOrPassIncorrectError: 'userOrPassIncorrectError',
  notAuthError: 'notAuthError',
  changePasswordValueMissingError: 'changePasswordValueMissingError',
  currAndNewPassEqualError: 'currAndNewPassEqualError',
  currentPasswordIncorrect: 'currentPasswordIncorrect',
  invalidJlptLevelError: 'invalidJlptLevelError',
  invalidLanguageIdError: 'invalidLanguageIdError',
  invalidResultTypeError: 'invalidResultTypeError',
  limitReviewsRangeError: 'limitReviewsRangeError',
  noDueCardsError: 'noDueCardsError',
  noNewCardsError: 'noNewCardsError',
  negativeNumberTypeError: 'negativeNumberTypeError',
  nonExistingIdError: 'nonExistingId',
  nonExistingDeckError: 'nonExistingDeck',
  passwordMaxLengthError: 'passwordMaxLengthError',
  passwordMinLengthError: 'passwordMinLengthError',
  requiredPasswordConfirmError: 'requiredPasswordConfirmError',
  passwordNumberError: 'passwordNumberError',
  passwordUppercaseError: 'passwordUppercaseError',
  passwordLowercaseError: 'passwordLowercaseError',
  maxLimitReviewsError: 'maxLimitReviewsError',
  minLimitReviewsError: 'minLimitReviewsError',
  maxReviewIntervalError: 'maxReviewIntervalError',
  minReviewIntervalError: 'minReviewIntervalError',
  maxNewReviewsError: 'maxNewReviewsError',
  minNewReviewsError: 'minNewReviewsError',
  pushReviewsLimitError: 'pushReviewsLimitError',
  storyTooLongError: 'storyTooLongError',
  storyTooShortError: 'storyTooShortError',
  hintTooLongError: 'hintTooLongError',
  hintTooShortError: 'hintTooShortError',
  invalidCardType: 'invalidCardType',
  noCardsFound: 'noCardsFound',
  noRecordsFoundError: 'noRecordsFoundError',
  nonActiveDeckError: 'nonActiveDeckError',
  deckErrors: {
    noDecksFoundError: 'noDecksFoundError'
  },
  graphQlErrors: {
    badUserInput: 'BAD_USER_INPUT',
    unauthenticated: 'UNAUTHENTICATED',
    internalServerError: 'INTERNAL_SERVER_ERROR',
    validationError: 'VALIDATION_ERROR',
    defaultError: 'DEFAULT_ERROR',
  },
  cardErrors: {

  },
  validationError: {

  },
  session: {
    sessionNotFoundError: 'sessionNotFoundError',
    notOwnerOfSession: 'notOwnerOfSession',
  },
  login: {
    
  }
};

module.exports = errors;
