import { DataTypes, Model, ForeignKey, CreationOptional, Optional } from 'sequelize';

import { sequelize } from '..';
import { CardList, ReviewType } from '../../types';
import Deck from './deck';
import Card from './card';

export default class CardListModel extends Model<
  CardList,
  Optional<CardList, 'createdAt' | 'updatedAt'>
> {
  declare deckId: ForeignKey<Deck['id']>;
  declare cardId: ForeignKey<Card['id']>;
  declare active: boolean;
  declare learningOrder: number;
  declare reviewType: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

CardListModel.init(
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
    cardId: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'card',
        key: 'id'
      },
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    learningOrder: {
      type: DataTypes.INTEGER
    },
    reviewType: {
      type: DataTypes.ENUM(ReviewType.RECALL, ReviewType.RECOGNISE),
      allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'card_list'
  }
);
