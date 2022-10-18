const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../util/database');

class Word extends Model {}

Word.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  word: {
    type: DataTypes.STRING,
    allowNull: false
  },
  furigana: {
    type: DataTypes.STRING,
    allowNull: false
  },
  romaji: {
    type: DataTypes.STRING,
    allowNull: false
  },
  jlptLevel: {
    type: DataTypes.INTEGER,
  },
}, {
  sequelize,
  modelName: 'example_word'
});

module.exports = Word;
