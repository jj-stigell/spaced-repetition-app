import { DataTypes, QueryInterface, Transaction } from 'sequelize';
import { bugs } from '../../configs/constants';
import logger from '../../configs/winston';
import {
  ActionType, BugType, CardType, DeckCategory, JlptLevel, ReviewType, Role
} from '../../type';

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    const transaction: Transaction = await queryInterface.sequelize.transaction();
    try {
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
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE
      }, { transaction });
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
          allowNull: false
        },
        selected_jlpt_level: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: JlptLevel.N5,
          validate: {
            isIn: [[
              JlptLevel.N1,
              JlptLevel.N2,
              JlptLevel.N3,
              JlptLevel.N4,
              JlptLevel.N5
            ]],
          }
        },
        email_verified: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        allow_news_letter: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        tos_accepted: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        password: {
          type: DataTypes.CHAR(255),
          allowNull: false
        },
        member: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        role: {
          defaultValue: Role.NON_MEMBER,
          allowNull: false,
          type: DataTypes.ENUM(
            Role.NON_MEMBER,
            Role.MEMBER,
            Role.READ_RIGHT,
            Role.WRITE_RIGHT,
            Role.SUPERUSER
          )
        },
        language_id: {
          type: DataTypes.CHAR(2),
          allowNull: false,
          defaultValue: 'EN',
          references: {
            model: 'language',
            key: 'id'
          }
        },
        last_login: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
        },
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
        delete_account: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: null
        },
      }, { transaction });
      await queryInterface.createTable('deck', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        jlpt_level: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: JlptLevel.N5,
          validate: {
            isIn: [[
              JlptLevel.N1,
              JlptLevel.N2,
              JlptLevel.N3,
              JlptLevel.N4,
              JlptLevel.N5
            ]],
          }
        },
        deck_name: {
          type: DataTypes.STRING(60),
          allowNull: false,
          unique: true,
        },
        category: {
          type: DataTypes.ENUM(
            DeckCategory.GRAMMAR,
            DeckCategory.KANA,
            DeckCategory.KANJI,
            DeckCategory.VOCABULARY
          ),
          allowNull: false
        },
        member_only: {
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
          }
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
          allowNull: false
        }
      }, { transaction });
      await queryInterface.createTable('deck_translation', {
        deck_id: {
          primaryKey: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'deck',
            key: 'id'
          }
        },
        language_id: {
          primaryKey: true,
          type: DataTypes.CHAR(2),
          allowNull: false,
          references: {
            model: 'language',
            key: 'id'
          }
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
          allowNull: false
        }
      }, { transaction });
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
        active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true
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
        }
      }, { transaction });
      await queryInterface.createTable('account_action', {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false
        },
        account_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'account',
            key: 'id'
          }
        },
        type: {
          type: DataTypes.ENUM(
            ActionType.CONFIRM_EMAIL,
            ActionType.RESET_PASSWORD
          ),
          allowNull: false
        },
        expire_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
        },
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE
      }, { transaction });


      await queryInterface.createTable('card', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        type: {
          type: DataTypes.ENUM(
            CardType.KANJI,
            CardType.KANA,
            CardType.VOCABULARY,
            CardType.SENTENCE,
            CardType.GRAMMAR,
            CardType.RECALL_KANJI_SENTENCE,
            CardType.RECOGNIZE_KANJI_SENTENCE
          ),
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
      }, { transaction });
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
          type: DataTypes.ENUM(
            BugType.TRANSLATION,
            BugType.UI,
            BugType.FUNCTIONALITY,
            BugType.OTHER
          ),
          allowNull: false
        },
        bug_message: {
          type: DataTypes.STRING,
          validate: {
            len: [
              bugs.BUG_MESSAGE_MIN_LENGTH,
              bugs.BUG_MESSAGE_MAX_LENGTH
            ]
          }
        },
        solved_message: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue: null,
          validate: {
            len: [
              bugs.SOLVED_MESSAGE_MIN_LENGTH,
              bugs.SOLVED_MESSAGE_MAX_LENGTH
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
        }
      }, { transaction });
      await queryInterface.createTable('card_list', {
        deck_id: {
          primaryKey: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'deck',
            key: 'id'
          }
        },
        card_id: {
          primaryKey: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'card',
            key: 'id'
          },
        },
        active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        learning_order: {
          type: DataTypes.INTEGER
        },
        review_type: {
          type: DataTypes.ENUM(ReviewType.RECALL, ReviewType.RECOGNISE),
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
      }, { transaction });
      await queryInterface.createTable('answer_option', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        card_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'card',
            key: 'id'
          }
        },
        language_id: {
          type: DataTypes.CHAR(2),
          allowNull: false,
          references: {
            model: 'language',
            key: 'id'
          }
        },
        keyword: {
          type: DataTypes.STRING,
          allowNull: false
        },
        options: {
          type: DataTypes.JSONB,
          allowNull: false,
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
      }, { transaction });
      await queryInterface.createTable('kanji', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        card_id: {
          type: DataTypes.INTEGER,
          references: {
            model: 'card',
            key: 'id'
          }
        },
        kanji: {
          type: DataTypes.CHAR(1),
          unique: true,
          allowNull: false
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
          allowNull: false,
          defaultValue: DataTypes.NOW
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
        }
      }, { transaction });
      await queryInterface.createTable('vocabulary', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        card_id: {
          type: DataTypes.INTEGER,
          references: {
            model: 'card',
            key: 'id'
          }
        },
        word: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
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
        },
        jlpt_level: {
          type: DataTypes.INTEGER,
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
      }, { transaction });
      await queryInterface.createTable('kana', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        card_id: {
          type: DataTypes.INTEGER,
          references: {
            model: 'card',
            key: 'id'
          }
        },
        kana: {
          type: DataTypes.CHAR(1),
          unique: true,
          allowNull: false
        },
        romaji: {
          type: DataTypes.STRING,
        },
        stroke_count: {
          type: DataTypes.INTEGER,
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
      }, { transaction });


      await queryInterface.createTable('kanji_sentence', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        card_id: {
          type: DataTypes.INTEGER,
          references: {
            model: 'card',
            key: 'id'
          }
        },
        kana: {
          type: DataTypes.CHAR(1),
          unique: true,
          allowNull: false
        },
        romaji: {
          type: DataTypes.STRING,
        },
        stroke_count: {
          type: DataTypes.INTEGER,
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
      }, { transaction });


      /*
      KanjiSentence.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        cardId: {
          type: DataTypes.INTEGER,
          references: {
            model: 'card',
            key: 'id'
          }
        },
        sentenceWithKanji: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false
        },
        sentenceWithHiragana: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false
        },
        jlptLevel: {
          type: DataTypes.INTEGER,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
        },
      }, {
        sequelize,
        modelName: 'kanji_sentence'
      });
      */










      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      logger.error(err);
    }









  },
  down: async (queryInterface: QueryInterface): Promise<void> => {
    const transaction: Transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('kanji_sentence', { transaction });
      await queryInterface.dropTable('answer_option', { transaction });
      await queryInterface.dropTable('kanji', { transaction });
      await queryInterface.dropTable('vocabulary', { transaction });
      await queryInterface.dropTable('kana', { transaction });
      await queryInterface.dropTable('card_list', { transaction });
      await queryInterface.dropTable('bug_report', { transaction });
      await queryInterface.dropTable('card', { transaction });
      await queryInterface.dropTable('account_action', { transaction });
      await queryInterface.dropTable('session', { transaction });
      await queryInterface.dropTable('deck_translation', { transaction });
      await queryInterface.dropTable('deck', { transaction });
      await queryInterface.dropTable('account', { transaction });
      await queryInterface.dropTable('language', { transaction });
      await queryInterface.dropTable('migrations', { transaction });
      await queryInterface.dropTable('seeds', { transaction });

      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS enum_account_action_type;', { transaction }
      );

      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS enum_account_role;', { transaction }
      );

      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS enum_card_type;', { transaction }
      );

      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS enum_bug_report_type;', { transaction }
      );

      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS enum_deck_category;', { transaction }
      );

      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS enum_card_list_review_type;', { transaction }
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      logger.error(err);
    }
  }
};
