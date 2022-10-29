const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../database');
const constants = require('../../util/constants');

class Card extends Model {}

Card.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.ENUM(constants.cardTypes),
    allowNull: false
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
  modelName: 'card'
});

module.exports = Card;
