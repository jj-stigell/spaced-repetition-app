const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../util/database');

class KanjiTranslation extends Model {}

KanjiTranslation.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  kanjiId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'kanji',
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
  keyword: {
    type: DataTypes.STRING
  },
  story: {
    type: DataTypes.STRING
  },
  hint: {
    type: DataTypes.STRING
  },
  otherMeanings: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.STRING
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
