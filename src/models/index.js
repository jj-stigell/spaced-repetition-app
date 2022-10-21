const Account = require('./account/account');
const AccountCard = require('./account/accountCard');
const AccountDeckSettings = require('./account/accountDeckSettings');
const AccountReview = require('./account/accountReview');
const Admin = require('./account/admin');
const Card = require('./card/card');
const CardList = require('./card/cardList');
const Language = require('./language/language');
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

// Language has many accounts, deck, deck translations, etc. with
// the language code being FK, cascade on updates, no deletion of language allowed
Language.hasMany(Account, {
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

Account.belongsTo(Language, {
  targetKey: 'id',
  foreignKey: 'languageId'
});

Language.hasMany(Deck, {
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

Deck.belongsTo(Language, {
  targetKey: 'id',
  foreignKey: 'languageId'
});

Language.hasMany(Card, {
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

Card.belongsTo(Language, {
  targetKey: 'id',
  foreignKey: 'languageId'
});

Language.hasMany(DeckTranslation, {
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

DeckTranslation.belongsTo(Language, {
  targetKey: 'id',
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

Language.hasMany(KanjiTranslation, {
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

KanjiTranslation.belongsTo(Language, {
  targetKey: 'id',
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

Language.hasMany(RadicalTranslation, {
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

RadicalTranslation.belongsTo(Language, {
  targetKey: 'id',
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

Language.hasMany(JapaneseWordTranslation, {
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

JapaneseWordTranslation.belongsTo(Language, {
  targetKey: 'id',
  foreignKey: 'languageId'
});

// Radical & kanji association through KanjiRadical join table
// delete/update entry from join table When either one is deleted
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

// Deck & card association through CardList join table
// delete/update entry from join table When either one is deleted
Deck.belongsToMany(Card, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  through: CardList
});

Card.belongsToMany(Deck, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  through: CardList
});

// Deck translations, one to many, cascade both on delete and update
Deck.hasMany(DeckTranslation, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

DeckTranslation.belongsTo(Deck, {
  targetKey: 'id',
  foreignKey: 'deckId'
});

// Kanji & card relation. Kanji belongs to one card but on card delete set null
Card.hasOne(Kanji, {
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});
Kanji.belongsTo(Card, {
  targetKey: 'id',
  foreignKey: 'cardId'
});

// Word & card relation. Word belongs to one card but on card delete set null
Card.hasOne(JapaneseWord, {
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});
JapaneseWord.belongsTo(Card, {
  targetKey: 'id',
  foreignKey: 'cardId'
});

// Account customized card (personal hints, stories, metadata), account/card specific
Account.hasMany(AccountCard, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

AccountCard.belongsTo(Account, {
  targetKey: 'id',
  foreignKey: 'accountId'
});

Card.hasMany(AccountCard, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

AccountCard.belongsTo(Card, {
  targetKey: 'id',
  foreignKey: 'cardId'
});

// Account specific deck settings
Account.hasMany(AccountDeckSettings, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

AccountDeckSettings.belongsTo(Account, {
  targetKey: 'id',
  foreignKey: 'accountId'
});

Deck.hasMany(AccountDeckSettings, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

AccountDeckSettings.belongsTo(Deck, {
  targetKey: 'id',
  foreignKey: 'deckId'
});

module.exports = {
  Account,
  Admin,
  Kanji,
  Language,
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
