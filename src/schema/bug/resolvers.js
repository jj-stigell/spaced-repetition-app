const errors = require('../../util/errors/errors');
const validator = require('../../util/validation//validator');
const graphQlErrors = require('../../util/errors/graphQlErrors');
const services = require('../services');
const { checkAdminPermission } = require('../../util/helper');

const resolvers = {
  Query: {
    fetchAllBugReports: async (root, args, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      await checkAdminPermission(currentUser.id, 'READ');
      return await services.bugService.findAllBugReports();    
    },
    fetchBugReportById: async (root, { bugId }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      await validator.validateInteger(bugId);
      await checkAdminPermission(currentUser.id, 'READ');
      const bug = await services.bugService.findBugReportById(bugId);
      if (bug === null) return graphQlErrors.defaultError(errors.bug.bugByIdNotFound);
      return bug;
    },
    fetchBugReportsByType: async (root, { type }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      await validator.validateBugType(type);
      await checkAdminPermission(currentUser.id, 'READ');
      return await services.bugService.findAllBugReportsByType(type);
    },
  },
  Mutation: {
    sendBugReport: async (_, { type, bugMessage, cardId }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      await validator.validateNewBug(type, bugMessage, cardId);
      return await services.bugService.createNewBugReport(type, bugMessage, currentUser.id, cardId);
    },
    solveBugReport: async (_, { bugId, solvedMessage, solved }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      await validator.validateBugSolve(bugId, solvedMessage, solved);
      await checkAdminPermission(currentUser.id, 'WRITE');
      return await services.bugService.solveBugReport(bugId, solvedMessage, solved);
    },
    deleteBugReport: async (_, { bugId }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      await validator.validateInteger(bugId);
      await checkAdminPermission(currentUser.id, 'WRITE');
      const deletedBug = await services.bugService.deleteBugReport(bugId);
      if (!deletedBug) return graphQlErrors.defaultError(errors.bug.bugByIdNotFound);
      return bugId;
    },
  }
};

module.exports = resolvers;
