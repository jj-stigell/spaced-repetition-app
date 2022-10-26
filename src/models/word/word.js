const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../util/database');

class Word extends Model {}

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
  modelName: 'word'
});

module.exports = Word;
