const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/database');

class RadicalTranslation extends Model {}

RadicalTranslation.init({
  radicalId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'radical',
      key: 'id'
    }
  },
  languageId: {
    type: DataTypes.CHAR(2),
    allowNull: false,
    references: {
      model: 'country',
      key: 'language_id'
    }
  },
  translation: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
  },
}, {
  sequelize,
  modelName: 'radical_translation'
});

module.exports = RadicalTranslation;
