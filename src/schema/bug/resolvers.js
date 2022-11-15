const errors = require('../../util/errors/errors');
const validator = require('../../util/validation//validator');
const graphQlErrors = require('../../util/errors/graphQlErrors');
const services = require('../services');

const resolvers = {
  Query: {
    fetchAllBugReports: async (root, args, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      const admin = await services.accountService.findAdminById(currentUser.id);
      if (admin === null) return graphQlErrors.defaultError(errors.admin.noAdminRightsError);
      if (!admin.read) return graphQlErrors.defaultError(errors.admin.noAdminReadRights);

      return await services.bugService.findAllBugReports();    
    },
    fetchBugReportById: async (root, { bugId }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      await validator.validateInteger(bugId);
      const admin = await services.accountService.findAdminById(currentUser.id);
      if (admin === null) return graphQlErrors.defaultError(errors.admin.noAdminRightsError);
      if (!admin.read) return graphQlErrors.defaultError(errors.admin.noAdminReadRights);

      const bug = await services.bugService.findBugReportById(bugId);
      if (bug === null) return graphQlErrors.defaultError(errors.bug.bugByIdNotFound);

      return bug;
    },
    fetchBugReportsByType: async (root, { type }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      await validator.validateBugType(type);
      const admin = await services.accountService.findAdminById(currentUser.id);
      if (admin === null) return graphQlErrors.defaultError(errors.admin.noAdminRightsError);
      if (!admin.read) return graphQlErrors.defaultError(errors.admin.noAdminReadRights);

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
      const admin = await services.accountService.findAdminById(currentUser.id);
      if (admin === null) return graphQlErrors.defaultError(errors.admin.noAdminRightsError);
      if (!admin.write) return graphQlErrors.defaultError(errors.admin.noAdminWriteRights);

      return await services.bugService.solveBugReport(bugId, solvedMessage, solved);
    },
    deleteBugReport: async (_, { bugId }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      await validator.validateInteger(bugId);
      const admin = await services.accountService.findAdminById(currentUser.id);
      if (admin === null) return graphQlErrors.defaultError(errors.admin.noAdminRightsError);
      if (!admin.write) return graphQlErrors.defaultError(errors.admin.noAdminWriteRights);
      await services.bugService.deleteBugReport(bugId);

      return { status: true };
    },
  }
};

module.exports = resolvers;
