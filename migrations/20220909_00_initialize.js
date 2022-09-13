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
    }),
    await queryInterface.createTable('country', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      language_id: {
        type: DataTypes.CHAR(2),
        unique: true,
        allowNull: false
      },
      country_en: {
        type: DataTypes.STRING,
        allowNull: false
      },
      country_native: {
        type: DataTypes.STRING,
        allowNull: false
      },
      language_en: {
        type: DataTypes.STRING,
        allowNull: false
      },
      language_native: {
        type: DataTypes.STRING,
        allowNull: false
      },
    }),
    await queryInterface.createTable('kanji', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      kanji: {
        type: DataTypes.CHAR(1),
        unique: true,
        allowNull: false
      },
      learning_order: {
        type: DataTypes.INTEGER,
        unique: true
      },
      jlpt_level: {
        type: DataTypes.INTEGER,
      },
      onyomi: {
        type: DataTypes.STRING,
      },
      onyomi_romaji: {
        type: DataTypes.STRING,
      },
      kunyomi: {
        type: DataTypes.STRING,
      },
      kunyomi_romaji: {
        type: DataTypes.STRING,
      },
      stroke_count: {
        type: DataTypes.INTEGER,
      },
    }),
    await queryInterface.createTable('radical', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      radical: {
        type: DataTypes.CHAR(1),
        unique: true,
        allowNull: false
      },
      reading: {
        type: DataTypes.STRING,
        allowNull: false
      },
      reading_romaji: {
        type: DataTypes.STRING,
        allowNull: false
      },
      stroke_count: {
        type: DataTypes.INTEGER,
      },
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('account');
    await queryInterface.dropTable('country');
    await queryInterface.dropTable('kanji');
    await queryInterface.dropTable('radical');
  },
};
