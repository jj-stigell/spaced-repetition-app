const account = {
  email: 'testing@test.com',
  password: 'ThisIsValid123',
  passwordConfirmation: 'ThisIsValid123',
  languageId: 'en'
};

const passwordData = {
  currentPassword: account.password,
  newPassword: 'ThisIsNewPass123',
  newPasswordConfirmation: 'ThisIsNewPass123'
};

const stringData = {
  availableEmail: 'emailnottaken@test.com',
  nonExistingEmail: 'nonExistingEmail@test.com',
  notAvailableLanguage: 'xu',
  incorrectPassword: 'ThisIsNotCorrect123',
  noNumbersPass: 'noNumbersInThisOne',
  notLongEnoughPass: '1234Len',
  tooLongPassword: 'LenIsMoreThan50WhichIsTheCurrentLimitDidUUnderstand',
  noUpperCasePass: 'thisisnotvalid123',
  noLowerCasePass: 'THISISNOTVALID123',
  nonValidEmail: 'emailgoogle.com',
  nonAlphaNumeric: 'Len_Is_;OK',
  tooLongUsername: 'LenIsMoreThan14'
};

module.exports = {
  account,
  passwordData,
  stringData
};
