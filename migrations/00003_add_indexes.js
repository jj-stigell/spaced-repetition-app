module.exports = {
  up: async ({ context: queryInterface }) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addIndex('deck', ['id', 'language_id'], {
        unique: true,
        transaction
      });
      await queryInterface.addIndex('deck_translation', ['deck_id', 'language_id'], {
        unique: true,
        transaction
      });
      await queryInterface.addIndex('card', ['id', 'language_id'], {
        unique: true,
        transaction
      });
      await queryInterface.addIndex('card_list', ['deck_id', 'card_id', 'review_type'], {
        unique: true,
        transaction
      });
      await queryInterface.addIndex('account_deck_settings', ['account_id', 'deck_id'], {
        unique: true,
        transaction
      });
      await queryInterface.addIndex('kanji', ['card_id', 'kanji'], {
        unique: true,
        transaction
      });
      await queryInterface.addIndex('radical_translation', ['radical_id', 'language_id'], {
        unique: true,
        transaction
      });
      await queryInterface.addIndex('kanji_radical', ['radical_id', 'kanji_id'], {
        unique: true,
        transaction
      });
      await queryInterface.addIndex('kanji_translation', ['kanji_id', 'language_id'], {
        unique: true,
        transaction
      });
      await queryInterface.addIndex('word_translation', ['word_id', 'language_id'], {
        unique: true,
        transaction
      });
      await queryInterface.addIndex('account_review', ['id', 'account_id', 'card_id'], {
        unique: true,
        transaction
      });
      await queryInterface.addIndex('account_card', ['account_id', 'card_id', 'review_type'], {
        unique: true,
        transaction
      });
      await queryInterface.addIndex('session', ['id', 'account_id'], {
        unique: true,
        transaction
      });
      await queryInterface.addIndex('account_card_custom_data', ['account_id', 'card_id'], {
        unique: true,
        transaction
      });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.log(error);
    }    
  },
  down: async ({ context: queryInterface }) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.sequelize.query('DROP INDEX IF EXISTS deck_id_language_id', { transaction });
      await queryInterface.sequelize.query('DROP INDEX IF EXISTS deck_translation_deck_id_language_id', { transaction });
      await queryInterface.sequelize.query('DROP INDEX IF EXISTS card_id_language_id', { transaction });
      await queryInterface.sequelize.query('DROP INDEX IF EXISTS card_list_deck_id_card_id_review_type', { transaction });
      await queryInterface.sequelize.query('DROP INDEX IF EXISTS account_deck_settings_account_id_deck_id', { transaction });
      await queryInterface.sequelize.query('DROP INDEX IF EXISTS kanji_card_id_kanji', { transaction });
      await queryInterface.sequelize.query('DROP INDEX IF EXISTS radical_translation_radical_id_language_id', { transaction });
      await queryInterface.sequelize.query('DROP INDEX IF EXISTS kanji_radical_radical_id_kanji_id', { transaction });
      await queryInterface.sequelize.query('DROP INDEX IF EXISTS kanji_translation_kanji_id_language_id', { transaction });
      await queryInterface.sequelize.query('DROP INDEX IF EXISTS word_translation_word_id_language_id', { transaction });
      await queryInterface.sequelize.query('DROP INDEX IF EXISTS account_review_id_account_id_card_id', { transaction });
      await queryInterface.sequelize.query('DROP INDEX IF EXISTS account_card_account_id_card_id', { transaction });
      await queryInterface.sequelize.query('DROP INDEX IF EXISTS session_id_account_id', { transaction });
      await queryInterface.sequelize.query('DROP INDEX IF EXISTS account_card_custom_data_account_id_card_id', { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.log(error);
    }
  },
};
