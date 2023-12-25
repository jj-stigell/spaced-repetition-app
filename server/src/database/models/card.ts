import {
  CreationOptional, DataTypes, Model, InferAttributes, InferCreationAttributes, ForeignKey
} from 'sequelize';

import { sequelize } from '..';
import { CardType } from '../../type';
import Language from './language';

export default class Card extends Model<
  InferAttributes<Card>,
  InferCreationAttributes<Card>
> {
  declare id: CreationOptional<number>;
  declare type: string;
  declare languageId: ForeignKey<Language['id']>;
  declare active: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Card.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.ENUM(
      CardType.KANJI,
      CardType.KANA,
      CardType.VOCABULARY,
      CardType.SENTENCE,
      CardType.GRAMMAR,
      CardType.RECALL_KANJI_SENTENCE,
      CardType.RECOGNIZE_KANJI_SENTENCE
    ),
    allowNull: false
  },
  languageId: {
    type: DataTypes.CHAR(2),
    allowNull: false,
    references: {
      model: 'language',
      key: 'id'
    }
  },
  active: {
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
  },
}, {
  sequelize,
  modelName: 'card'
});

