const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/database');

class TranslationKanji extends Model {}

TranslationKanji.init({
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
}, {
  sequelize,
  modelName: 'translation_kanji'
});

module.exports = TranslationKanji;
