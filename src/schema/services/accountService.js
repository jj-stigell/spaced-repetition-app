const { internalServerError } = require('../../util/errors/graphQlErrors');
const models = require('../../models');
const { Op } = require('sequelize');

/**
 * Fetch account from database by id number.
 * @param {integer} accountId - accounts id number
 * @returns {Account} account found from db
 */
const findAccountById = async (accountId) => {
  try {
    return await models.Account.findByPk(accountId);
  } catch (error) {
    return internalServerError(error);
  }
};

/**
 * Check if email is taken by someone, case insensitive.
 * @param {string} email - email address
 * @returns {Account} account found from db
 */
const findAccountByEmail = async (email) => {
  try {
    return await models.Account.findOne({ where: { email: email.toLowerCase() } });
  } catch (error) {
    return internalServerError(error);
  }
};

/**
 * Check if username is taken by someone, case sensitive.
 * @param {string} username - username
 * @returns {Account} account found from db
 */
const findAccountByUsername = async (username) => {
  try {
    return await models.Account.findOne({ where: { username: username.toLowerCase() } });
  } catch (error) {
    return internalServerError(error);
  }
};

/**
 * Check if username is taken by someone, case insensitive.
 * @param {string} username - username
 * @returns {Account} account found from db
 */
const findAccountByUsernameCaseInsensitive = async (username) => {
  try {
    return await models.Account.findOne({ where: { username: { [Op.iLike]: username } } } );
  } catch (error) {
    return internalServerError(error);
  }
};

/**
 * Find admin entry from db.
 * @param {integer} accountId - accounts id number
 * @returns {Admin} admin found with account id
 */
const findAdminByAccountId = async (accountId) => {
  try {
    return await models.Admin.findOne({
      where: {
        accountId: accountId
      }
    });
  } catch (error) {
    return internalServerError(error);
  }
};

/**
 * Create a new account.
 * @param {string} email - new email for the account
 * @param {string} username - username
 * @param {string} languageId - language selected, default EN
 * @param {string} passwordHash - password hash
 * @returns {Account} newly created account
 */
const createNewAccount = async (email, username, languageId, passwordHash) => {
  try {
    return await models.Account.create({
      email: email.toLowerCase(),
      username: username,
      languageId: languageId,
      passwordHash: passwordHash,
    });
  } catch (error) {
    return internalServerError(error);
  }
};

module.exports = {
  findAccountById,
  findAccountByEmail,
  findAccountByUsername,
  findAccountByUsernameCaseInsensitive,
  findAdminByAccountId,
  createNewAccount
};
