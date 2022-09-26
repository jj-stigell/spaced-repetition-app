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
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'kanji',
      key: 'id'
    }
  },
}, {
  sequelize,
  modelName: 'kanji_radical'
});

module.exports = KanjiRadical;
