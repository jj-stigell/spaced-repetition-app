const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../util/database');
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
    allowNull: false,
    references: {
      model: 'account',
      key: 'id'
    }
  },
  cardId: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
  reviewResult: {
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
  modelName: 'account_kanji_review'
});

module.exports = AccountKanjiReview;
