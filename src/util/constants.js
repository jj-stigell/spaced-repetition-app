const constants = {
  matureInterval: 21,
  defaultLanguage: 'en',
  availableLanguages: ['en', 'fi'],
  resultTypes: ['again', 'good'],
  deckTypes: ['recall', 'recognise'],
  cardTypes: ['kanji', 'hiragana', 'katakana', 'word', 'sentence'],
  jltpLevels: [1, 2, 3, 4, 5],                                          // Available JLPT levels, officially
  maxLimitReviews: 999,
  minLimitReviews: 0,
  maxReviewInterval: 999,
  minReviewInterval: 1,
  maxNewReviews: 100,
  minNewReviews: 0,
  defaultInterval: 999,
  defaultReviewPerDay: 999,
  defaultNewPerDay: 15,
  maxPushReviewsDays: 7,                                                // How many days can user at maximum push reviews ahead
  defaultReviewCount: 1,
  maxAmountOfDecks: 50,
  passwordMaxLength: 50,
  passwordMinLength: 8,
  login: {
    jwtExpiryTime: 60*60*24*28,
    sessionLifetime: 28,                                                // How long a new session will last in days, same as jwt expiry time
    saltRounds: 10,
  },
  card: {
    storyMinLength: 1,
    storyMaxLength: 160,
    hintMinLength: 1,
    hintMaxLength: 25,
    defaultEasyFactor: 2.5,
  },
  bugs: {
    bugMessageMinLength: 5,
    bugMessageMaxLength: 100,
    solvedMessageMinLength: 1,
    solvedMessageMaxLength: 160,
    bugTypes: ['translation', 'user-interface', 'functionality', 'other']
  },
  lowercaseRegex: /^(?=.*[a-z])/,
  uppercaseRegex: /^(?=.*[A-Z])/,
  numberRegex: /^(?=.*[0-9])/,
  yupAbortEarly: false                      // Abort validation early, or validate everything
};

module.exports = constants;
