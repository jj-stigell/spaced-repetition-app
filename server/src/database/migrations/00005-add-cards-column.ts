import { QueryInterface, Transaction } from 'sequelize';
import logger from '../../configs/winston';

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    const transaction: Transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.sequelize.query(
        `ALTER TABLE deck 
        ADD COLUMN cards 
        INTEGER DEFAULT 0;`, { transaction }
      );

      // Function for updating card count column in deck table.
      // https://www.postgresql.org/docs/current/sql-refreshmaterializedview.html
      await queryInterface.sequelize.query(
        `CREATE OR REPLACE FUNCTION update_deck_cards_count() RETURNS TRIGGER AS $$
          BEGIN
            IF TG_OP = 'INSERT' THEN
              UPDATE deck
              SET cards = (SELECT COUNT(*) FROM card_list WHERE deck_id = deck.id)
              WHERE id = NEW.deck_id;
            ELSIF TG_OP = 'DELETE' THEN
              UPDATE deck
              SET cards = (SELECT COUNT(*) FROM card_list WHERE deck_id = deck.id)
              WHERE id = OLD.deck_id;
            ELSIF TG_OP = 'UPDATE' THEN
              IF NEW.deck_id <> OLD.deck_id THEN
                UPDATE deck
                SET cards = (SELECT COUNT(*) FROM card_list WHERE deck_id = deck.id)
                WHERE id = NEW.deck_id;
          
                UPDATE deck
                SET cards = (SELECT COUNT(*) FROM card_list WHERE deck_id = deck.id)
                WHERE id = OLD.deck_id;
              END IF;
            END IF;
            RETURN NULL;
          END;
        $$ LANGUAGE plpgsql;`, { transaction }
      );

      // Trigger for table deck, update card count in deck after change in card_list.
      // https://www.postgresql.org/docs/current/sql-createtrigger.html
      await queryInterface.sequelize.query(
        `CREATE TRIGGER update_deck_cards_count_trigger
          AFTER INSERT OR DELETE OR UPDATE ON card_list
          FOR EACH ROW
          EXECUTE FUNCTION update_deck_cards_count();`, { transaction }
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
        'DROP TRIGGER IF EXISTS update_deck_cards_count_trigger ON card_list;',
        { transaction }
      );

      await queryInterface.sequelize.query(
        'DROP FUNCTION IF EXISTS update_deck_cards_count;',
        { transaction }
      );

      await queryInterface.sequelize.query(
        'ALTER TABLE deck DROP COLUMN cards;', { transaction }
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      logger.error(err);
    }
  }
};
