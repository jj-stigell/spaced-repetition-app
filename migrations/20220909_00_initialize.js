const { DataTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');
const constants = require('../src/util/constants');
const { NODE_ENV } = require('../src/util/config');
const alter_tables = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/alter_tables.sql'), 'utf8');
const language = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/language.sql'), 'utf8');
const account = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/account.sql'), 'utf8');
const admin = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/admin.sql'), 'utf8');
const deck = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/deck.sql'), 'utf8');
const deck_translation = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/deck_translation.sql'), 'utf8');
const card = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/card.sql'), 'utf8');
const card_list = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/card_list.sql'), 'utf8');
const radical = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/radical.sql'), 'utf8');
const radical_translation_en = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/radical_translation_en.sql'), 'utf8');
const kanji = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/kanji.sql'), 'utf8');
const kanji_radical = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/kanji_radical.sql'), 'utf8');
const kanji_translation_fi = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/kanji_translation_fi.sql'), 'utf8');
const kanji_translation_en = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/kanji_translation_en.sql'), 'utf8');
const word = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/word.sql'), 'utf8');
const word_translation_en = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/word_translation_en.sql'), 'utf8');
const account_deck_settings = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/account_deck_settings.sql'), 'utf8');
const account_card = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/account_card.sql'), 'utf8');
const account_review = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/account_review.sql'), 'utf8');
const dummy_accounts = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/dummy_accounts.sql'), 'utf8');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('language', {
      id: {
        type: DataTypes.CHAR(2),
        primaryKey: true,
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
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    }),
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
          isEmail: true
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
      language_id: {
        type: DataTypes.CHAR(2),
        allowNull: false,
        defaultValue: 'en',
        references: {
          model: 'language',
          key: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
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
        defaultValue: DataTypes.NOW
      }
    }),
    await queryInterface.createTable('admin', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'account',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
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
        defaultValue: DataTypes.NOW
      }
    }),
    await queryInterface.createTable('deck', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      deck_name: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: true
      },
      type: {
        type: DataTypes.ENUM(constants.deckTypes),
        allowNull: false
      },
      subscriber_only: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      language_id: {
        type: DataTypes.CHAR(2),
        allowNull: false,
        references: {
          model: 'language',
          key: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      },
      active: {
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
      }
    }),

    await queryInterface.addIndex('deck', ['id', 'language_id'], {
      unique: true
    }),
    await queryInterface.createTable('deck_translation', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      deck_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'deck',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      language_id: {
        type: DataTypes.CHAR(2),
        allowNull: false,
        references: {
          model: 'language',
          key: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      },
      title: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: true
      },
      active: {
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
    }),
    await queryInterface.addIndex('deck_translation', ['deck_id', 'language_id'], {
      unique: true
    }),
    await queryInterface.createTable('card', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      type: {
        type: DataTypes.ENUM(constants.cardTypes),
        allowNull: false
      },
      language_id: {
        type: DataTypes.CHAR(2),
        allowNull: false,
        references: {
          model: 'language',
          key: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      },
      active: {
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
    }),
    await queryInterface.addIndex('card', ['id', 'language_id'], {
      unique: true
    }),
    await queryInterface.createTable('card_list', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      deck_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'deck',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      card_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'card',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      learning_order: {
        type: DataTypes.INTEGER
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
    }),
    await queryInterface.addIndex('card_list', ['deck_id', 'card_id'], {
      unique: true
    }),
    await queryInterface.createTable('account_deck_settings', {
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
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      deck_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'deck',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      favorite: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      review_interval: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: constants.defaultInterval,
        validate: {
          max: constants.maxReviewInterval,
          min: constants.minReviewInterval
        }
      },
      reviews_per_day: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: constants.defaultReviewPerDay,
        validate: {
          max: constants.maxLimitReviews,
          min: constants.minLimitReviews
        }
      },
      new_cards_per_day: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: constants.defaultNewPerDay,
        validate: {
          max: constants.maxNewReviews,
          min: constants.minNewReviews
        }
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
    }),
    await queryInterface.addIndex('account_deck_settings', ['account_id', 'deck_id'], {
      unique: true
    }),
    await queryInterface.createTable('kanji', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      card_id: {
        type: DataTypes.INTEGER,
        unique: true,
        references: {
          model: 'card',
          key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      kanji: {
        type: DataTypes.CHAR(1),
        unique: true,
        allowNull: false
      },
      jlpt_level: {
        type: DataTypes.INTEGER
      },
      onyomi: {
        type: DataTypes.STRING
      },
      onyomi_romaji: {
        type: DataTypes.STRING
      },
      kunyomi: {
        type: DataTypes.STRING
      },
      kunyomi_romaji: {
        type: DataTypes.STRING
      },
      stroke_count: {
        type: DataTypes.INTEGER
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
      },
    }),
    await queryInterface.createTable('radical', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
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
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
      },
    }),
    await queryInterface.createTable('radical_translation', {
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
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      language_id: {
        type: DataTypes.CHAR(2),
        allowNull: false,
        references: {
          model: 'language',
          key: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      },
      translation: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
      },
    }),
    await queryInterface.addIndex('radical_translation', ['radical_id', 'language_id'], {
      unique: true
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
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      kanji_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'kanji',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
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
    }),
    await queryInterface.addIndex('kanji_radical', ['radical_id', 'kanji_id'], {
      unique: true
    }),
    await queryInterface.createTable('kanji_translation', {
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
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      language_id: {
        type: DataTypes.CHAR(2),
        allowNull: false,
        references: {
          model: 'language',
          key: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      },
      keyword: {
        type: DataTypes.STRING
      },
      story: {
        type: DataTypes.STRING
      },
      hint: {
        type: DataTypes.STRING
      },
      other_meanings: {
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.STRING
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
    }),
    await queryInterface.addIndex('kanji_translation', ['kanji_id', 'language_id'], {
      unique: true
    }),
    await queryInterface.createTable('word', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      card_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'card',
          key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      word: {
        type: DataTypes.STRING,
        allowNull: false
      },
      furigana: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      reading: {
        type: DataTypes.STRING
      },
      reading_romaji: {
        type: DataTypes.STRING,
        allowNull: false
      },
      jlpt_level: {
        type: DataTypes.INTEGER
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
    }),
    await queryInterface.createTable('word_translation', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      word_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'word',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      language_id: {
        type: DataTypes.CHAR(2),
        allowNull: false,
        references: {
          model: 'language',
          key: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      },
      translation: {
        type: DataTypes.STRING
      },
      hint: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING
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
    }),
    await queryInterface.addIndex('word_translation', ['word_id', 'language_id'], {
      unique: true
    }),
    await queryInterface.createTable('account_review', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      account_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'account',
          key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      card_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'card',
          key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      extra_review: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      timing: {
        type: DataTypes.REAL
      },
      result: {
        type: DataTypes.ENUM(constants.resultTypes),
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    }),
    await queryInterface.addIndex('account_review', ['id', 'account_id', 'card_id'], {
      unique: true
    }),
    await queryInterface.createTable('account_card', {
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
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      card_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'card',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      account_story: {
        type: DataTypes.STRING,
        validate: {
          len: [
            constants.card.storyMinLength,
            constants.card.storyMaxLength
          ]
        }
      },
      account_hint: {
        type: DataTypes.STRING,
        validate: {
          len: [
            constants.card.hintMinLength,
            constants.card.hintMaxLength
          ]
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
        default: constants.card.defaultEasyFactor
      },
      mature: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      due_at: {
        type: DataTypes.DATEONLY,
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
        defaultValue: DataTypes.NOW
      },
    }),
    await queryInterface.addIndex('account_card', ['account_id', 'card_id'], {
      unique: true
    }),
    await queryInterface.createTable('bug_report', {
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
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      card_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'card',
          key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      type: {
        type: DataTypes.ENUM(constants.bugs.bugTypes),
        allowNull: false
      },
      bug_message: {
        type: DataTypes.STRING,
        validate: {
          len: [
            constants.bugs.bugMessageMinLength,
            constants.bugs.bugMessageMaxLength
          ]
        }
      },
      solved_message: {
        type: DataTypes.STRING,
        validate: {
          len: [
            constants.bugs.solvedMessageMinLength,
            constants.bugs.solcedMessageMaxLength
          ]
        }
      },
      solved: {
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
    }),
    await queryInterface.createTable('session', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'account',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      expire_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
    }),
    await queryInterface.sequelize.query(alter_tables);
    await queryInterface.sequelize.query(language);
    await queryInterface.sequelize.query(account);
    await queryInterface.sequelize.query(admin);
    await queryInterface.sequelize.query(deck);
    await queryInterface.sequelize.query(deck_translation);
    await queryInterface.sequelize.query(card);
    await queryInterface.sequelize.query(card_list);
    await queryInterface.sequelize.query(radical);
    await queryInterface.sequelize.query(radical_translation_en);
    await queryInterface.sequelize.query(kanji);
    await queryInterface.sequelize.query(kanji_radical);
    await queryInterface.sequelize.query(kanji_translation_fi);
    await queryInterface.sequelize.query(kanji_translation_en);
    await queryInterface.sequelize.query(word);
    await queryInterface.sequelize.query(word_translation_en);
    if (NODE_ENV !== 'production' && NODE_ENV !== 'test') {
      console.log('Not in production/test, loading dummy data');
      await queryInterface.sequelize.query(dummy_accounts);
      await queryInterface.sequelize.query(account_deck_settings);
      await queryInterface.sequelize.query(account_card);
      await queryInterface.sequelize.query(account_review);
    }
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('session');
    await queryInterface.dropTable('bug_report');
    await queryInterface.dropTable('radical_translation');
    await queryInterface.dropTable('kanji_radical');
    await queryInterface.dropTable('kanji_translation');
    await queryInterface.dropTable('word_translation');
    await queryInterface.dropTable('word');
    await queryInterface.dropTable('account_review');
    await queryInterface.dropTable('account_card');
    await queryInterface.dropTable('account_deck_settings');
    await queryInterface.dropTable('admin');
    await queryInterface.dropTable('account');
    await queryInterface.dropTable('kanji');
    await queryInterface.dropTable('radical');
    await queryInterface.dropTable('deck_translation');
    await queryInterface.dropTable('card_list');
    await queryInterface.dropTable('deck');
    await queryInterface.dropTable('card');
    await queryInterface.dropTable('language');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_card_type;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_deck_type;');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_account_review_result;');
  },
};
