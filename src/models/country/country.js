const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../util/database');

class Country extends Model {}

Country.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  countryCode: {
    type: DataTypes.CHAR(2),
    unique: true,
    allowNull: false
  },
  countryEnglish: {
    type: DataTypes.STRING,
    allowNull: false
  },
  countryNative: {
    type: DataTypes.STRING,
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
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'country'
});

module.exports = Country;
