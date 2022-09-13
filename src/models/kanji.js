const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/database');

class Kanji extends Model {}

Kanji.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  kanji: {
    type: DataTypes.CHAR(1),
    unique: true,
    allowNull: false
  },
  learningOrder: {
    type: DataTypes.INTEGER,
    unique: true
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
  }
}, {
  sequelize,
  modelName: 'kanji'
});

module.exports = Kanji;