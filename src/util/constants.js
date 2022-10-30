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
  defaultEasyFactor: 2.5,
  defaultReviewCount: 1,
  maxAmountOfDecks: 50,
  passwordMaxLength: 50,
  passwordMinLength: 8,
  jwtExpiryTime: 60*60*300,
  saltRounds: 10,
  lowercaseRegex: /^(?=.*[a-z])/,
  uppercaseRegex: /^(?=.*[A-Z])/,
  numberRegex: /^(?=.*[0-9])/,
};

module.exports = constants;
