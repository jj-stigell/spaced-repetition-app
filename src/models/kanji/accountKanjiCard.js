const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../util/database');

class AccountKanjiCard extends Model {}

AccountKanjiCard.init({
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
  kanjiId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'kanji',
      key: 'id'
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
    default: 2.5
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  },
  accountStory: {
    type: DataTypes.STRING,
  },
  accountHint: {
    type: DataTypes.STRING,
  },
  mature: {
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
  },
}, {
  sequelize,
  modelName: 'account_kanji_card'
});

module.exports = AccountKanjiCard;
