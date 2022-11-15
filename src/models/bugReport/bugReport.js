const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../database');
const constants = require('../../util/constants');

class BugReport extends Model {}

BugReport.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  accountId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'account',
      key: 'id'
    }
  },
  cardId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'card',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM(constants.bugs.bugTypes),
    allowNull: false
  },
  bugMessage: {
    type: DataTypes.STRING,
    validate: {
      len: [
        constants.bugs.bugMessageMinLength,
        constants.bugs.bugMessageMaxLength
      ]
    }
  },
  solvedMessage: {
    type: DataTypes.STRING,
    validate: {
      len: [
        constants.bugs.solvedMessageMinLength,
        constants.bugs.solvedMessageMaxLength
      ]
    }
  },
  solved: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
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
  modelName: 'bug_report'
});

module.exports = BugReport;
