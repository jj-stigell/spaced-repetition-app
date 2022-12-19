const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../database');
const constants = require('../../util/constants');

class AccountCardCustomData extends Model {}

AccountCardCustomData.init({
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
  modelName: 'account_card_custom_data'
});

module.exports = AccountCardCustomData;
