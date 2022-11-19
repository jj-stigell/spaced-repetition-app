const { sequelize } = require('../../database');

const resetDatabaseEntries = async (testType) => {
  try {
    const queryInterface = sequelize.getQueryInterface();
    console.log(`resetting db entries for ${testType} testing`);
    // Truncate all data that might have been affected by the tests
    await queryInterface.sequelize.query('TRUNCATE account, admin, account_deck_settings, account_review, account_card, bug_report, session;');
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  resetDatabaseEntries
};
