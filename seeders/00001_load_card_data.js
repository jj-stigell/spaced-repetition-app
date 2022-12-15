const fs = require('fs');
const path = require('path');
const language = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/language.sql'), 'utf8');
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
const word_translation_fi = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/word_translation_fi.sql'), 'utf8');

module.exports = {
  up: async ({ context: queryInterface }) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.sequelize.query(language, { transaction });
      await queryInterface.sequelize.query(deck, { transaction });
      await queryInterface.sequelize.query(deck_translation, { transaction });
      await queryInterface.sequelize.query(card, { transaction });
      await queryInterface.sequelize.query(card_list, { transaction });
      await queryInterface.sequelize.query(radical, { transaction });
      await queryInterface.sequelize.query(radical_translation_en, { transaction });
      await queryInterface.sequelize.query(kanji, { transaction });
      await queryInterface.sequelize.query(kanji_radical, { transaction });
      await queryInterface.sequelize.query(kanji_translation_fi, { transaction });
      await queryInterface.sequelize.query(kanji_translation_en, { transaction });
      await queryInterface.sequelize.query(word, { transaction });
      await queryInterface.sequelize.query(word_translation_en, { transaction });
      await queryInterface.sequelize.query(word_translation_fi, { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.log(error);
    }    
  },
  down: async ({ context: queryInterface }) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete('radical_translation', {}, { transaction });
      await queryInterface.bulkDelete('kanji_radical', {}, { transaction });
      await queryInterface.bulkDelete('kanji_translation', {}, { transaction });
      await queryInterface.bulkDelete('word_translation', {}, { transaction });
      await queryInterface.bulkDelete('word', {}, { transaction });
      await queryInterface.bulkDelete('kanji', {}, { transaction });
      await queryInterface.bulkDelete('radical', {}, { transaction });
      await queryInterface.bulkDelete('deck_translation', {}, { transaction });
      await queryInterface.bulkDelete('card_list', {}, { transaction });
      await queryInterface.bulkDelete('deck', {}, { transaction });
      await queryInterface.bulkDelete('card', {}, { transaction });
      await queryInterface.bulkDelete('language', {}, { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.log(error);
    }
  },
};
