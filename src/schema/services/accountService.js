const bcrypt = require('bcrypt');
const { internalServerError } = require('../../util/errors/graphQlErrors');
const constants = require('../../util/constants');
const { Account } = require('../../models');

/**
 * Fecth account from database by id number
 * @param {integer} accountId, accounts id number
 * @returns {Account} account found from db
 */
const findAccountById = async (accountId) => {
  try {
    return await Account.findByPk(accountId);
  } catch (error) {
    return internalServerError(error);
  }
};

/**
 * Check if email is taken by someone, case insensitive
 * @param {string} email, email address
 * @returns {Account} account found from db
 */
const findAccountByEmail = async (email) => {
  try {
    return await Account.findOne({ where: { email: email.toLowerCase() } });
  } catch (error) {
    return internalServerError(error);
  }
};

/**
 * Create a new account
 * @param {string} email, new email for the account
 * @param {*} passwordHash, password hash
 * @returns {Account} new account
 */
const createNewAccount = async (email, passwordHash) => {
  try {
    return await Account.create({
      email: email.toLowerCase(),
      passwordHash: passwordHash,
    });
  } catch (error) {
    return internalServerError(error);
  }
};

/**
 * Compare user submitted plain-text password to hash
 * @param {string} password, user submitted password
 * @param {string} hash, account hashed password from db
 * @returns {boolean} true if hash match, false if no match
 */
const hashCompare = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch(error) {
    return internalServerError(error);
  }
};

/**
 * Hash user submitted plain-text password to hash
 * @param {string} password, user submitted password
 * @returns {string} hashed password
 */
const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, constants.saltRounds);
  } catch(error) {
    return internalServerError(error);
  }
};

module.exports = {
  findAccountById,
  findAccountByEmail,
  createNewAccount,
  hashCompare,
  hashPassword
};
