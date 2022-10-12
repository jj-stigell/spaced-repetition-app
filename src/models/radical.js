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
  modelName: 'radical'
});

module.exports = Radical;
