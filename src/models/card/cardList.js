const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../util/database');

class CardList extends Model {}

CardList.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  deckId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'deck',
      key: 'id'
    }
  },
  cardId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'card',
      key: 'id'
    },
  },
  learningOrder: {
    type: DataTypes.INTEGER
  }
}, {
  sequelize,
  modelName: 'card_list'
});

module.exports = CardList;
