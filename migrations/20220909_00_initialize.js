const { DataTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');
const constants = require('../src/util/constants');
const country = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/country.sql'), 'utf8');
const kanji = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/kanji.sql'), 'utf8');
const translation_kanji_en = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/translation_kanji_en.sql'), 'utf8');
const translation_kanji_fi = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/translation_kanji_fi.sql'), 'utf8');
const radical = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/radical.sql'), 'utf8');
const translation_radical_en = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/translation_radical_en.sql'), 'utf8');
const translation_radical_fi = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/translation_radical_fi.sql'), 'utf8');
const kanji_radical = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/kanji_radical.sql'), 'utf8');
const account = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/account.sql'), 'utf8');
const account_kanji_card = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/account_kanji_card.sql'), 'utf8');
const account_kanji_review = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/account_kanji_review.sql'), 'utf8');
const admin = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/admin.sql'), 'utf8');
const alter_tables = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/alter_tables.sql'), 'utf8');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('account', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        }
      },
      email_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      password_hash: {
        type: DataTypes.CHAR(60),
        allowNull: false
      },
      member: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      last_login: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      }
    }),
    await queryInterface.createTable('admin', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'account',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      is_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      }
    }),
    await queryInterface.addIndex('admin', ['account_id'], {
      unique: true,
    }),
    await queryInterface.createTable('country', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      language_id: {
        type: DataTypes.CHAR(2),
        unique: true,
        allowNull: false
      },
      country_english: {
        type: DataTypes.STRING,
        allowNull: false
      },
      country_native: {
        type: DataTypes.STRING,
        allowNull: false
      },
      language_english: {
        type: DataTypes.STRING,
        allowNull: false
      },
      language_native: {
        type: DataTypes.STRING,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
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
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
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
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
      },
    }),
    await queryInterface.createTable('translation_radical', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
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
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
      },
    }),
    await queryInterface.addIndex('translation_radical', ['radical_id', 'language_id'], {
      unique: true,
    }),
    await queryInterface.createTable('kanji_radical', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
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
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
      },
    }),
    await queryInterface.addIndex('kanji_radical', ['radical_id', 'kanji_id'], {
      unique: true,
    }),
    await queryInterface.createTable('translation_kanji', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
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
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
      },
    }),
    await queryInterface.addIndex('translation_kanji', ['kanji_id', 'language_id'], {
      unique: true,
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
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
      },
    }),
    await queryInterface.createTable('example_word_translation', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      word_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'example_word',
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
      },
      type: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
      },
    }),
    await queryInterface.addIndex('example_word_translation', ['word_id', 'language_id'], {
      unique: true,
    }),
    await queryInterface.createTable('account_kanji_review', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'account',
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
      extra_review: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      timing: {
        type: DataTypes.REAL,
      },
      review_result: {
        type: DataTypes.ENUM(constants.availableResults),
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
      },
    }),
    await queryInterface.createTable('account_kanji_card', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'account',
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
      review_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        default: 1
      },
      easy_factor: {
        type: DataTypes.REAL,
        allowNull: false,
        default: 2.5
      },
      due_date: {
        type: DataTypes.DATEONLY,
      },
      account_story: {
        type: DataTypes.STRING,
      },
      account_hint: {
        type: DataTypes.STRING,
      },
      mature: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
      },
    }),
    await queryInterface.addIndex('account_kanji_card', ['account_id', 'kanji_id'], {
      unique: true,
    }),
    await queryInterface.sequelize.query(country);
    await queryInterface.sequelize.query(kanji);
    await queryInterface.sequelize.query(translation_kanji_en);
    await queryInterface.sequelize.query(translation_kanji_fi);
    await queryInterface.sequelize.query(radical);
    await queryInterface.sequelize.query(translation_radical_en);
    await queryInterface.sequelize.query(translation_radical_fi);
    await queryInterface.sequelize.query(kanji_radical);
    await queryInterface.sequelize.query(account);
    await queryInterface.sequelize.query(account_kanji_card);
    await queryInterface.sequelize.query(account_kanji_review);
    await queryInterface.sequelize.query(admin);
    await queryInterface.sequelize.query(alter_tables);
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('translation_radical');
    await queryInterface.dropTable('kanji_radical');
    await queryInterface.dropTable('translation_kanji');
    await queryInterface.dropTable('example_word_translation');
    await queryInterface.dropTable('account_kanji_review');
    await queryInterface.dropTable('account_kanji_card');
    await queryInterface.dropTable('admin');
    await queryInterface.dropTable('account');
    await queryInterface.dropTable('country');
    await queryInterface.dropTable('kanji');
    await queryInterface.dropTable('radical');
    await queryInterface.dropTable('example_word');
  },
};
