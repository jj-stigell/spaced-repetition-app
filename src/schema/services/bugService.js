/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const { internalServerError } = require('../../util/errors/graphQlErrors');
const constants = require('../../util/constants');
const models = require('../../models');

const findBugReportById = async (id) => {
  try {
    return await models.BugReport.findByPk(id);
  } catch (error) {
    return internalServerError(error);
  }
};

const findAllBugReports = async () => {
  try {
    return await models.BugReport.findAll({});
  } catch (error) {
    return internalServerError(error);
  }
};

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
