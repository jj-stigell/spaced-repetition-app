const { internalServerError } = require('../../util/errors/graphQlErrors');
const constants = require('../../util/constants');
const { calculateDate } = require('../../util/helper');
const { Session } = require('../../models');

/**
 * Create a new session for the user, set expiry same as JWT expiry, placeholder for now
 * @param {integer} accountId, accounts id number
 * @returns {Session} Newly created session
 */
const createNewSession = async (accountId, userAgent) => {
  try {
    const date = calculateDate(constants.login.sessionLifetime);
    return await Session.create({
      accountId: accountId,
      expireAt: date,
      browser: userAgent.browser,
      os: userAgent.os,
      device: userAgent.device
    });
  } catch (error) {
    return internalServerError(error);
  }
};

/**
 * Delete session by PK
 * @param {string} sessionId version 4 UUID
 * @returns {integer} found row count, 1 if session found and deleted, 0 if none found
 */
const deleteSession = async (sessionId) => {
  try {
    return await Session.destroy({
      where: {
        id: sessionId
      }
    });
  } catch (error) {
    return internalServerError(error);
  }
};

/**
 * Find non-expired session by its PK
 * @param {string} sessionId version 4 UUID
 * @returns {Session} Session found with the sessionId
 */
const findSessionById = async (sessionId) => {
  try {
    return await Session.findByPk(sessionId);
  } catch (error) {
    return internalServerError(error);
  }
};

/**
 * Find all non expired sessions for the user
 * @param {integer} accountId account id
 * @returns {Array<Session>} Array of all existing sessions user has.
 */
const findAllSessions = async (accountId) => {
  try {
    return await Session.findAll({
      where: {
        accountId: accountId
      }
    });
  } catch (error) {
    return internalServerError(error);
  }
};

module.exports = {
  createNewSession,
  deleteSession,
  findSessionById,
  findAllSessions
};
