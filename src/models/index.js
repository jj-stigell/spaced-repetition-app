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
  foreignKey: 'accountId'
});

// Country has many accounts, deck, deck translations, etc. with
// the country code being FK, cascade on updates, no deletion of language allowed
Country.hasMany(Account, {
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

Account.belongsTo(Country, {
  targetKey: 'countryCode',
  foreignKey: 'languageId'
});

Country.hasMany(Deck, {
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

Deck.belongsTo(Country, {
  targetKey: 'countryCode',
  foreignKey: 'languageId'
});

Country.hasMany(Card, {
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

Card.belongsTo(Country, {
  targetKey: 'countryCode',
  foreignKey: 'languageId'
});

Country.hasMany(DeckTranslation, {
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

DeckTranslation.belongsTo(Country, {
  targetKey: 'countryCode',
  foreignKey: 'languageId'
});

// Kanji can have multiple translations that are identified with language_id and kanji_id
// Cascade delete only when kanji is deleted
Kanji.hasMany(KanjiTranslation, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

KanjiTranslation.belongsTo(Kanji, {
  targetKey: 'id',
  foreignKey: 'kanjiId'
});

Country.hasMany(KanjiTranslation, {
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

KanjiTranslation.belongsTo(Country, {
  targetKey: 'countryCode',
  foreignKey: 'languageId'
});

// Radicals can have multiple translations that are identified with language_id and radical_id
// Cascade delete only when radical is deleted
Radical.hasMany(RadicalTranslation, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

RadicalTranslation.belongsTo(Radical, {
  targetKey: 'id',
  foreignKey: 'radicalId'
});

Country.hasMany(RadicalTranslation, {
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

RadicalTranslation.belongsTo(Country, {
  targetKey: 'countryCode',
  foreignKey: 'languageId'
});

// Japanese words can have multiple translations that are identified with language_id and kanji_id
// Cascade delete only when word is deleted
JapaneseWord.hasMany(JapaneseWordTranslation, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

JapaneseWordTranslation.belongsTo(JapaneseWord, {
  targetKey: 'id',
  foreignKey: 'wordId'
});

Country.hasMany(JapaneseWordTranslation, {
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

JapaneseWordTranslation.belongsTo(Country, {
  targetKey: 'countryCode',
  foreignKey: 'languageId'
});

// Radical & kanji association through KanjiRadical join table
Kanji.belongsToMany(Radical, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  through: KanjiRadical
});

Radical.belongsToMany(Kanji, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  through: KanjiRadical
});

// Account reviews, review belongs to some card and account, id PK, account_id and card_id FK
// On delete set null so stats can be collected
Account.hasMany(AccountReview, {
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

AccountReview.belongsTo(Account, {
  targetKey: 'id',
  foreignKey: 'accountId'
});

Card.hasMany(AccountReview, {
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

AccountReview.belongsTo(Card, {
  targetKey: 'id',
  foreignKey: 'cardId'
});










/*

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
*/