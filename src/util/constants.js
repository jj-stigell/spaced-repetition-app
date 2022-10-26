const constants = {
  matureInterval: 21,
  defaultLanguage: 'en',
  availableLanguages: ['en', 'fi'],
  resultTypes: ['again', 'good'],
  deckTypes: ['recall', 'recognise'],
  cardTypes: ['kanji', 'hiragana', 'katakana', 'word', 'sentence'],
  jltpLevels: [1, 2, 3, 4, 5],
  maxLimitReviews: 999,
  minLimitReviews: 0,
  maxReviewInterval: 999,
  minReviewInterval: 1,
  maxNewReviews: 100,
  minNewReviews: 0,
  defaultMaxInterval: 999,
  defaultMaxReviewPerDay: 999,
  defaultMaxNewPerDay: 15,
  defaultEasyFactor: 2.5,
  defaultReviewCount: 1
};

module.exports = constants;
