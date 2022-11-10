const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../database');
const { constants } = require('../../util/constants');

class AccountCard extends Model {}

AccountCard.init({
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
  accountStory: {
    type: DataTypes.STRING,
    validate: {
      len: [
        constants.card.storyMinLength,
        constants.card.storyMaxLength
      ]
    }
  },
  accountHint: {
    type: DataTypes.STRING,
    validate: {
      len: [
        constants.card.hintMinLength,
        constants.card.hintMaxLength
      ]
    }
  },
  reviewCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    default: 1
  },
  easyFactor: {
    type: DataTypes.REAL,
    allowNull: false,
    default: constants.card.defaultEasyFactor
  },
  mature: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  dueAt: {
    type: DataTypes.DATEONLY,
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
  modelName: 'account_card'
});

module.exports = AccountCard;
