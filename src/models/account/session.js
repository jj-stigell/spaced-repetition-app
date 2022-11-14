const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../database');

class Session extends Model {}

Session.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  accountId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'account',
      key: 'id'
    }
  },
  browser: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  os: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  device: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  expireAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
}, {
  sequelize,
  updatedAt: false,
  modelName: 'session'
});

module.exports = Session;
