const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/database');

class ExampleWordTranslation extends Model {}

ExampleWordTranslation.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  wordId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'example_word',
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
  type: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
  },
}, {
  sequelize,
  modelName: 'exampleWordTranslation'
});

module.exports = ExampleWordTranslation;
