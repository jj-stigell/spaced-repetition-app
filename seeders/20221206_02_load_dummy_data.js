const fs = require('fs');
const path = require('path');
const { NODE_ENV } = require('../src/util/config');
const account = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/account.sql'), 'utf8');
const admin = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/admin.sql'), 'utf8');
const account_deck_settings = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/account_deck_settings.sql'), 'utf8');
const account_card = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/account_card.sql'), 'utf8');
const account_review = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/account_review.sql'), 'utf8');
const dummy_accounts = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/dummy_accounts.sql'), 'utf8');
const bug_Reports = fs.readFileSync(path.resolve(__dirname, '../setup/database/data/bug_reports.sql'), 'utf8');

module.exports = {
  up: async ({ context: queryInterface }) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.sequelize.query(account, { transaction });
      await queryInterface.sequelize.query(admin, { transaction });
      await queryInterface.sequelize.query(dummy_accounts, { transaction });
      await queryInterface.sequelize.query(bug_Reports, { transaction });
      if (NODE_ENV !== 'production' && NODE_ENV !== 'test' && NODE_ENV !== 'development') {
        console.log('Not in production/test, loading dummy review data');
        await queryInterface.sequelize.query(account_deck_settings, { transaction });
        await queryInterface.sequelize.query(account_card, { transaction });
        await queryInterface.sequelize.query(account_review, { transaction });
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.log(error);
    }    
  },
  down: async ({ context: queryInterface }) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete('bug_report', {}, { transaction });
      await queryInterface.bulkDelete('account_review', {}, { transaction });
      await queryInterface.bulkDelete('account_card', {}, { transaction });
      await queryInterface.bulkDelete('account_deck_settings', {}, { transaction });
      await queryInterface.bulkDelete('admin', {}, { transaction });
      await queryInterface.bulkDelete('account', {}, { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.log(error);
    }
  },
};
