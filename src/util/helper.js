const parser = require('ua-parser-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { internalServerError } = require('./errors/graphQlErrors');
const constants = require('./constants');
const { JWT_SECRET } = require('./config');
const { findAdminByAccountId } = require('../schema/services/accountService');
const graphQlErrors = require('./errors/graphQlErrors');
const errors = require('./errors/errors');

/**
 * Parse request user-agent
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent
 * @param {string} userAgent - raw from request header
 * @returns {Object} - payload with browser, os, and device information
 */
const parseUserAgent = (userAgent) => {
  try {
    const parsedUserAgent = userAgent ? parser(userAgent) : null;
    return {
      browser: parsedUserAgent?.browser.name ? parsedUserAgent.browser.name : '-',
      os: parsedUserAgent?.os.name ? parsedUserAgent?.os.name : '-',
      device: parsedUserAgent?.device.type ? parsedUserAgent.device.type : '-'
    };
  } catch (error) {
    return internalServerError(error);
  }
};

/**
 * Sign a new jwt token
 * @param {integer} accountId = account identifier
 * @param {UUIDV4} sessionId - UUID of the session
 * @returns new signed jwt token
 */
const signJWT = (accountId, sessionId) => {
  try {
    return jwt.sign( { id: accountId, session: sessionId }, JWT_SECRET, { expiresIn: constants.login.jwtExpiryTime } );
  } catch (error) {
    return internalServerError(error);
  }
};

/**
 * Create a new date by summing days to the current date
 * @param {Integer} days - amount of full days
 * @returns {Date} - new date n days from today
 */
const calculateDate = (days) => {
  const newDate = new Date();
  return newDate.setDate(newDate.getDate() + days);
};

/**
 * Compare user submitted plain-text password to hash
 * @param {string} password - user submitted password
 * @param {string} hash - account hashed password from db
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
 * @param {string} password - user submitted password
 * @returns {string} hashed password string
 */
const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, constants.login.saltRounds);
  } catch(error) {
    return internalServerError(error);
  }
};

/**
 * Check if user has required admin rights to acces or edit a resource
 * Throws an error if account does not have the required permissions
 * If user has write rights, they are also expected to have read rights
 * @param {integer} accountId - accounts id
 * @param {string} permission - which permission is checked, either READ or WRITE
 * @returns {integer} 1 - if required permissions found
 */
const checkAdminPermission = async (accountId, permission) => {
  const admin = await findAdminByAccountId(accountId);
  if (admin === null) return graphQlErrors.notAuthorizedError(errors.admin.noAdminRightsError);

  switch (permission) {
  case 'READ':
    if (!admin.read && !admin.write) graphQlErrors.notAuthorizedError(errors.admin.noAdminReadRights);
    break;
  case 'WRITE':
    if (!admin.write) graphQlErrors.notAuthorizedError(errors.admin.noAdminWriteRights);
    break;
  default:
    graphQlErrors.internalServerError();
  }

  return 1;
};

/**
 * Reformat statistics from database
 * @param {Object} stats - statistics from database
 * @returns {Object}
 */
const formStatistics = async (stats) => {

  const statistics = {
    matured: 0,
    learning: 0,
    new: 0
  };

  stats.forEach(value => {
    switch (value.status) {
    case 'matured':
      statistics.matured = value.count;
      break;
    case 'learning':
      statistics.learning = value.count;
      break;
    case 'new':
      statistics.new = value.count;
      break;
    }
  });

  return statistics;
};

module.exports = {
  parseUserAgent,
  signJWT,
  calculateDate,
  hashCompare,
  hashPassword,
  checkAdminPermission,
  formStatistics
};
