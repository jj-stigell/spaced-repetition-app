import {
  DataTypes, Model, InferAttributes, InferCreationAttributes, ForeignKey, CreationOptional
} from 'sequelize';

import { sequelize } from '..';
import { ReviewType } from '../../type';
import Deck from './deck';
import Card from './card';

export default class CardList extends Model<
  InferAttributes<CardList>,
  InferCreationAttributes<CardList>
> {
  declare deckId: ForeignKey<Deck['id']>;
  declare cardId: ForeignKey<Card['id']>;
  declare active: boolean;
  declare learningOrder: number;
  declare reviewType: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

CardList.init(
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
