const Account = require('./account/account');
const Admin = require('./account/admin');
const Kanji = require('./kanji/kanji');
const Country = require('./country/country');
const Radical = require('./radical/radical');
const TranslationRadical = require('./radical/translationRadical');
const KanjiRadical = require('./kanji/kanjiRadical');
const TranslationKanji = require('./kanji/translationKanji');
const Word = require('./word/word');
const WordTranslation = require('./word/wordTranslation');
const AccountKanjiCard = require('./kanji/accountKanjiCard');
const AccountKanjiReview = require('./kanji/accountKanjiReview');



Account.hasOne(Admin, {
  onDelete: 'CASCADE'
});
Admin.belongsTo(Account, {
  targetKey: 'id',
  foreignKey: 'account_id',
});


/*
Foo.hasOne(Bar, {
  onDelete: 'RESTRICT',
  onUpdate: 'RESTRICT'
});

Foo.hasOne(Bar, { sourceKey: 'name', foreignKey: 'fooName' });

Ship.belongsTo(Captain, { targetKey: 'name', foreignKey: 'captainName' });

 "db.admins.belongsTo(db.users, { foreignKey: "id", targetKey: "id" });" – 
*/


// Radical can have multiple translations that are identified with lang id and radical id
Radical.hasMany(TranslationRadical, {
  foreignKey: 'radical_id'
});
Country.hasMany(TranslationRadical, {
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
  TranslationRadical,
  KanjiRadical,
  TranslationKanji,
  Word,
  WordTranslation,
  AccountKanjiCard,
  AccountKanjiReview
};
