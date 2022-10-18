const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../util/database');

class Country extends Model {}

Country.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  languageId: {
    type: DataTypes.CHAR(2),
    unique: true,
    allowNull: false
  },
  countryEn: {
    type: DataTypes.STRING,
    allowNull: false
  },
  countryNative: {
    type: DataTypes.STRING,
    allowNull: false
  },
  languageEn: {
    type: DataTypes.STRING,
    allowNull: false
  },
  languageNative: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'country'
});

module.exports = Country;
