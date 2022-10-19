const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../util/database');

class JapaneseWord extends Model {}

JapaneseWord.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cardId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'card',
      key: 'id'
    }
  },
  word: {
    type: DataTypes.STRING,
    allowNull: false
  },
  reading: {
    type: DataTypes.STRING,
    allowNull: false
  },
  readingRomaji: {
    type: DataTypes.STRING,
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
  modelName: 'japanese_word'
});

module.exports = JapaneseWord;
