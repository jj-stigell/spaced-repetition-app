const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../util/database');

class KanjiTranslation extends Model {}

KanjiTranslation.init({
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
  keyword: {
    type: DataTypes.STRING,
  },
  story: {
    type: DataTypes.STRING,
  },
  hint: {
    type: DataTypes.STRING,
  },
  otherMeanings: {
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
  modelName: 'kanji_translation'
});

module.exports = KanjiTranslation;
