const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../database');
const constants = require('../../util/constants');

class AccountReview extends Model {}

AccountReview.init({
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
    type: DataTypes.INTEGER,
  },
  type: {
    type: DataTypes.ENUM(constants.review.reviewTypes),
    allowNull: false
  },
  result: {
    type: DataTypes.ENUM(constants.review.resultTypes),
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

module.exports = AccountReview;
