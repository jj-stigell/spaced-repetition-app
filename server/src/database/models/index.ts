import Language from './language';
import Account from './account';
import AccountAction from './accountAction';
import Session from './session';
import BugReport from './bugReport';
import Card from './card';
import CardList from './cardList';
import DeckTranslation from './deckTranslation';
import Deck from './deck';
import AnswerOption from './answerOption';
import Kanji from './kanji';
import Vocabulary from './vocabulary';
import Kana from './kana';

Account.hasMany(AccountAction, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

AccountAction.belongsTo(Account, {
  targetKey: 'id',
  foreignKey: 'accountId'
});

Account.hasOne(Language, {
  onDelete: 'NO ACTION',
  onUpdate: 'CASCADE'
});

Language.belongsTo(Account, {
  targetKey: 'id',
  foreignKey: 'languageId'
});

Account.hasMany(Session, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Session.belongsTo(Account, {
  targetKey: 'id',
  foreignKey: 'accountId'
});

/**
 * Bug reports belongs to some card and account, id PK, account_id and card_id FK.
 * On delete set null so bug history stays intact
*/
Account.hasMany(BugReport, {
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

BugReport.belongsTo(Account, {
  targetKey: 'id',
  foreignKey: 'accountId'
});

Card.hasMany(BugReport, {
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

BugReport.belongsTo(Card, {
  targetKey: 'id',
  foreignKey: 'cardId'
});

Language.hasMany(DeckTranslation, {
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

DeckTranslation.belongsTo(Language, {
  targetKey: 'id',
  foreignKey: 'languageId'
});

/** Deck translations, one to many, cascade both on delete and update. */
Deck.hasMany(DeckTranslation, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

DeckTranslation.belongsTo(Deck, {
  targetKey: 'id',
  foreignKey: 'deckId'
});

// Deck & card association through CardList join table.
// Cascade on delete/update.
Deck.hasMany(CardList, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

CardList.belongsTo(Deck, {
  targetKey: 'id',
  foreignKey: 'deckId'
});

Card.hasMany(CardList, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

CardList.belongsTo(Card, {
  targetKey: 'id',
  foreignKey: 'cardId'
});

Card.hasMany(AnswerOption, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

AnswerOption.belongsTo(Card, {
  targetKey: 'id',
  foreignKey: 'cardId'
});

Language.hasMany(AnswerOption, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

AnswerOption.belongsTo(Language, {
  targetKey: 'id',
  foreignKey: 'languageId'
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
Card.hasOne(Vocabulary, {
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

Vocabulary.belongsTo(Card, {
  targetKey: 'id',
  foreignKey: 'cardId'
});

Card.hasOne(Kana, {
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

Kana.belongsTo(Card, {
  targetKey: 'id',
  foreignKey: 'cardId'
});

export default {
  Account,
  AccountAction,
  AnswerOption,
  BugReport,
  Card,
  CardList,
  Deck,
  DeckTranslation,
  Kana,
  Kanji,
  Language,
  Session,
  Vocabulary
};
