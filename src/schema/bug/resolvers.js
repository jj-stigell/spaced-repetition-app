/* eslint-disable no-unused-vars */
const errors = require('../../util/errors/errors');
const constants = require('../../util/constants');
const validator = require('../../util/validation//validator');
const graphQlErrors = require('../../util/errors/graphQlErrors');
const services = require('../services');

const resolvers = {
  Query: {
    fetchAllBugs: async (root, args, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      const admin = await services.accountService.findAdminById(currentUser.id);
      if (admin === null) return graphQlErrors.defaultError(errors.admin.noAdminRightsError);
      if (!admin.read) return graphQlErrors.defaultError(errors.admin.noAdminReadRights);

      return await services.bugService.findAllBugReports();    
    },
    fetchBugById: async (root, { bugId }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      await validator.validateInteger(bugId);
      const admin = await services.accountService.findAdminById(currentUser.id);
      if (admin === null) return graphQlErrors.defaultError(errors.admin.noAdminRightsError);
      if (!admin.read) return graphQlErrors.defaultError(errors.admin.noAdminReadRights);

      const bug = await services.bugService.findBugReportById(bugId);
      if (bug === null) return graphQlErrors.defaultError(errors.bug.bugByIdNotFound);

      return bug;
    },
    fetchBugsByType: async (root, { type }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      await validator.validateBugType(type);
      const admin = await services.accountService.findAdminById(currentUser.id);
      if (admin === null) return graphQlErrors.defaultError(errors.admin.noAdminRightsError);
      if (!admin.read) return graphQlErrors.defaultError(errors.admin.noAdminReadRights);

      const bugs = await services.bugService.findAllBugReportsByType(type);
      
      return bugs;
    },
  },
  Mutation: {
    sendBugMessage: async (_, { type, bugMessage, cardId }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      await validator.validateNewBug(type, bugMessage, cardId);
      const newBugReport = await services.bugService.createNewBugReport(type, bugMessage, currentUser.id, cardId);

      return newBugReport;
    },
    solveBugMessage: async (_, { bugId, solvedMessage, solved }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      const admin = services.accountService.findAdminById(currentUser.id);
      console.log(admin);
    },
  }
};

module.exports = resolvers;
