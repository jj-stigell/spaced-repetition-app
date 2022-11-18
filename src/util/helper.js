const parser = require('ua-parser-js');
const bcrypt = require('bcrypt');
const { internalServerError } = require('./errors/graphQlErrors');
const constants = require('./constants');
const { findAdminByAccountId } = require('../schema/services/accountService');
const graphQlErrors = require('./errors/graphQlErrors');
const errors = require('./errors/errors');

/**
 * Parse request user-agent
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent
 * @param {string} userAgent raw from request header
 * @returns {json} payload with browser, os, and device information
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
 * Create anew date by summing days to the curent date
 * @param {integer} days Amount of full days
 * @returns {Date} new date n days from today
 */
const calculateDate = (days) => {
  const newDate = new Date();
  return newDate.setDate(newDate.getDate() + days);
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
 * @param {integer} accountId 
 * @param {string} permission which permission is checked, either READ or WRITE
 * @returns {integer} 1, if required permissions found
 */
const checkAdminPermission = async (accountId, permission) => {
  const admin = await findAdminByAccountId(accountId);
  if (admin === null) return graphQlErrors.notAuthorizedError(errors.admin.noAdminRightsError);

  switch (permission) {
  case 'READ':
    if (!admin.read) graphQlErrors.notAuthorizedError(errors.admin.noAdminReadRights);
    break;
  case 'WRITE':
    if (!admin.write) graphQlErrors.notAuthorizedError(errors.admin.noAdminWriteRights);
    break;
  default:
    graphQlErrors.internalServerError();
  }

  return 1;
};

module.exports = {
  parseUserAgent,
  calculateDate,
  hashCompare,
  hashPassword,
  checkAdminPermission
};
