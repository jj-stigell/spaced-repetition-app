const { internalServerError } = require('../../util/errors/graphQlErrors');
const { Account } = require('../../models');

/**
 * Fecth account from database by id number
 * @param {integer} accountId, accounts id number
 */
const findAccountById = async (accountId) => {
  try {
    return await Account.findByPk(accountId);
  } catch (error) {
    console.log(error);
    internalServerError();
  }
};

/**
 * Check if email is taken by someone, case insensitive
 * @param {string} email, email address
 */
const findAccountByEmail = async (email) => {
  try {
    return await Account.findOne({
      attributes: ['id'],
      where: {
        email: email.toLowerCase()
      }
    });
  } catch (error) {
    console.log(error);
    internalServerError();
  }
};

module.exports = {
  findAccountById,
  findAccountByEmail
};
