import {
  CreationOptional, DataTypes, Model, InferAttributes, InferCreationAttributes, ForeignKey
} from 'sequelize';

import { sequelize } from '..';
import Card from './card';

export default class KanjiSentence extends Model<
  InferAttributes<KanjiSentence>,
  InferCreationAttributes<KanjiSentence>
> {
  declare id: CreationOptional<number>;
  declare cardId: ForeignKey<Card['id']>;
  declare sentenceWithKanji: string;
  declare sentenceWithHiragana: string;
  declare jlptLevel: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

KanjiSentence.init({
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
  sentenceWithKanji: { //　ふねで　にもつを　送ります。
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  sentenceWithHiragana: { // ふねで　にもつを　おくります。
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
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
  modelName: 'kanji_sentence'
});
