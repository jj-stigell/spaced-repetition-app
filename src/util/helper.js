const parser = require('ua-parser-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { internalServerError } = require('./errors/graphQlErrors');
const constants = require('./constants');
const { JWT_SECRET } = require('./config');

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

module.exports = {
  parseUserAgent,
  signJWT,
  calculateDate,
  hashCompare,
  hashPassword
};
