const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('account', {
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
      password_hash: {
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
      email_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      last_login: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('account');
  },
};
