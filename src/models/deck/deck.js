const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../database');
const constants = require('../../util/constants');

class Deck extends Model {}

Deck.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  deckName: {
    type: DataTypes.STRING(60),
    allowNull: false,
    unique: true,
  },
  type: {
    type: DataTypes.ENUM(constants.deckTypes),
    allowNull: false
  },
  subscriberOnly: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  languageId: {
    type: DataTypes.CHAR(2),
    allowNull: false,
    references: {
      model: 'language',
      key: 'id'
    }
  },
  active: {
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
  modelName: 'deck'
});

module.exports = Deck;
