/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const { internalServerError } = require('../../util/errors/graphQlErrors');
const constants = require('../../util/constants');
const models = require('../../models');

const findBugReportById = async (bugId) => {
  try {
    return await models.BugReport.findByPk(bugId);
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

const createNewBugReport = async (email, passwordHash) => {
  try {
    return await models.BugReport.create({
      email: email.toLowerCase(),
      passwordHash: passwordHash,
    });
  } catch (error) {
    return internalServerError(error);
  }
};

module.exports = {
  findBugReportById,
  findAllBugReports,
  findAllBugReportsByType,
  createNewBugReport
};
