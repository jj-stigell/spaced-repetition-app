const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../database');
const constants = require('../../util/constants');

class AccountDeckSettings extends Model {}

AccountDeckSettings.init({
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
  deckId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'deck',
      key: 'id'
    }
  },
  favorite: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  reviewInterval: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: constants.defaultMaxInterval,
    validate: {
      max: constants.maxReviewInterval,
      min: constants.minReviewInterval
    }
  },
  reviewsPerDay: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: constants.defaultMaxReviewPerDay,
    validate: {
      max: constants.maxLimitReviews,
      min: constants.minLimitReviews
    }
  },
  newCardsPerDay: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: constants.defaultMaxNewPerDay,
    validate: {
      max: constants.maxNewReviews,
      min: constants.minNewReviews
    }
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
  modelName: 'account_deck_settings'
});

module.exports = AccountDeckSettings;
