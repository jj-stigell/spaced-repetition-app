const { internalServerError } = require('../../util/errors/graphQlErrors');
const models = require('../../models');

/**
 * Find specific bug report by id (PK)
 * @param {integer} id of the bug report
 * @returns {BugReport} Bug report object
 */
const findBugReportById = async (id) => {
  try {
    return await models.BugReport.findByPk(id);
  } catch (error) {
    return internalServerError(error);
  }
};

/**
 * Find all bug reports, both solved and unsolved
 * @returns {Array<models.BugReport>} An array of all bug reports
 */
const findAllBugReports = async () => {
  try {
    return await models.BugReport.findAll({});
  } catch (error) {
    return internalServerError(error);
  }
};

/**
 * Find all bug reports by type
 * @param {string} type Type of the bug, possible types defined in constants file
 * @returns {Array<models.BugReport>} An array of all bug reports of type
 */
const findAllBugReportsByType = async (type) => {
  try {
    return await models.BugReport.findAll({
      where: {
        type: type
      }
    });
  } catch (error) {
    return internalServerError(error);
  }
};

/**
 * Create new bug report
 * @param {string} type Type of the bug, possible types defined in constants file 
 * @param {string} message Message to describe the bug
 * @param {integer} accountId accounts id number
 * @param {integer} cardId card id, if bug connected to certain card, can be null
 * @returns Newly created bug report
 */
const createNewBugReport = async (type, message, accountId, cardId) => {
  try {
    return await models.BugReport.create({
      accountId: accountId,
      cardId: cardId ? cardId : null,
      type: type,
      bugMessage: message
    });
  } catch (error) {
    return internalServerError(error);
  }
};

/**
 * Admin solve/edit bug report
 * @param {integer} bugId Id of the bug report
 * @param {string} solvedMessage Message describing how bug was handled
 * @param {boolean} solved true if bug fixed, false otherwise, no null values
 * @returns Edited bug report
 */
const solveBugReport = async (bugId, solvedMessage, solved) => {
  try {
    const bugReport = await findBugReportById(bugId);
    bugReport.set({
      solvedMessage: solvedMessage ? solvedMessage : null,
      solved: solved ? true : false
    });
    bugReport.save();
    return bugReport;
  } catch (error) {
    return internalServerError(error);
  }
};

module.exports = {
  findBugReportById,
  findAllBugReports,
  findAllBugReportsByType,
  createNewBugReport,
  solveBugReport
};
