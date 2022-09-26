const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/database');

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
  kanjiId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'kanji',
      key: 'id'
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
  extraReview: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  reviewResult: {
    type: DataTypes.ENUM('again', 'hard', 'easy'),
    allowNull: false
  },
}, {
  sequelize,
  modelName: 'account_kanji_review'
});

module.exports = AccountKanjiReview;
