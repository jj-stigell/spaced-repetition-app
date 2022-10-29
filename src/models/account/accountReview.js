const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../database');
const constants = require('../../util/constants');

class AccountKanjiReview extends Model {}

AccountKanjiReview.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  accountId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'account',
      key: 'id'
    }
  },
  cardId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'card',
      key: 'id'
    }
  },
  extraReview: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  timing: {
    type: DataTypes.REAL,
  },
  result: {
    type: DataTypes.ENUM(constants.resultTypes),
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  updatedAt: false,
  modelName: 'account_review'
});

module.exports = AccountKanjiReview;
