const account = {
  email: 'testing@test.com',
  username: 'testUsername',
  password: 'ThisIsValid123',
  passwordConfirmation: 'ThisIsValid123',
  languageId: 'EN'
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
  tooShortUsername: 'Le3'
};

module.exports = {
  account,
  passwordData,
  stringData
};
