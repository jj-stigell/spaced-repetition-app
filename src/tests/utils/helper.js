const { expect } = require('@jest/globals');
const request = require('supertest');
const { sequelize } = require('../../database');
const mutations = require('./mutations');
const { account, accountUnconfirmedEmail, nonMemberAccount, adminReadRights, adminWriteRights, accountCard } = require('./constants');

/**
 * Reset database for the next tests
 * Removes all existing user related input from database
 * Adds new accounts (2 regular with confirmed and unconfirmed emails, 2 admin account with read and write rights)
 * @param {string} testType - string describing with kind of test is ran.
 */
const resetDatabaseEntries = async (testType) => {
  try {
    const queryInterface = sequelize.getQueryInterface();
    console.log(`resetting db entries for ${testType} testing`);

    // Truncate all data that might have been affected by the tests
    await queryInterface.sequelize.query('TRUNCATE account, admin, account_deck_settings, account_review, account_card, bug_report, session;');

    await queryInterface.sequelize.query(`
    INSERT INTO account (email, username, email_verified, password_hash, member, language_id, last_login, created_at, updated_at) VALUES
    ('${account.email}', '${account.username}', ${account.emailVerified}, '$2b$10$lx.EiIbvANCQDyOKTF3jsu.SuYvgGxxbYSViDKdzf7RB1qxodOb/m', 
    ${account.member}, '${account.languageId}', NOW(), NOW(), NOW());
    `);

    await queryInterface.sequelize.query(`
    INSERT INTO account (email, username, email_verified, password_hash, member, language_id, last_login, created_at, updated_at) VALUES
    ('${accountUnconfirmedEmail.email}', '${accountUnconfirmedEmail.username}', ${accountUnconfirmedEmail.emailVerified}, '$2b$10$lx.EiIbvANCQDyOKTF3jsu.SuYvgGxxbYSViDKdzf7RB1qxodOb/m', 
    ${accountUnconfirmedEmail.member}, '${accountUnconfirmedEmail.languageId}', NOW(), NOW(), NOW());
    `);

    await queryInterface.sequelize.query(`
    INSERT INTO account (email, username, email_verified, password_hash, member, language_id, last_login, created_at, updated_at) VALUES
    ('${nonMemberAccount.email}', '${nonMemberAccount.username}', ${nonMemberAccount.emailVerified}, '$2b$10$lx.EiIbvANCQDyOKTF3jsu.SuYvgGxxbYSViDKdzf7RB1qxodOb/m', 
    ${nonMemberAccount.member}, '${nonMemberAccount.languageId}', NOW(), NOW(), NOW());
    `);

    const accountForAdminReadRights = await queryInterface.sequelize.query(`
    INSERT INTO account (email, username, email_verified, password_hash, member, language_id, last_login, created_at, updated_at) VALUES
    ('${adminReadRights.email}', '${adminReadRights.username}', ${adminReadRights.emailVerified}, '$2b$10$lx.EiIbvANCQDyOKTF3jsu.SuYvgGxxbYSViDKdzf7RB1qxodOb/m', 
    ${adminReadRights.member}, '${adminReadRights.languageId}', NOW(), NOW(), NOW())
    RETURNING id;
    `);

    const accountForAdminWriteRights = await queryInterface.sequelize.query(`
    INSERT INTO account (email, username, email_verified, password_hash, member, language_id, last_login, created_at, updated_at) VALUES
    ('${adminWriteRights.email}', '${adminWriteRights.username}', ${adminWriteRights.emailVerified}, '$2b$10$lx.EiIbvANCQDyOKTF3jsu.SuYvgGxxbYSViDKdzf7RB1qxodOb/m', 
    ${adminWriteRights.member}, '${adminWriteRights.languageId}', NOW(), NOW(), NOW())
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

const addDueReviewsForThisDay = async (accountId, amount, cardStartId) => {
  try {
    const queryInterface = sequelize.getQueryInterface();
    const date = new Date();
    for (let i = cardStartId; i < amount + cardStartId; i++) {
      let newDate = date.setDate(date.getDate());
      newDate = new Date(newDate);
      await queryInterface.sequelize.query(`INSERT INTO account_card (account_id, card_id, account_story, 
      account_hint, review_count, easy_factor, mature, due_at, created_at, updated_at)
      VALUES ('${accountId}', '${i}', '${accountCard.story}', '${accountCard.hint}', 0, 1.5, false, '${newDate.toISOString().split('T')[0]}', NOW(), NOW());`);
    }
  } catch (error) {
    console.log(error);
  }
};

const addReviews = async (accountId, amount) => {
  try {
    const queryInterface = sequelize.getQueryInterface();
    const date = new Date();
    for (let i = 10; i < amount + 10; i++) {
      let newDate = date.setDate(date.getDate() - i);
      newDate = new Date(newDate);
      await queryInterface.sequelize.query(`
      INSERT INTO account_review (account_id, card_id, extra_review, timing, result, created_at) VALUES
      ('${accountId}', '${i}', true, 13.5, 'AGAIN', '${newDate.toISOString().split('T')[0]}');
      `);
    }
  } catch (error) {
    console.log(error);
  }
};

const healthCheck = async (testUrl) => {
  const response = await request(`${testUrl}.well-known/apollo/server-health`)
    .post('/')
    .send();
  expect(response.body.status).toBeDefined();
  expect(response.status).toBe(200);
  expect(response.body.status).toBe('pass');
};

const registerAccount = async (testUrl, registerData) => {
  const response = await request(testUrl)
    .post('/')
    .send({ query: mutations.register, variables: registerData });
  return response.body.data.createAccount;
};

const getToken = async (testUrl, loginData) => {
  const response = await request(testUrl)
    .post('/')
    .send({ query: mutations.login, variables: loginData });
  return [response.body.data.login.token, response.body.data.login.account];
};

module.exports = {
  resetDatabaseEntries,
  addDueReviewsForThisDay,
  addReviews,
  healthCheck,
  registerAccount,
  getToken
};
