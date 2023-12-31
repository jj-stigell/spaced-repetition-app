import {
  CreationOptional, DataTypes, Model, InferAttributes, InferCreationAttributes, ForeignKey
} from 'sequelize';

import { sequelize } from '..';
import Card from './card';

export default class Word extends Model<
  InferAttributes<Word>,
  InferCreationAttributes<Word>
> {
  declare id: CreationOptional<number>;
  declare cardId: ForeignKey<Card['id']>;
  declare word: string;
  declare jlptLevel: number;
  declare furigana: boolean;
  declare reading: string;
  declare readingRomaji: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Word.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cardId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'card',
      key: 'id'
    }
  },
  word: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  furigana: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  reading: {
    type: DataTypes.STRING
  },
  readingRomaji: {
    type: DataTypes.STRING,
  },
  jlptLevel: {
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
  modelName: 'vocabulary'
});
