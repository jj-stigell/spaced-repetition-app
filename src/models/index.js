const Account = require('./account');
const Kanji = require('./kanji');
const Country = require('./country');
const Radical = require('./radical');
const TranslationRadical = require('./translationRadical');
const KanjiRadical = require('./kanjiRadical');
const TranslationKanji = require('./translationKanji');
const ExampleWord = require('./exampleWord');
const ExampleWordTranslation = require('./exampleWordTranslation');
const AccountKanjiCard = require('./accountKanjiCard');
const AccountKanjiReview = require('./accountKanjiReview');

// Radical can have multiple translations that are identified with lang id and radical id
Radical.hasMany(TranslationRadical, {
  foreignKey: 'radical_id'
});
Country.hasMany(TranslationRadical, {
  foreignKey: 'language_id'
});

// Radicals that kanji has, the kanji that has multiple radicals attached to it
Kanji.belongsToMany(Radical, { through: KanjiRadical });
Radical.belongsToMany(Kanji, { through: KanjiRadical });

// Kanji and language can have multiple translations, but translation may have only one kanji+lang id combination
Kanji.hasMany(TranslationKanji, {
  foreignKey: 'kanji_id'
});
Country.hasMany(TranslationKanji, {
  foreignKey: 'language_id'
});

// Example word has multiple translations based on the lang id
ExampleWord.hasMany(ExampleWordTranslation, {
  foreignKey: 'word_id'
});
Country.hasMany(ExampleWordTranslation, {
  foreignKey: 'language_id'
});

// Account can have multiple revies of the same kanji (history of reviews)
Kanji.hasMany(AccountKanjiReview, {
  foreignKey: 'kanji_id'
});
Account.hasMany(AccountKanjiReview, {
  foreignKey: 'account_id'
});

// Account can have multiple personal kanji cards, but only one per unique kanji
Kanji.hasMany(AccountKanjiCard, {
  foreignKey: 'kanji_id'
});
Account.hasMany(AccountKanjiCard, {
  foreignKey: 'account_id'
});

module.exports = {
  Account,
  Kanji,
  Country,
  Radical,
  TranslationRadical,
  KanjiRadical,
  TranslationKanji,
  ExampleWord,
  ExampleWordTranslation,
  AccountKanjiCard,
  AccountKanjiReview
};
