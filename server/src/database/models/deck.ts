import {
  CreationOptional, DataTypes, Model, InferAttributes, InferCreationAttributes, ForeignKey
} from 'sequelize';

import { sequelize } from '..';
import { DeckCategory, JlptLevel } from '../../types';
import Language from './language';

export default class Deck extends Model<
  InferAttributes<Deck>,
  InferCreationAttributes<Deck>
> {
  declare id: CreationOptional<number>;
  declare jlptLevel: number;
  declare deckName: string;
  declare cards: number;
  declare category: string;
  declare memberOnly: boolean;
  declare languageId: ForeignKey<Language['id']>;
  declare active: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Deck.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    jlptLevel: {
      type: DataTypes.INTEGER,
      validate: {
        isIn: [[
          JlptLevel.N1,
          JlptLevel.N2,
          JlptLevel.N3,
          JlptLevel.N4,
          JlptLevel.N5
        ]],
      }
    },
    deckName: {
      type: DataTypes.STRING(60),
      allowNull: false,
      unique: true,
    },
    cards: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    category: {
      type: DataTypes.ENUM(
        DeckCategory.GRAMMAR,
        DeckCategory.KANA,
        DeckCategory.KANJI,
        DeckCategory.VOCABULARY
      ),
      allowNull: false
    },
    memberOnly: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
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
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'deck'
  }
);
