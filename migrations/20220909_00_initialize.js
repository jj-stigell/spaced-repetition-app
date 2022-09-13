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
      },
      stroke_count: {
        type: DataTypes.INTEGER,
      },
    }),
    await queryInterface.createTable('radical_translation', {
      radical_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'radical',
          key: 'id'
        }
      },
      language_id: {
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
    }),
    await queryInterface.createTable('kanji_radical', {
      radical_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'radical',
          key: 'id'
        }
      },
      kanji_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'kanji',
          key: 'id'
        }
      },
    }),
    await queryInterface.createTable('translation_kanji', {
      kanji_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'kanji',
          key: 'id'
        }
      },
      language_id: {
        type: DataTypes.CHAR(2),
        allowNull: false,
        references: {
          model: 'country',
          key: 'language_id'
        }
      },
      keyword: {
        type: DataTypes.STRING,
      },
      story: {
        type: DataTypes.STRING,
      },
      hint: {
        type: DataTypes.STRING,
      },
      other_meanings: {
        type: DataTypes.STRING,
      },
    }),
    await queryInterface.createTable('example_word', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      word: {
        type: DataTypes.STRING,
        allowNull: false
      },
      furigana: {
        type: DataTypes.STRING,
        allowNull: false
      },
      romaji: {
        type: DataTypes.STRING,
        allowNull: false
      },
      jlpt_level: {
        type: DataTypes.INTEGER,
      },
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('radical_translation');
    await queryInterface.dropTable('kanji_radical');
    await queryInterface.dropTable('translation_kanji');
    await queryInterface.dropTable('account');
    await queryInterface.dropTable('country');
    await queryInterface.dropTable('kanji');
    await queryInterface.dropTable('radical');
    await queryInterface.dropTable('example_word');
  },
};
