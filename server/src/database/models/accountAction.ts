import { CreationOptional, DataTypes, Model, ForeignKey, Optional } from 'sequelize';

import { sequelize } from '..';
import Account from './account';
import { AccountAction, ActionType } from '../../types';

export default class AccountActionModel extends Model<
  AccountAction,
  Optional<AccountAction, 'id' | 'createdAt' | 'updatedAt'>
> {
  declare id: CreationOptional<string>;
  declare accountId: ForeignKey<Account['id']>;
  declare type: string;
  declare expireAt: Date;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

AccountActionModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    accountId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'account',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.ENUM(
        ActionType.CONFIRM_EMAIL,
        ActionType.RESET_PASSWORD
      ),
      allowNull: false
    },
    expireAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'account_action'
  }
);
