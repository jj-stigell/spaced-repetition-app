
import {
  CreationOptional, DataTypes, Model, InferAttributes, InferCreationAttributes, ForeignKey
} from 'sequelize';

import { sequelize } from '..';
import Language from './language';
import Card from './card';

export default class AnswerOption extends Model<
  InferAttributes<AnswerOption>,
  InferCreationAttributes<AnswerOption>
> {
  declare id: CreationOptional<number>;
  declare cardId: ForeignKey<Card['id']>;
  declare languageId: ForeignKey<Language['id']>;
  declare keyword: string;
  declare options: object;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

AnswerOption.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cardId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'card',
      key: 'id'
    }
  },
  languageId: {
    type: DataTypes.CHAR(2),
    allowNull: false,
    references: {
      model: 'language',
      key: 'id'
    }
  },
  keyword: {
    type: DataTypes.STRING,
    allowNull: false
  },
  options: {
    type: DataTypes.JSONB,
    allowNull: false,
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
  },
}, {
  sequelize,
  modelName: 'answer_option'
});
