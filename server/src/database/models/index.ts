import Language from './language';
import Account from './account';
import AccountAction from './accountAction';
import Session from './session';
import BugReport from './bugReport';
import Card from './card';

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

// Bug reports belongs to some card and account, id PK, account_id and card_id FK
// On delete set null so bug history stays intact
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

export default {
  Account,
  AccountAction,
  BugReport,
  Card,
  Language,
  Session
};
