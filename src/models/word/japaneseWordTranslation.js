const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../util/database');

class JapaneseWordTranslation extends Model {}

JapaneseWordTranslation.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  translationCardId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'card_translation',
      key: 'id'
    }
  },
  languageId: {
    type: DataTypes.CHAR(2),
    allowNull: false,
    references: {
      model: 'country',
      key: 'language_id'
    }
  },
  translation: {
    type: DataTypes.STRING,
  },
  hint: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
  },
}, {
  sequelize,
  modelName: 'japanese_word_translation'
});

module.exports = JapaneseWordTranslation;
