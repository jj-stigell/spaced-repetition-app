import { CreationOptional, DataTypes, Model, ForeignKey, Optional } from 'sequelize';

import { sequelize } from '..';
import Language from './language';
import { Card, CardType } from '../../types';

export default class CardModel extends Model<
  Card,
  Optional<Card, 'id' | 'createdAt' | 'updatedAt'>
> {
  declare id: CreationOptional<number>;
  declare type: string;
  declare languageId: ForeignKey<Language['id']>;
  declare active: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

CardModel.init({
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

