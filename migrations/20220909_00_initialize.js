const { DataTypes } = require('sequelize');
const constants = require('../src/util/constants');

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
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          len: [
            constants.account.usernameMinLength,
            constants.account.usernameMaxLength
          ]
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
      read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      write: {
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
      },
      description: {
        type: DataTypes.STRING(60),
        allowNull: false,
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
            constants.bugs.solvedMessageMaxLength
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
      browser: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      os: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      device: {
        type: DataTypes.STRING,
        allowNull: false,
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
    });
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
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_bug_report_type;');
  },
};
