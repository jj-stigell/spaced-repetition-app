const Account = require('./account/account');
const AccountCard = require('./account/accountCard');
const AccountDeckSettings = require('./account/accountDeckSettings');
const AccountReview = require('./account/accountReview');
const Admin = require('./account/admin');
const Card = require('./card/card');
const CardList = require('./card/cardList');
const Country = require('./country/country');
const Deck = require('./deck/deck');
const DeckTranslation = require('./deck/deckTranslation');
const Kanji = require('./kanji/kanji');
const KanjiRadical = require('./kanji/kanjiRadical');
const KanjiTranslation = require('./kanji/kanjiTranslation');
const Radical = require('./radical/radical');
const RadicalTranslation = require('./radical/radicalTranslation');
const JapaneseWord = require('./word/japaneseWord');
const JapaneseWordTranslation = require('./word/japaneseWordTranslation');

// Account can have one admin entry, on delete cascade to admin table
Account.hasOne(Admin, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  foreignKey: {
    allowNull: false
  }
});
Admin.belongsTo(Account, {
  targetKey: 'id',
  foreignKey: 'accountId',
});

// Country has many accounts, deck, deck translations with the country code being FK, cascade on updates, no deletion of language allowed
Country.hasMany(Account, {
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT',
});

Account.belongsTo(Country, {
  targetKey: 'countryCode',
  foreignKey: 'languageId'
});

Country.hasMany(Deck, {
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT',
});

Deck.belongsTo(Country, {
  targetKey: 'countryCode',
  foreignKey: 'languageId'
});

Country.hasMany(Card, {
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT',
});

Card.belongsTo(Country, {
  targetKey: 'countryCode',
  foreignKey: 'languageId'
});

Country.hasMany(DeckTranslation, {
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT',
});

DeckTranslation.belongsTo(Country, {
  targetKey: 'countryCode',
  foreignKey: 'languageId'
});

Country.hasMany(KanjiTranslation, {
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT',
});

KanjiTranslation.belongsTo(Country, {
  targetKey: 'countryCode',
  foreignKey: 'languageId'
});

Country.hasMany(RadicalTranslation, {
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT',
});

RadicalTranslation.belongsTo(Country, {
  targetKey: 'countryCode',
  foreignKey: 'languageId'
});

Country.hasMany(JapaneseWordTranslation, {
  onUpdate: 'CASCADE',
  onDelete: 'RESTRICT',
});

JapaneseWordTranslation.belongsTo(Country, {
  targetKey: 'countryCode',
  foreignKey: 'languageId'
});






// Radicals can have multiple translations that are identified with lang id and radical id
Radical.hasMany(RadicalTranslation, {
  onDelete: 'CASCADE'
});

RadicalTranslation.belongsTo(Radical, {
  targetKey: 'id',
  foreignKey: 'radical_id',
});






/*
// Radicals that kanji has, the kanji that has multiple radicals attached to it
Kanji.belongsToMany(Radical, { through: KanjiRadical });
Radical.belongsToMany(Kanji, { through: KanjiRadical });

// Kanji and language can have multiple translations, but translation may have only one kanji+lang id combination
Kanji.hasMany(KanjiTranslation, {
  foreignKey: 'kanji_id'
});
Country.hasMany(KanjiTranslation, {
  foreignKey: 'country_code'
});

// Example word has multiple translations based on the lang id
JapaneseWord.hasMany(JapaneseWordTranslation, {
  foreignKey: 'word_id'
});
Country.hasMany(JapaneseWordTranslation, {
  foreignKey: 'country_code'
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
});*/

module.exports = {
  Account,
  Kanji,
  Country,
  Radical,
  RadicalTranslation,
  KanjiRadical,
  KanjiTranslation,
  JapaneseWord,
  JapaneseWordTranslation,
  AccountCard,
  AccountReview,
  AccountDeckSettings,
  Card,
  CardList,
  Deck,
  DeckTranslation
};


/*
// Radical can have multiple translations that are identified with lang id and radical id
Radical.hasMany(RadicalTranslation, {
  foreignKey: 'radical_id'
});

RadicalTranslation.belongsTo(Radical, {
  targetKey: 'id',
  foreignKey: 'radical_id',
});


Country.hasMany(RadicalTranslation, {
  foreignKey: 'country_code'
});







// Radicals that kanji has, the kanji that has multiple radicals attached to it
Kanji.belongsToMany(Radical, { through: KanjiRadical });
Radical.belongsToMany(Kanji, { through: KanjiRadical });

// Kanji and language can have multiple translations, but translation may have only one kanji+lang id combination
Kanji.hasMany(TranslationKanji, {
  foreignKey: 'kanji_id'
});
Country.hasMany(TranslationKanji, {
  foreignKey: 'country_code'
});

// Example word has multiple translations based on the lang id
Word.hasMany(WordTranslation, {
  foreignKey: 'word_id'
});
Country.hasMany(WordTranslation, {
  foreignKey: 'country_code'
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
  RadicalTranslation,
  KanjiRadical,
  TranslationKanji,
  Word,
  WordTranslation,
  AccountKanjiCard,
  AccountKanjiReview
};
*/
