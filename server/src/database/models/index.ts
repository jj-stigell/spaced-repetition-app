import Language from './language';
import Account from './account';
import AccountAction from './accountAction';
import Session from './session';
import BugReport from './bugReport';
import Card from './card';
import CardList from './cardList';
import DeckTranslation from './deckTranslation';
import Deck from './deck';
import Kanji from './kanji';
import Vocabulary from './vocabulary';
import Kana from './kana';
import AnswerOption from './answerOption';

/**
 * Account has many AccountActions. On deletion of an Account,
 * all related AccountActions are deleted.
 */
Account.hasMany(AccountAction, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

/**
 * AccountAction belongs to Account. The foreign key is 'accountId'.
 */
AccountAction.belongsTo(Account, {
  targetKey: 'id',
  foreignKey: 'accountId'
});

/**
 * Account has one associated Language. No action on deletion of Account.
 */
Account.hasOne(Language, {
  onDelete: 'NO ACTION',
  onUpdate: 'CASCADE'
});

/**
 * Language belongs to Account. The foreign key is 'languageId'.
 */
Language.belongsTo(Account, {
  targetKey: 'id',
  foreignKey: 'languageId'
});

/**
 * Account has many Sessions. On deletion of an Account, all related Sessions are deleted.
 */
Account.hasMany(Session, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

/**
 * Session belongs to Account. The foreign key is 'accountId'.
 */
Session.belongsTo(Account, {
  targetKey: 'id',
  foreignKey: 'accountId'
});

/**
 * Account has many BugReports. On deletion of an Account, BugReport references are set to null.
 */
Account.hasMany(BugReport, {
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

/**
 * BugReport belongs to Account. The foreign key is 'accountId'.
 */
BugReport.belongsTo(Account, {
  targetKey: 'id',
  foreignKey: 'accountId'
});

/**
 * Card has many BugReports. On deletion of a Card, BugReport references are set to null.
 */
Card.hasMany(BugReport, {
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

/**
 * BugReport belongs to Card. The foreign key is 'cardId'.
 */
BugReport.belongsTo(Card, {
  targetKey: 'id',
  foreignKey: 'cardId'
});

/**
 * Language has many DeckTranslations.
 * Deletion of Language is restricted if related DeckTranslations exist.
 */
Language.hasMany(DeckTranslation, {
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});

/**
 * DeckTranslation belongs to Language. The foreign key is 'languageId'.
 */
DeckTranslation.belongsTo(Language, {
  targetKey: 'id',
  foreignKey: 'languageId'
});

/**
 * Deck has many DeckTranslations. On deletion of a Deck, all related DeckTranslations are deleted.
 */
Deck.hasMany(DeckTranslation, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

/**
 * DeckTranslation belongs to Deck. The foreign key is 'deckId'.
 */
DeckTranslation.belongsTo(Deck, {
  targetKey: 'id',
  foreignKey: 'deckId'
});

/**
 * Deck has many CardLists. On deletion of a Deck, all related CardLists are deleted.
 */
Deck.hasMany(CardList, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

/**
 * CardList belongs to Deck. The foreign key is 'deckId'.
 */
CardList.belongsTo(Deck, {
  targetKey: 'id',
  foreignKey: 'deckId'
});

/**
 * Card has many CardLists. On deletion of a Card, all related CardLists are deleted.
 */
Card.hasMany(CardList, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

/**
 * CardList belongs to Card. The foreign key is 'cardId'.
 */
CardList.belongsTo(Card, {
  targetKey: 'id',
  foreignKey: 'cardId'
});

/**
 * Card has many AnswerOptions. On deletion of a Card, all related AnswerOptions are deleted.
 */
Card.hasMany(AnswerOption, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

/**
 * AnswerOption belongs to Card. The foreign key is 'cardId'.
 */
AnswerOption.belongsTo(Card, {
  targetKey: 'id',
  foreignKey: 'cardId'
});

/**
 * Language has many AnswerOptions. On deletion of a Language,
 * all related AnswerOptions are deleted.
 */
Language.hasMany(AnswerOption, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

/**
 * AnswerOption belongs to Language. The foreign key is 'languageId'.
 */
AnswerOption.belongsTo(Language, {
  targetKey: 'id',
  foreignKey: 'languageId'
});

/**
 * Card has one Kanji. On deletion of a Card, the Kanji reference is set to null.
 */
Card.hasOne(Kanji, {
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

/**
 * Kanji belongs to Card. The foreign key is 'cardId'.
 */
Kanji.belongsTo(Card, {
  targetKey: 'id',
  foreignKey: 'cardId'
});

/**
 * Card has one Vocabulary. On deletion of a Card, the Vocabulary reference is set to null.
 */
Card.hasOne(Vocabulary, {
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

/**
 * Vocabulary belongs to Card. The foreign key is 'cardId'.
 */
Vocabulary.belongsTo(Card, {
  targetKey: 'id',
  foreignKey: 'cardId'
});

/**
 * Card has one Kana. On deletion of a Card, the Kana reference is set to null.
 */
Card.hasOne(Kana, {
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
});

/**
 * Kana belongs to Card. The foreign key is 'cardId'.
 */
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
