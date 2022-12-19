const { notAuthError, defaultError } = require('../../util/errors/graphQlErrors');
const { checkAdminPermission } = require('../../util/authorization');
const validator = require('../../util/validation//validator');
const errors = require('../../util/errors/errors');
const services = require('../services');

const resolvers = {
  Query: {
    bugReports: async (root, args, { currentUser }) => {
      if (!currentUser) return notAuthError();
      await checkAdminPermission(currentUser.id, 'READ');
      return await services.bugService.findAllBugReports();    
    },
    bugReportById: async (root, { bugId }, { currentUser }) => {
      if (!currentUser) return notAuthError();
      await validator.validateInteger(bugId);
      await checkAdminPermission(currentUser.id, 'READ');
      const bug = await services.bugService.findBugReportById(bugId);
      if (bug === null) return defaultError(errors.bug.bugByIdNotFound);
      return bug;
    },
    bugReportsByType: async (root, { type }, { currentUser }) => {
      if (!currentUser) return notAuthError();
      await validator.validateBugType(type);
      await checkAdminPermission(currentUser.id, 'READ');
      return await services.bugService.findAllBugReportsByType(type);
    },
  },
  Mutation: {
    sendBugReport: async (_, { type, bugMessage, cardId }, { currentUser }) => {
      if (!currentUser) return notAuthError();
      await validator.validateNewBug(type, bugMessage, cardId);
      return await services.bugService.createNewBugReport(type, bugMessage, currentUser.id, cardId);
    },
    solveBugReport: async (_, { bugId, solvedMessage, solved }, { currentUser }) => {
      if (!currentUser) return notAuthError();
      await validator.validateBugSolve(bugId, solvedMessage, solved);
      await checkAdminPermission(currentUser.id, 'WRITE');
      return await services.bugService.solveBugReport(bugId, solvedMessage, solved);
    },
    deleteBugReport: async (_, { bugId }, { currentUser }) => {
      if (!currentUser) return notAuthError();
      await validator.validateInteger(bugId);
      await checkAdminPermission(currentUser.id, 'WRITE');
      const deletedBug = await services.bugService.deleteBugReport(bugId);
      if (!deletedBug) return defaultError(errors.bug.bugByIdNotFound);
      return bugId;
    },
  }
};

module.exports = resolvers;
