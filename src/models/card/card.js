const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../util/database');

class Card extends Model {}

Card.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.ENUM('kanji', 'hiragana', 'katakana', 'word', 'sentence'),
    allowNull: false
  },
  languageId: {
    type: DataTypes.CHAR(2),
    allowNull: false,
    references: {
      model: 'country',
      key: 'language_id'
    }
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
}, {
  sequelize,
  modelName: 'card'
});

module.exports = Card;
