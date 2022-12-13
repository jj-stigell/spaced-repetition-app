const createAccount = {
  email: 'newaccount@test.com',
  username: 'testNew',
  password: 'TestPassword123',
  passwordConfirmation: 'TestPassword123',
  languageId: 'EN'
};

const account = {
  email: 'account@test.com',
  username: 'testUsername',
  password: 'TestPassword123',
  passwordConfirmation: 'TestPassword123',
  languageId: 'EN',
  emailVerified: true,
  member: true
};

const accountUnconfirmedEmail = {
  email: 'unconfirmed@test.com',
  username: 'unconfirmUser',
  password: 'TestPassword123',
  passwordConfirmation: 'TestPassword123',
  languageId: 'EN',
  emailVerified: false,
  member: false
};

const nonMemberAccount = {
  email: 'nonmember@test.com',
  username: 'nonMember',
  password: 'TestPassword123',
  passwordConfirmation: 'TestPassword123',
  languageId: 'EN',
  emailVerified: true,
  member: false
};

const adminReadRights = {
  email: 'read@admin.com',
  password: 'TestPassword123',
  username: 'adminReadRights',
  passwordConfirmation: 'TestPassword123',
  languageId: 'EN',
  emailVerified: true,
  member: true
};

const adminWriteRights = {
  email: 'write@admin.com',
  password: 'TestPassword123',
  username: 'adminWriteRights',
  passwordConfirmation: 'TestPassword123',
  languageId: 'EN',
  emailVerified: true,
  member: true
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

const accountCard = {
  cardId: 1,
  story: 'This is valid story',
  hint: 'This is valid hint'
};

const accountReview = {
  cardId: 1,
  reviewResult: 'GOOD',
  newInterval: 1,
  newEasyFactor: 1.0,
  timing: 5,
  extraReview: false
};

const userAgents = [
  {
    agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36',
    browser: 'Chrome',
    os: 'Windows',
    device: '-'
  },
  {
    agent: 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; Media Center PC 6.0; InfoPath.3; MS-RTC LM 8; Zune 4.7)',
    browser: 'IE',
    os: 'Windows',
    device: '-'
  },
  {
    agent: 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:54.0) Gecko/20100101 Firefox/58.0',
    browser: 'Firefox',
    os: 'Windows',
    device: '-'
  },
  {
    agent: 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_6; es-es) AppleWebKit/533.20.25 (KHTML, like Gecko) Version/5.0.4 Safari/533.20.27',
    browser: 'Safari',
    os: 'Mac OS',
    device: '-'
  },
  {
    agent: 'Opera/9.80 (X11; Linux x86_64; U; fr) Presto/2.9.168 Version/11.50',
    browser: 'Opera',
    os: 'Linux',
    device: '-'
  }
];

module.exports = {
  createAccount,
  account,
  accountUnconfirmedEmail,
  nonMemberAccount,
  adminReadRights,
  adminWriteRights,
  passwordData,
  stringData,
  validBugReport,
  solveBugReport,
  deckSettings,
  accountCard,
  accountReview,
  userAgents
};
