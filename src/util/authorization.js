const { internalServerError, notAuthorizedError, defaultError } = require('./errors/graphQlErrors');
const { findAdminByAccountId, findAccountById } = require('../schema/services/accountService');
const { findSessionById } = require('../schema/services/sessionService');
const errors = require('./errors/errors');

/**
 * Check if user has required admin rights to acces or edit a resource.
 * Throws an error if account does not have the required permissions.
 * If user has write rights, they are also expected to have read rights.
 * @param {integer} accountId - accounts id
 * @param {string} permission - which permission is checked, either READ or WRITE
 * @returns {integer} 1 if required permissions found
 */
const checkAdminPermission = async (accountId, permission) => {
  const admin = await findAdminByAccountId(accountId);
  if (admin === null) return notAuthorizedError(errors.admin.noAdminRightsError);

  switch (permission) {
  case 'READ':
    if (!admin.read && !admin.write) return notAuthorizedError(errors.admin.noAdminReadRights);
    break;
  case 'WRITE':
    if (!admin.write) return notAuthorizedError(errors.admin.noAdminWriteRights);
    break;
  default:
    return internalServerError(errors.internalServerError);
  }

  return 1;
};

/**
 * Validate that session is found and active.
 * @param {string} sessionId - version 4 UUID
 * @returns {integer} 1 if required permissions found
 */
const validateSession = async (sessionId) => {
  const session = await findSessionById(sessionId);
  if (!session) return defaultError(errors.session.sessionNotFoundError);
  if (!session.active) return defaultError(errors.session.sessionExpiredError);
  return 1;
};

/**
 * Check if account is active member.
 * @param {integer} accountId - accounts id
 * @returns {boolean} if user is active member
 */
const validateMember = async (accountId) => {
  const account = await findAccountById(accountId);
  if (!account.member) return notAuthorizedError(errors.account.memberFeatureError);
  return true;
};

module.exports = {
  checkAdminPermission,
  validateSession,
  validateMember
};
