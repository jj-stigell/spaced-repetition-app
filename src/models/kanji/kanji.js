const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../util/database');

class Kanji extends Model {}

Kanji.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
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

module.exports = Kanji;
