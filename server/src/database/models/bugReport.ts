import { CreationOptional, DataTypes, Model, ForeignKey, Optional } from 'sequelize';

import { sequelize } from '..';
import { bugs } from '../../configs/constants';
import { BugReport, BugType } from '../../types';
import Account from './account';
import Card from './card';

export default class BugReportModel extends Model<
  BugReport,
  Optional<BugReport, 'id' | 'createdAt' | 'updatedAt' | 'solvedMessage' | 'solved' | 'cardId'>
> {
  declare id: CreationOptional<number>;
  declare accountId: ForeignKey<Account['id']>;
  declare cardId: CreationOptional<ForeignKey<Card['id']>>;
  declare type: string;
  declare bugMessage: string;
  declare solvedMessage: CreationOptional<string>;
  declare solved: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

BugReportModel.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  accountId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'account',
      key: 'id'
    }
  },
  cardId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'card',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM(
      BugType.TRANSLATION,
      BugType.UI,
      BugType.FUNCTIONALITY,
      BugType.OTHER
    ),
    allowNull: false
  },
  bugMessage: {
    type: DataTypes.STRING,
    validate: {
      len: [
        bugs.BUG_MESSAGE_MIN_LENGTH,
        bugs.BUG_MESSAGE_MAX_LENGTH
      ]
    }
  },
  solvedMessage: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
    validate: {
      len: [
        bugs.SOLVED_MESSAGE_MIN_LENGTH,
        bugs.SOLVED_MESSAGE_MAX_LENGTH
      ]
    }
  },
  solved: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  tableName: 'bug_report'
});
