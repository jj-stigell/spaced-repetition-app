import { QueryInterface, Transaction } from 'sequelize';
import logger from '../../configs/winston';

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    const transaction: Transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addIndex('answer_option', [ 'card_id', 'language_id' ], {
        unique: true,
        transaction
      });
    } catch (err) {
      await transaction.rollback();
      logger.error(err);
    }
  },
  down: async (queryInterface: QueryInterface): Promise<void> => {
    const transaction: Transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.sequelize.query(
        'DROP INDEX IF EXISTS answer_option_card_id_language_id',
        { transaction }
      );
    } catch (err) {
      await transaction.rollback();
      logger.error(err);
    }
  }
};
