const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/database');

class Radical extends Model {}

Radical.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  radical: {
    type: DataTypes.CHAR(1),
    unique: true,
    allowNull: false
  },
  reading: {
    type: DataTypes.STRING,
    allowNull: false
  },
  readingRomaji: {
    type: DataTypes.STRING,
  },
  strokeCount: {
    type: DataTypes.INTEGER,
  }
}, {
  sequelize,
  modelName: 'radical'
});

module.exports = Radical;
