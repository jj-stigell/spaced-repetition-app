const { sequelize } = require('../../database');

/**
 * Reset database for the next tests
 * Removes all existing user related input from database
 * Adds new admin accounts
 * @param {string} testType - string describing with kind of test is ran.
 */
const resetDatabaseEntries = async (testType) => {
  try {
    const queryInterface = sequelize.getQueryInterface();
    console.log(`resetting db entries for ${testType} testing`);

    // Truncate all data that might have been affected by the tests
    await queryInterface.sequelize.query('TRUNCATE account, admin, account_deck_settings, account_review, account_card, bug_report, session;');

    const accountForAdminReadRights = await queryInterface.sequelize.query(`
    INSERT INTO account (email, username, email_verified, password_hash, member, language_id, last_login, created_at, updated_at) VALUES
    ('read@admin.com', 'adminReadRights', false, '$2b$10$lx.EiIbvANCQDyOKTF3jsu.SuYvgGxxbYSViDKdzf7RB1qxodOb/m', true, 'EN', NOW(), NOW(), NOW())
    RETURNING id;
    `);

    const accountForAdminWriteRights = await queryInterface.sequelize.query(`
    INSERT INTO account (email, username, email_verified, password_hash, member, language_id, last_login, created_at, updated_at) VALUES
    ('write@admin.com', 'adminWriteRights', false, '$2b$10$lx.EiIbvANCQDyOKTF3jsu.SuYvgGxxbYSViDKdzf7RB1qxodOb/m', true, 'EN', NOW(), NOW(), NOW())
    RETURNING id;
    `);

    await queryInterface.sequelize.query(`
    INSERT INTO admin (account_id, is_admin, read, write, created_at, updated_at) VALUES (${accountForAdminReadRights[0][0].id}, true, true, false, NOW(), NOW());
    `);

    await queryInterface.sequelize.query(`
    INSERT INTO admin (account_id, is_admin, read, write, created_at, updated_at) VALUES (${accountForAdminWriteRights[0][0].id}, true, false, true, NOW(), NOW());
    `);

    // Insert few bug reports
    await queryInterface.sequelize.query(`
    INSERT INTO bug_report (account_id, card_id, type, bug_message, solved_message, solved, created_at, updated_at) VALUES
    (${accountForAdminWriteRights[0][0].id}, 12, 'TRANSLATION', 'just testing', 'translations fixed', true, NOW(), NOW());
    `);

    await queryInterface.sequelize.query(`
    INSERT INTO bug_report (account_id, card_id, type, bug_message, solved_message, solved, created_at, updated_at) VALUES
    (${accountForAdminWriteRights[0][0].id}, 12, 'FUNCTIONALITY', 'just testing', 'translations fixed', true, NOW(), NOW());
    `);

    await queryInterface.sequelize.query(`
    INSERT INTO bug_report (account_id, card_id, type, bug_message, solved_message, solved, created_at, updated_at) VALUES
    (${accountForAdminReadRights[0][0].id}, 12, 'FUNCTIONALITY', 'just testing', 'translations fixed', true, NOW(), NOW());
    `);

    await queryInterface.sequelize.query(`
    INSERT INTO bug_report (account_id, card_id, type, bug_message, solved_message, solved, created_at, updated_at) VALUES
    (${accountForAdminReadRights[0][0].id}, 12, 'OTHER', 'just testing', 'translations fixed', true, NOW(), NOW());
    `);

  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  resetDatabaseEntries
};
