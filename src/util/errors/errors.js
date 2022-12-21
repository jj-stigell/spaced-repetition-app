const errors = {
  inputValueMissingError: 'inputValueMissingError',
  inputValueTypeError: 'inputValueTypeError',
  passwordMismatchError: 'passwordMismatchError',
  passwordValidationError: 'passwordValidationError',
  requiredPasswordError: 'requiredPasswordError',
  emailMaxLengthError: 'emailMaxLengthError',
  requiredEmailError: 'requiredEmailError',
  requiredResultTypeError: 'requiredResultTypeError', 
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
  provideStoryOrHintError: 'provideStoryOrHintError',
  admin: {
    noAdminRightsError: 'noAdminRightsError',
    noAdminReadRights: 'noAdminReadRights',
    noAdminWriteRights: 'noAdminWriteRights'
  },
  account: {
    usernameValidationError: 'usernameValidationError',
    usernameInUseError: 'usernameInUseError',
    usernameMaxLengthError: 'usernameMaxLengthError',
    usernameMinLengthError: 'usernameMinLengthError',
    requiredUsernameError: 'requiredUsernameError',
    emailInUseError: 'emailInUseError',
    memberFeatureError: 'memberFeatureError',
    emailNotVerifiedError: 'emailNotVerifiedError'
  },
  bug: {
    bugByIdNotFound: 'bugByIdNotFound',
    bugMessageTooShortError: 'bugMessageTooShortError',
    bugMessageTooLongError: 'bugMessageTooLongError',
    bugSolveMessageTooShortError: 'bugSolveMessageTooShortError',
    bugSolveMessageTooLongError: 'bugSolveMessageTooLongError'
  },
  deckErrors: {
    noDecksFoundError: 'noDecksFoundError'
  },
  graphQlErrors: {
    badUserInput: 'BAD_USER_INPUT',
    unauthenticated: 'UNAUTHENTICATED',
    unauthorized: 'UNAUTHORIZED',
    internalServerError: 'INTERNAL_SERVER_ERROR',
    validationError: 'VALIDATION_ERROR',
    defaultError: 'DEFAULT_ERROR',
  },
  cardErrors: {

  },
  validation: {
    invalidDateError: 'invalidDateError',
    requiredDateError: 'requiredDateError',
    notValidEmailError: 'notValidEmailError',
  },
  session: {
    sessionNotFoundError: 'sessionNotFoundError',
    sessionExpiredError: 'sessionExpiredError',
    notOwnerOfSessionError: 'notOwnerOfSessionError',
    jwtExpiredError: 'jwtExpiredError'
  },
  loginErrors: {
    
  }
};

module.exports = errors;
