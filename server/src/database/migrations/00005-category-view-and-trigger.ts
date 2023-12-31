import { QueryInterface, Transaction } from 'sequelize';
import logger from '../../configs/winston';

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    const transaction: Transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.sequelize.query(
        `CREATE MATERIALIZED VIEW study_category AS
        SELECT
          jlpt_level,
          category,
          COUNT(jlpt_level) AS decks
        FROM
          deck
        WHERE
          active = true
        GROUP BY
          jlpt_level,
          category;`, { transaction }
      );

      await queryInterface.addIndex('study_category', ['jlpt_level', 'category'], {
        unique: true,
        transaction
      });

      // Function for updating materialized view.
      // https://www.postgresql.org/docs/current/sql-refreshmaterializedview.html
      await queryInterface.sequelize.query(
        `CREATE OR REPLACE FUNCTION refresh_study_category() RETURNS TRIGGER
        AS $refresh_study_category$
          BEGIN
            REFRESH MATERIALIZED VIEW CONCURRENTLY study_category;
            RETURN NULL;
          END;
        $refresh_study_category$ LANGUAGE PLPGSQL;`, { transaction }
      );

      // Trigger for table deck, update view "category" on update, insert and delete.
      // https://www.postgresql.org/docs/current/sql-createtrigger.html
      await queryInterface.sequelize.query(
        `CREATE TRIGGER refresh_study_category_trigger
          AFTER INSERT OR DELETE OR UPDATE ON deck
          FOR EACH STATEMENT
          EXECUTE FUNCTION refresh_study_category();`, { transaction }
      );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      logger.error(err);
    }
  },
  down: async (queryInterface: QueryInterface): Promise<void> => {
    const transaction: Transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.sequelize.query(
        'DROP TRIGGER IF EXISTS refresh_study_category_trigger ON deck',
        { transaction }
      );

      await queryInterface.sequelize.query(
        'DROP FUNCTION IF EXISTS refresh_study_category',
        { transaction }
      );

      await queryInterface.sequelize.query(
        'DROP INDEX IF EXISTS study_category_jlpt_level_category',
        { transaction }
      );

      await queryInterface.sequelize.query(
        'DROP MATERIALIZED VIEW IF EXISTS study_category;', { transaction }
      );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      logger.error(err);
    }
  }
};
