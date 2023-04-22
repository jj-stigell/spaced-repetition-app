import { DataTypes, QueryInterface, Transaction } from 'sequelize';
import { bugs, card } from '../../configs/constants';
import logger from '../../configs/winston';

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
          type: DataTypes.ENUM('USER', 'READ_RIGHT', 'WRITE_RIGHT', 'SUPERUSER'),
          defaultValue: 'USER',
          allowNull: false
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
        updated_at: DataTypes.DATE
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
          type: DataTypes.ENUM('CONFIRM_EMAIL', 'RESET_PASSWORD'),
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
          type: DataTypes.ENUM(...card.CARD_TYPES),
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
          type: DataTypes.ENUM(...bugs.BUG_TYPES),
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
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      logger.error(err);
    }
  },
  down: async (queryInterface: QueryInterface): Promise<void> => {
    const transaction: Transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('bug_report', { transaction });
      await queryInterface.dropTable('card', { transaction });
      await queryInterface.dropTable('account_action', { transaction });
      await queryInterface.dropTable('session', { transaction });
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

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      logger.error(err);
    }
  }
};