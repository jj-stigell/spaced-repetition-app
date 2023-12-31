import { CreationOptional, DataTypes, Model, ForeignKey, Optional } from 'sequelize';

import { sequelize } from '..';
import Language from './language';
import { Card as CardType, CardType as CardTypeType } from '../../types';

export default class Card extends Model<
  CardType,
  Optional<CardType, 'id' | 'createdAt' | 'updatedAt'>
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
      CardTypeType.KANJI,
      CardTypeType.KANA,
      CardTypeType.VOCABULARY,
      CardTypeType.SENTENCE,
      CardTypeType.GRAMMAR,
      CardTypeType.RECALL_KANJI_SENTENCE,
      CardTypeType.RECOGNIZE_KANJI_SENTENCE
    ),
    allowNull: false
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

