const account = {
  email: 'testing@test.com',
  username: 'testUsername',
  password: 'ThisIsValid123',
  passwordConfirmation: 'ThisIsValid123',
  languageId: 'EN'
};

const adminReadRights = {
  email: 'read@admin.com',
  password: 'TestPassword123'
};

const adminWriteRights = {
  email: 'write@admin.com',
  password: 'TestPassword123'
};

const passwordData = {
  currentPassword: account.password,
  newPassword: 'ThisIsNewPass123',
  newPasswordConfirmation: 'ThisIsNewPass123'
};

const stringData = {
  availableEmail: 'emailnottaken@test.com',
  availableUsername: 'ava1labuseR',
  nonExistingEmail: 'nonExistingEmail@test.com',
  notAvailableLanguage: 'XU',
  incorrectPassword: 'ThisIsNotCorrect123',
  noNumbersPass: 'noNumbersInThisOne',
  notLongEnoughPass: '1234Len',
  tooLongPassword: 'LenIsMoreThan50WhichIsTheCurrentLimitDidUUnderstand',
  noUpperCasePass: 'thisisnotvalid123',
  noLowerCasePass: 'THISISNOTVALID123',
  nonValidEmail: 'emailgoogle.com',
  nonAlphaNumeric: 'Len_Is_;OK',
  tooLongUsername: 'LenIsMoreThan14',
  tooShortUsername: 'Le3',
  notValidEnum: 'THISISNOTVALID'
};

const validBugReport = {
  bugMessage: 'This is message for the bug report for integration tests',
  type: 'UI',
  cardId: 23
};

const solveBugReport = {
  solved: true,
  solvedMessage: 'This is message the solve message for bug report'
};

const deckSettings = {
  newCardsPerDay: 15,
  reviewsPerDay: 16,
  reviewInterval: 17,
  favorite: true
};

module.exports = {
  account,
  adminReadRights,
  adminWriteRights,
  passwordData,
  stringData,
  validBugReport,
  solveBugReport,
  deckSettings
};
