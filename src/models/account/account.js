const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../database');

class Account extends Model {}

Account.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    }
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  passwordHash: {
    type: DataTypes.CHAR(60),
    allowNull: false
  },
  member: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  languageId: {
    type: DataTypes.CHAR(2),
    allowNull: false,
    defaultValue: 'en',
    references: {
      model: 'language',
      key: 'id'
    }
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
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
  modelName: 'account'
});

module.exports = Account;
