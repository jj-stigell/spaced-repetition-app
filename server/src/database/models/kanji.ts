import {
  CreationOptional, DataTypes, Model, InferAttributes, InferCreationAttributes, ForeignKey
} from 'sequelize';

import { sequelize } from '..';
import Card from './card';

export default class Kanji extends Model<
  InferAttributes<Kanji>,
  InferCreationAttributes<Kanji>
> {
  declare id: CreationOptional<number>;
  declare cardId: ForeignKey<Card['id']>;
  declare kanji: string;
  declare jlptLevel: number;
  declare onyomi: string;
  declare onyomiRomaji: string;
  declare kunyomi: string;
  declare kunyomiRomaji: string;
  declare strokeCount: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Kanji.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cardId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'card',
      key: 'id'
    }
  },
  kanji: {
    type: DataTypes.CHAR(1),
    unique: true,
    allowNull: false
  },
  jlptLevel: {
    type: DataTypes.INTEGER,
  },
  onyomi: {
    type: DataTypes.STRING,
  },
  onyomiRomaji: {
    type: DataTypes.STRING,
  },
  kunyomi: {
    type: DataTypes.STRING,
  },
  kunyomiRomaji: {
    type: DataTypes.STRING,
  },
  strokeCount: {
    type: DataTypes.INTEGER,
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
  modelName: 'kanji'
});
