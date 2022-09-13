const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/database');

class AccountKanjiCard extends Model {}

AccountKanjiCard.init({
  account_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'account',
      key: 'id'
    }
  },
  kanji_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'kanji',
      key: 'id'
    }
  },
  review_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    default: 1
  },
  easy_factor: {
    type: DataTypes.REAL,
    allowNull: false,
    default: 2.5
  },
  due_date: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  },
  account_story: {
    type: DataTypes.STRING,
  },
  account_hint: {
    type: DataTypes.STRING,
  },
  mature: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
}, {
  sequelize,
  modelName: 'accountKanjiCard'
});

module.exports = AccountKanjiCard;
