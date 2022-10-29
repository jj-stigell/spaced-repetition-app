const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../database');

class Language extends Model {}

Language.init({
  id: {
    type: DataTypes.CHAR(2),
    primaryKey: true,
    allowNull: false
  },
  languageEnglish: {
    type: DataTypes.STRING,
    allowNull: false
  },
  languageNative: {
    type: DataTypes.STRING,
    allowNull: false
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
  }
}, {
  sequelize,
  modelName: 'language'
});

module.exports = Language;
