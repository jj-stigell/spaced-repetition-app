const errors = {
  generalErrors: {
    invalidJlptLevelError: 'invalidJlptLevelError',
    invalidLanguageIdError: 'invalidLanguageIdError'
  },
  adminErrors: {
    noAdminRightsError: 'noAdminRightsError',
    noAdminReadRightsError: 'noAdminReadRightsError',
    noAdminWriteRightsError: 'noAdminWriteRightsError'
  },
  accountErrors: {
    usernameInUseError: 'usernameInUseError',
    emailInUseError: 'emailInUseError',
    memberFeatureError: 'memberFeatureError',
    emailNotVerifiedError: 'emailNotVerifiedError'
  },
  bugErrors: {
    bugByIdNotFoundError: 'bugByIdNotFoundError',
    bugMessageTooShortError: 'bugMessageTooShortError',
    bugMessageTooLongError: 'bugMessageTooLongError',
    bugSolveMessageTooShortError: 'bugSolveMessageTooShortError',
    bugSolveMessageTooLongError: 'bugSolveMessageTooLongError'
  },
  deckErrors: {
    noDecksFoundError: 'noDecksFoundError',
    nonActiveDeckError: 'nonActiveDeckError',
    nonExistingDeckIdError: 'nonExistingDeckIdError'
  },
  reviewErrors: {
    maxLimitReviewsError: 'maxLimitReviewsError',
    minLimitReviewsError: 'minLimitReviewsError',
    maxNewReviewsError: 'maxNewReviewsError',
    minNewReviewsError: 'minNewReviewsError',
    pushReviewsLimitError: 'pushReviewsLimitError',
    invalidResultTypeError: 'invalidResultTypeError'
  },
  graphQlErrors: {
    badUserInput: 'BAD_USER_INPUT',
    unauthenticated: 'UNAUTHENTICATED',
    unauthorized: 'UNAUTHORIZED',
    internalServerError: 'INTERNAL_SERVER_ERROR',
    validationError: 'VALIDATION_ERROR',
    defaultError: 'DEFAULT_ERROR'
  },
  cardErrors: {
    maxReviewIntervalError: 'maxReviewIntervalError',
    minReviewIntervalError: 'minReviewIntervalError',
    noDueCardsError: 'noDueCardsError',
    storyTooLongError: 'storyTooLongError',
    storyTooShortError: 'storyTooShortError',
    hintTooLongError: 'hintTooLongError',
    hintTooShortError: 'hintTooShortError',
    provideStoryOrHintError: 'provideStoryOrHintError',
    nonExistingCardIdError: 'nonExistingCardIdError',
    invalidCardTypeError: 'invalidCardTypeError'
  },
  validationErrors: {
    inputValueMissingError: 'inputValueMissingError',
    invalidDateError: 'invalidDateError',
    requiredDateError: 'requiredDateError',
    notValidEmailError: 'notValidEmailError',
    requiredPasswordError: 'requiredPasswordError',
    emailMaxLengthError: 'emailMaxLengthError',
    passwordMismatchError: 'passwordMismatchError',
    inputValueTypeError: 'inputValueTypeError',
    requiredEmailError: 'requiredEmailError',
    requiredResultTypeError: 'requiredResultTypeError', 
    userOrPassIncorrectError: 'userOrPassIncorrectError',
    passwordNumberError: 'passwordNumberError',
    passwordUppercaseError: 'passwordUppercaseError',
    passwordLowercaseError: 'passwordLowercaseError',
    passwordMaxLengthError: 'passwordMaxLengthError',
    passwordMinLengthError: 'passwordMinLengthError',
    negativeNumberTypeError: 'negativeNumberTypeError',
    requiredPasswordConfirmError: 'requiredPasswordConfirmError',
    currAndNewPassEqualError: 'currAndNewPassEqualError',
    currentPasswordIncorrectError: 'currentPasswordIncorrectError',
    usernameMaxLengthError: 'usernameMaxLengthError',
    usernameMinLengthError: 'usernameMinLengthError',
    requiredUsernameError: 'requiredUsernameError'
  },
  sessionErrors: {
    sessionNotFoundError: 'sessionNotFoundError',
    sessionExpiredError: 'sessionExpiredError',
    notOwnerOfSessionError: 'notOwnerOfSessionError',
    jwtExpiredError: 'jwtExpiredError'
  }
};

module.exports = errors;
