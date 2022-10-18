const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../util/database');

class Account extends Model {}

Account.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    }
  },
  passwordHash: {
    type: DataTypes.CHAR(60),
    allowNull: false
  },
  username: {
    type: DataTypes.STRING(14),
    unique: true,
    allowNull: false,
    validate: {
      len: [1, 14],
    }
  },
  member: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  admin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'account'
});

module.exports = Account;


/*
Table account {
  id int [pk, increment]
  email varchar [unique]
  email_verified boolean [default: false]
  member boolean [default: true]
  password_hash char(60)
  language varchar [ref: > country.country_code]
  timezone varchar
  last_login timestamp [default: `now()`]
  created_at timestamp [default: `now()`]
  updated_at timestamp [default: `now()`]
}
*/