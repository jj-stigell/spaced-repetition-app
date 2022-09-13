const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/database');

class KanjiRadical extends Model {}

KanjiRadical.init({
  radicalId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'radical',
      key: 'id'
    }
  },
  kanjiId: {
    type: DataTypes.CHAR(2),
    allowNull: false,
    references: {
      model: 'kanji',
      key: 'id'
    }
  },
}, {
  sequelize,
  modelName: 'kanjiRadical'
});

module.exports = KanjiRadical;
