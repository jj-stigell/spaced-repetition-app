/* eslint-disable no-unused-vars */
const { it, expect, describe, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { account, nonMemberAccount, adminReadRights, adminWriteRights, validBugReport, solveBugReport, stringData } = require('./utils/constants'); 
const { bugReportEvaluator } = require('./utils/expectHelper');
const { connectToDatabase } = require('../database');
const errors = require('../util/errors/errors');
const mutations = require('./utils/mutations');
const constants = require('../util/constants');
const sendRequest = require('./utils/request');
const { PORT } = require('../util/config');
const queries = require('./utils/queries');
const helpers = require('./utils/helper');
const server = require('../util/server');

describe('Bug report integration tests', () => {
  let testServer, testUrl, memberAuthToken, adminAuthReadToken,
    adminAuthWriteToken, nonMemberAuthToken, memberAcc, nonMemberAcc,
    adminReadAcc, adminWriteAcc, bugReportToSolve,
    findTypeFirst = 'FUNCTIONALITY', findTypeSecond = 'UI';

  // before the tests spin up an Apollo Server
  beforeAll(async () => {
    await connectToDatabase();
    const serverInfo = await server.listen({ port: PORT });
    testServer = serverInfo.server;
    testUrl = serverInfo.url;
  });

  // after the tests stop the server
  afterAll(async () => {
    await testServer?.close();
  });

  beforeEach(async () => {
    await helpers.resetDatabaseEntries();
    [ memberAuthToken, memberAcc ] = await helpers.getToken(testUrl, account);
    [ nonMemberAuthToken, nonMemberAcc ] = await helpers.getToken(testUrl, nonMemberAccount);
    [ adminAuthReadToken, adminReadAcc ] = await helpers.getToken(testUrl, adminReadRights);
    [ adminAuthWriteToken, adminWriteAcc ] = await helpers.getToken(testUrl, adminWriteRights);
    // Add bug report to the db, and set its id for the bug report that must be searched/deleted/edited, etc.
    const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.sendBugReport, validBugReport);
    bugReportToSolve = {
      ...response.body.data.sendBugReport,
      ...solveBugReport,
      id: parseInt(response.body.data.sendBugReport.id),
      bugId: parseInt(response.body.data.sendBugReport.id)
    };
  });

  describe('Send a bug report', () => {

    it('Authentication error when not logged in', async () => {
      const response = await sendRequest(testUrl, null, mutations.sendBugReport, validBugReport);
      expect(response.body.data?.sendBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Error when bug type does not match any of the enum types', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.sendBugReport, { ...validBugReport, type: 'NOTVALID' });
      expect(response.body.data?.sendBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when bug message too short', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.sendBugReport,{ ...validBugReport, bugMessage: 'x'.repeat(constants.bugs.solvedMessageMinLength - 1) });
      expect(response.body.data?.sendBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.bugErrors.bugMessageTooShortError);
    });

    it('Error when bug message too long', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.sendBugReport, { ...validBugReport, bugMessage: 'x'.repeat(constants.bugs.bugMessageMaxLength + 1) });
      expect(response.body.data?.sendBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.bugErrors.bugMessageTooLongError);
    });

    it('Error when bug message type not string', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.sendBugReport, { ...validBugReport, bugMessage: 1 });
      expect(response.body.data?.sendBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when bug message not send', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.sendBugReport, { ...validBugReport, bugMessage: null });
      expect(response.body.data?.sendBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when card id negative integer', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.sendBugReport, { ...validBugReport, cardId: -1 });
      expect(response.body.data?.sendBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.validationErrors.negativeNumberTypeError);
    });

    it('Error when card id zero', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.sendBugReport, { ...validBugReport, cardId: 0 });
      expect(response.body.data?.sendBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.validationErrors.negativeNumberTypeError);
    });

    it('Error when card id type not integer', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.sendBugReport, { ...validBugReport, cardId: 'x' });
      expect(response.body.data?.sendBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Sending bug report works after authentication (non-member), all arguments according to validation rules', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.sendBugReport, validBugReport);
      bugReportEvaluator(response.body.data.sendBugReport);
      expect(response.body.errors).toBeUndefined();
    });

    it('Sending bug report works after authentication (member), all arguments according to validation rules', async () => {
      const response = await sendRequest(testUrl, memberAuthToken, mutations.sendBugReport, validBugReport);
      bugReportEvaluator(response.body.data.sendBugReport);
      expect(response.body.errors).toBeUndefined();
    });

    it('Sending bug report succesfull without card id', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.sendBugReport, { type: validBugReport.type, bugMessage: validBugReport.bugMessage });
      bugReportEvaluator(response.body.data.sendBugReport);
      expect(response.body.errors).toBeUndefined();
    });
  });

  describe('Solving bug reports', () => {

    it('Solving bug report leads to auth error when not logged in', async () => {
      const response = await sendRequest(testUrl, null, mutations.solveBugReport, bugReportToSolve);
      expect(response.body.data?.solveBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Unauthorized error when logged in as non-member but not admin', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.solveBugReport, bugReportToSolve);
      expect(response.body.data?.solveBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.adminErrors.noAdminRightsError);
    });

    it('Unauthorized error when logged in as member but not admin', async () => {
      const response = await sendRequest(testUrl, memberAuthToken, mutations.solveBugReport, bugReportToSolve);
      expect(response.body.data?.solveBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.adminErrors.noAdminRightsError);
    });

    it('Unauthorized error when admin but no write permission', async () => {
      const response = await sendRequest(testUrl, adminAuthReadToken, mutations.solveBugReport, bugReportToSolve);
      expect(response.body.data?.solveBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.adminErrors.noAdminWriteRightsError);
    });

    it('Error when write permission but bug id negative integer', async () => {
      const response = await sendRequest(testUrl, adminAuthWriteToken, mutations.solveBugReport, {...bugReportToSolve, bugId: -1 });
      expect(response.body.data?.solveBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.validationErrors.negativeNumberTypeError);
    });

    it('Error when write permission but bug id zero integer', async () => {
      const response = await sendRequest(testUrl, adminAuthWriteToken, mutations.solveBugReport, {...bugReportToSolve, bugId: 0 });
      expect(response.body.data?.solveBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.validationErrors.negativeNumberTypeError);
    });

    it('Error when write permission but bug id type not integer', async () => {
      const response = await sendRequest(testUrl, adminAuthWriteToken, mutations.solveBugReport, {...bugReportToSolve, bugId: 'x' });
      expect(response.body.data?.solveBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when bug solve message too short', async () => {
      const response = await sendRequest(testUrl, adminAuthWriteToken, mutations.solveBugReport, {...bugReportToSolve, solvedMessage: 'x'.repeat(constants.bugs.solvedMessageMinLength - 1) });
      expect(response.body.data?.solveBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.bugErrors.bugSolveMessageTooShortError);
    });

    it('Error when bug solve message too short', async () => {
      const response = await sendRequest(testUrl, adminAuthWriteToken, mutations.solveBugReport, {...bugReportToSolve, solvedMessage: 'x'.repeat(constants.bugs.solvedMessageMaxLength + 1) });
      expect(response.body.data?.solveBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.bugErrors.bugSolveMessageTooLongError);
    });

    it('Error when bug solve message not type string', async () => {
      const response = await sendRequest(testUrl, adminAuthWriteToken, mutations.solveBugReport, {...bugReportToSolve, solvedMessage: 1 });
      expect(response.body.data?.solveBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when solved not type boolean', async () => {
      const response = await sendRequest(testUrl, adminAuthWriteToken, mutations.solveBugReport, {...bugReportToSolve, solved: 1 });
      expect(response.body.data?.solveBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Solve bug report succesful when admin with write permission, all arguments according to validation rules', async () => {
      const response = await sendRequest(testUrl, adminAuthWriteToken, mutations.solveBugReport, bugReportToSolve);
      bugReportEvaluator(response.body.data.solveBugReport);
      expect(response.body.errors).toBeUndefined();
    });

    it('Solve bug report possible with solved message omitted', async () => {
      const response = await sendRequest(testUrl, adminAuthWriteToken, mutations.solveBugReport, { bugId: bugReportToSolve.bugId, solved: bugReportToSolve.solved });
      bugReportEvaluator(response.body.data.solveBugReport);
      expect(response.body.errors).toBeUndefined();
    });

    it('Solve bug report possible with solved boolean omitted', async () => {
      const response = await sendRequest(testUrl, adminAuthWriteToken, mutations.solveBugReport, { bugId: bugReportToSolve.bugId, solvedMessage: bugReportToSolve.solvedMessage });
      bugReportEvaluator(response.body.data.solveBugReport);
      expect(response.body.errors).toBeUndefined();
    });
  });

  describe('Deleting bug reports', () => {

    it('Authentication error when trying to delete but not not logged in', async () => {
      const response = await sendRequest(testUrl, null, mutations.deleteBugReport, { bugId: bugReportToSolve.bugId });
      expect(response.body.data?.deleteBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Unauthorized error when logged in as non-member but not admin', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.deleteBugReport, { bugId: bugReportToSolve.bugId });
      expect(response.body.data?.deleteBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.adminErrors.noAdminRightsError);
    });

    it('Unauthorized error when logged in as member but not admin', async () => {
      const response = await sendRequest(testUrl, memberAuthToken, mutations.deleteBugReport, { bugId: bugReportToSolve.bugId });
      expect(response.body.data?.deleteBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.adminErrors.noAdminRightsError);
    });

    it('Unauthorized error when admin but no write permission', async () => {
      const response = await sendRequest(testUrl, adminAuthReadToken, mutations.deleteBugReport, { bugId: bugReportToSolve.bugId });
      expect(response.body.data?.deleteBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.adminErrors.noAdminWriteRightsError);
    });

    it('Error when write permission but bug id negative integer', async () => {
      const response = await sendRequest(testUrl, adminAuthWriteToken, mutations.deleteBugReport, { bugId: -1 });
      expect(response.body.data?.deleteBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.validationErrors.negativeNumberTypeError);
    });

    it('Error when write permission but bug id zero integer', async () => {
      const response = await sendRequest(testUrl, adminAuthWriteToken, mutations.deleteBugReport, { bugId: 0 });
      expect(response.body.data?.deleteBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.validationErrors.negativeNumberTypeError);
    });

    it('Error when write permission but bug id type not integer', async () => {
      const response = await sendRequest(testUrl, adminAuthWriteToken, mutations.deleteBugReport, { bugId: 'x' });
      expect(response.body.data?.deleteBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when write permission but bug id not send', async () => {
      const response = await sendRequest(testUrl, adminAuthWriteToken, mutations.deleteBugReport, null);
      expect(response.body.data?.deleteBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when write permission but bug with id not found', async () => {
      const response = await sendRequest(testUrl, adminAuthWriteToken, mutations.deleteBugReport, { bugId: 9999 });
      expect(response.body.data?.deleteBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.bugErrors.bugByIdNotFoundError);
    });

    it('Delete bug report succesfully when admin with write permisson', async () => {
      const response = await sendRequest(testUrl, adminAuthWriteToken, mutations.deleteBugReport, { bugId: bugReportToSolve.bugId });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.deleteBugReport).toBeDefined();
      expect(response.body.data.deleteBugReport).toBe(bugReportToSolve.bugId);
    });
  });

  describe('Fetching bug reports', () => {

    it('Authentication error when trying to fetch bug reports but not not logged in', async () => {
      const response = await sendRequest(testUrl, null, queries.bugReports, null);
      expect(response.body.data?.bugReports).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Unauthorized error when logged in as non-member but not admin', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.bugReports, null);
      expect(response.body.data?.bugReports).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.adminErrors.noAdminRightsError);
    });

    it('Unauthorized error when logged in as member but not admin', async () => {
      const response = await sendRequest(testUrl, memberAuthToken, queries.bugReports, null);
      expect(response.body.data?.bugReports).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.adminErrors.noAdminRightsError);
    });

    it('Access possible when admin but no write permission', async () => {
      const response = await sendRequest(testUrl, adminAuthReadToken, queries.bugReports, null);
      response.body.data.bugReports.forEach(bugReport => bugReportEvaluator(bugReport));
      expect(response.body.errors).toBeUndefined();
    });

    it('Access possible when admin with write permission', async () => {
      const response = await sendRequest(testUrl, adminAuthWriteToken, queries.bugReports, null);
      response.body.data.bugReports.forEach(bugReport => bugReportEvaluator(bugReport));
      expect(response.body.errors).toBeUndefined();
    });
  });

  describe('Fetching bug report by id', () => {

    it('Authentication error when trying to fetch bug report by id but not not logged in', async () => {
      const response = await sendRequest(testUrl, null, queries.bugReportById, { bugId: bugReportToSolve.bugId });
      expect(response.body.data?.bugReportById).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Unauthorized error when logged in as non-member but not admin', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.bugReportById, { bugId: bugReportToSolve.bugId });
      expect(response.body.data?.bugReportById).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.adminErrors.noAdminRightsError);
    });

    it('Unauthorized error when logged in as member but not admin', async () => {
      const response = await sendRequest(testUrl, memberAuthToken, queries.bugReportById, { bugId: bugReportToSolve.bugId });
      expect(response.body.data?.bugReportById).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.adminErrors.noAdminRightsError);
    });

    it('Error when read permission but bug id negative integer', async () => {
      const response = await sendRequest(testUrl, adminAuthReadToken, queries.bugReportById, { bugId: -1 });
      expect(response.body.data?.bugReportById.id).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.validationErrors.negativeNumberTypeError);
    });

    it('Error when read permission but bug id zero integer', async () => {
      const response = await sendRequest(testUrl, adminAuthReadToken, queries.bugReportById, { bugId: 0 });
      expect(response.body.data?.bugReportById.id).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.validationErrors.negativeNumberTypeError);
    });

    it('Error when read permission but bug id type not integer', async () => {
      const response = await sendRequest(testUrl, adminAuthReadToken, queries.bugReportById, { bugId: 'x' });
      expect(response.body.data?.bugReportById.id).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when read permission but bug with id not found', async () => {
      const response = await sendRequest(testUrl, adminAuthReadToken, queries.bugReportById, { bugId: 9999 });
      expect(response.body.data?.bugReportById.id).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.bugErrors.bugByIdNotFoundError);
    });

    it('Error when read permission but bug id not send', async () => {
      const response = await sendRequest(testUrl, adminAuthReadToken, queries.bugReportById, null);
      expect(response.body.data?.bugReportById.id).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Access possible when admin with read permission', async () => {
      const response = await sendRequest(testUrl, adminAuthReadToken, queries.bugReportById, { bugId: bugReportToSolve.id });
      bugReportEvaluator(response.body.data.bugReportById);
      expect(response.body.errors).toBeUndefined();
    });

    it('Access possible when admin with write permission', async () => {
      const response = await sendRequest(testUrl, adminAuthWriteToken, queries.bugReportById, { bugId: bugReportToSolve.id });
      bugReportEvaluator(response.body.data.bugReportById);
      expect(response.body.errors).toBeUndefined();
    });
  });

  describe('Fetching bug reports by type', () => {

    it('Authentication error when trying to fetch bug report by id but not not logged in', async () => {
      const response = await sendRequest(testUrl, null, queries.bugReportsByType, { type: findTypeFirst });
      expect(response.body.data?.bugReportsByType).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Unauthorized error when logged in as non-member but not admin', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.bugReportsByType, { type: findTypeFirst });
      expect(response.body.data?.bugReportsByType).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.adminErrors.noAdminRightsError);
    });

    it('Unauthorized error when logged in as member but not admin', async () => {
      const response = await sendRequest(testUrl, memberAuthToken, queries.bugReportsByType, { type: findTypeFirst });
      expect(response.body.data?.bugReportsByType).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.adminErrors.noAdminRightsError);
    });

    it('Error when read permission but bug type enum invalid', async () => {
      const response = await sendRequest(testUrl, adminAuthReadToken, queries.bugReportsByType, { type: stringData.notValidEnum });
      expect(response.body.data?.bugReportsByType).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when read permission but bug type wrong type', async () => {
      const response = await sendRequest(testUrl, adminAuthReadToken, queries.bugReportsByType, { type: 1 });
      expect(response.body.data?.bugReportsByType).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when read permission but bug type not send', async () => {
      const response = await sendRequest(testUrl, adminAuthReadToken, queries.bugReportsByType, null);
      expect(response.body.data?.bugReportsByType).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it(`Access possible when admin with read permission, searching type '${findTypeFirst}'`, async () => {
      const response = await sendRequest(testUrl, adminAuthReadToken, queries.bugReportsByType, { type: findTypeFirst });
      response.body.data.bugReportsByType.forEach(bugReport => bugReportEvaluator(bugReport));
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.bugReportsByType.every(bug => bug.type === findTypeFirst)).toBe(true);
    });

    it(`Access possible when admin with write permission, searching type '${findTypeFirst}'`, async () => {
      const response = await sendRequest(testUrl, adminAuthWriteToken, queries.bugReportsByType, { type: findTypeFirst });
      response.body.data.bugReportsByType.forEach(bugReport => bugReportEvaluator(bugReport));
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.bugReportsByType.every(bug => bug.type === findTypeFirst)).toBe(true);
    });

    it(`Access possible when admin with read permission, searching type '${findTypeSecond}'`, async () => {
      const response = await sendRequest(testUrl, adminAuthReadToken, queries.bugReportsByType, { type: findTypeSecond });  
      response.body.data.bugReportsByType.forEach(bugReport => bugReportEvaluator(bugReport));
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.bugReportsByType.every(bug => bug.type === findTypeSecond)).toBe(true);
    });

    it(`Access possible when admin with write permission, searching type '${findTypeSecond}'`, async () => {
      const response = await sendRequest(testUrl, adminAuthWriteToken, queries.bugReportsByType, { type: findTypeSecond });
      response.body.data.bugReportsByType.forEach(bugReport => bugReportEvaluator(bugReport));
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.bugReportsByType.every(bug => bug.type === findTypeSecond)).toBe(true);
    });
  });
});
