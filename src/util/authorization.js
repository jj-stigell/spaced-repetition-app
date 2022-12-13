const { internalServerError, notAuthorizedError, defaultError } = require('./errors/graphQlErrors');
const { findAdminByAccountId } = require('../schema/services/accountService');
const graphQlErrors = require('./errors/graphQlErrors');
const errors = require('./errors/errors');
const { findSessionById } = require('../schema/services/sessionService');
const { findAccountById } = require('../schema/services/accountService');

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
  if (admin === null) notAuthorizedError(errors.admin.noAdminRightsError);

  switch (permission) {
  case 'READ':
    if (!admin.read && !admin.write) notAuthorizedError(errors.admin.noAdminReadRights);
    break;
  case 'WRITE':
    if (!admin.write) graphQlErrors.notAuthorizedError(errors.admin.noAdminWriteRights);
    break;
  default:
    internalServerError(errors.internalServerError);
  }

  return 1;
};

/**
 * Validate that session is found and active
 * @param {string} sessionId - version 4 UUID
 * @returns integer one if passes check
 */
const validateSession = async (sessionId) => {
  const session = await findSessionById(sessionId);
  if (!session) defaultError(errors.session.sessionNotFoundError);
  if (!session.active) defaultError(errors.session.sessionExpiredError);
  return 1;
};

/**
 * Check if account is active member
 * @param {integer} accountId - accounts id
 * @returns integer one if passes check
 */
const validateMember = async (accountId) => {
  const account = await findAccountById(accountId);
  if (!account.member) return graphQlErrors.notAuthorizedError(errors.account.memberFeatureError);
  return 1;
};

module.exports = {
  checkAdminPermission,
  validateSession,
  validateMember
};
