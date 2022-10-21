const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../util/database');

class JapaneseWordTranslation extends Model {}

JapaneseWordTranslation.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  wordId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'japanese_word',
      key: 'id'
    }
  },
  languageId: {
    type: DataTypes.CHAR(2),
    allowNull: false,
    references: {
      model: 'language',
      key: 'id'
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
  modelName: 'japanese_word_translation'
});

module.exports = JapaneseWordTranslation;
