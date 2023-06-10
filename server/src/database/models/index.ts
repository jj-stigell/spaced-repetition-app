import Language from './language';
import Account from './account';
import AccountAction from './accountAction';
import Session from './session';
import BugReport from './bugReport';
import Card from './card';
import CardList from './cardList';
import DeckTranslation from './deckTranslation';
import Deck from './deck';
import CardTranslation from './cardTranslation';

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

Card.hasMany(CardTranslation, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

CardTranslation.belongsTo(Card, {
  targetKey: 'id',
  foreignKey: 'cardId'
});

Language.hasMany(CardTranslation, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

CardTranslation.belongsTo(Language, {
  targetKey: 'id',
  foreignKey: 'languageId'
});

export default {
  Account,
  AccountAction,
  BugReport,
  Card,
  CardList,
  CardTranslation,
  Deck,
  DeckTranslation,
  Language,
  Session
};
