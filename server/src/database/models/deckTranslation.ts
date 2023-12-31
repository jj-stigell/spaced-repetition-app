import {
  CreationOptional, DataTypes, Model, InferAttributes, InferCreationAttributes, ForeignKey
} from 'sequelize';

import { sequelize } from '..';
import Deck from './deck';
import Language from './language';

export default class DeckTranslation extends Model<
  InferAttributes<DeckTranslation>,
  InferCreationAttributes<DeckTranslation>
> {
  declare deckId: ForeignKey<Deck['id']>;
  declare languageId: ForeignKey<Language['id']>;
  declare title: string;
  declare description: string;
  declare active: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

DeckTranslation.init(
  {
    deckId: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'deck',
        key: 'id'
      }
    },
    languageId: {
      primaryKey: true,
      type: DataTypes.CHAR(2),
      allowNull: false,
      references: {
        model: 'language',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(60),
      allowNull: false,
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
    tableName: 'deck_translation'
  }
);
