const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../util/database');
const constants = require('../../util/constants');

class Deck extends Model {}

Deck.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(60),
    allowNull: false,
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
      model: 'country',
      key: 'language_id'
    }
  },
  type: {
    type: DataTypes.ENUM(constants.deckTypes),
    allowNull: false
  },
  review_result: {
    type: DataTypes.ENUM(constants.availableResults),
    allowNull: false
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
}, {
  sequelize,
  modelName: 'deck'
});

module.exports = Deck;
