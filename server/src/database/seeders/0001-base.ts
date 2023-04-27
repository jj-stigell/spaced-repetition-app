import fs from 'fs';
import path from 'path';
import { QueryInterface, Transaction } from 'sequelize';
import logger from '../../configs/winston';

const language: string = fs.readFileSync(
  path.resolve(__dirname, '../../../../mockData/language.sql'), 'utf8'
);

const account: string = fs.readFileSync(
  path.resolve(__dirname, '../../../../mockData/account.sql'), 'utf8'
);

const bugReport: string = fs.readFileSync(
  path.resolve(__dirname, '../../../../mockData/bug_report.sql'), 'utf8'
);

const card: string = fs.readFileSync(
  path.resolve(__dirname, '../../../../mockData/card.sql'), 'utf8'
);

const deck: string = fs.readFileSync(
  path.resolve(__dirname, '../../../../mockData/deck.sql'), 'utf8'
);

const deckTranslation: string = fs.readFileSync(
  path.resolve(__dirname, '../../../../mockData/deck_translation.sql'), 'utf8'
);

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    const transaction: Transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.sequelize.query(language, { transaction });
      await queryInterface.sequelize.query(account, { transaction });
      await queryInterface.sequelize.query(card, { transaction });
      await queryInterface.sequelize.query(bugReport, { transaction });
      await queryInterface.sequelize.query(deck, { transaction });
      await queryInterface.sequelize.query(deckTranslation, { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      logger.error(err);
    }
  },
  down: async (queryInterface: QueryInterface): Promise<void> => {
    const transaction: Transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete('deck_translation', {}, { transaction });
      await queryInterface.bulkDelete('deck', {}, { transaction });
      await queryInterface.bulkDelete('bug_report', {}, { transaction });
      await queryInterface.bulkDelete('card', {}, { transaction });
      await queryInterface.bulkDelete('account', {}, { transaction });
      await queryInterface.bulkDelete('language', {}, { transaction });

      await queryInterface.sequelize.query(
        'ALTER SEQUENCE language_id_seq RESTART;', { transaction }
      );

      await queryInterface.sequelize.query(
        'ALTER SEQUENCE account_id_seq RESTART;', { transaction }
      );

      await queryInterface.sequelize.query(
        'ALTER SEQUENCE bug_report_id_seq RESTART;', { transaction }
      );

      await queryInterface.sequelize.query(
        'ALTER SEQUENCE card_id_seq RESTART;', { transaction }
      );

      await queryInterface.sequelize.query(
        'ALTER SEQUENCE deck_id_seq RESTART;', { transaction }
      );

      await queryInterface.sequelize.query(
        'ALTER SEQUENCE deck_translation_id_seq RESTART;', { transaction }
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      logger.error(err);
    }
  },
};
