/* eslint-disable no-unused-vars */
const { expect, describe, beforeAll, afterAll, it } = require('@jest/globals');
const request = require('supertest');
const { PORT } = require('../util/config');
const { connectToDatabase } = require('../database');
const { account, nonMemberAccount, adminReadRights, adminWriteRights, validBugReport, solveBugReport, stringData } = require('./utils/constants'); 
const mutations = require('./utils/mutations');
const errors = require('../util/errors/errors');
const server = require('../util/server');
const helpers = require('./utils/helper');
const constants = require('../util/constants');
const queries = require('./utils/queries');
const sendRequest = require('./utils/request');
const { bugReportEvaluator } = require('./utils/expectHelper');

describe('Bugintegration tests', () => {
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

  const setUpEnvironment = async () => {
    await helpers.resetDatabaseEntries();
    [ memberAuthToken, memberAcc ] = await helpers.getToken(testUrl, account);
    [ nonMemberAuthToken, nonMemberAcc ] = await helpers.getToken(testUrl, nonMemberAccount);
    [ adminAuthReadToken, adminReadAcc ] = await helpers.getToken(testUrl, adminReadRights);
    [ adminAuthWriteToken, adminWriteAcc ] = await helpers.getToken(testUrl, adminWriteRights);
    // Add bug report to the db, and set its id for the bug report that must be searched/deleted/edited, etc.
    const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.sendBugReportMutation, validBugReport);
    bugReportToSolve = {
      ...response.body.data.sendBugReport,
      ...solveBugReport,
      id: parseInt(response.body.data.sendBugReport.id),
      bugId: parseInt(response.body.data.sendBugReport.id)
    };
  };

  describe('Send a bug report', () => {
    beforeAll(async () => { await setUpEnvironment(); });

    it('Authentication error when not logged in', async () => {
      const response = await sendRequest(testUrl, null, mutations.sendBugReportMutation, validBugReport);
      expect(response.body.data?.sendBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Error when bug type does not match any of the enum types', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.sendBugReportMutation, { ...validBugReport, type: 'NOTVALID' });
      expect(response.body.data?.sendBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when bug message too short', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.sendBugReportMutation, { ...validBugReport, bugMessage: 'x'.repeat(constants.bugs.solvedMessageMinLength - 1) });
      expect(response.body.data?.sendBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.bug.bugMessageTooShortError);
    });

    it('Error when bug message too long', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.sendBugReportMutation, { ...validBugReport, bugMessage: 'x'.repeat(constants.bugs.bugMessageMaxLength + 1) });
      expect(response.body.data?.sendBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.bug.bugMessageTooLongError);
    });

    it('Error when bug message type not string', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.sendBugReportMutation, { ...validBugReport, bugMessage: 1 });
      expect(response.body.data?.sendBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when bug message not send', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.sendBugReportMutation, { ...validBugReport, bugMessage: null });
      expect(response.body.data?.sendBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when card id negative integer', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.sendBugReportMutation, { ...validBugReport, cardId: -1 });
      expect(response.body.data?.sendBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.negativeNumberTypeError);
    });

    it('Error when card id zero', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.sendBugReportMutation, { ...validBugReport, cardId: 0 });
      expect(response.body.data?.sendBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.negativeNumberTypeError);
    });

    it('Error when card id type not integer', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.sendBugReportMutation, { ...validBugReport, cardId: 'x' });
      expect(response.body.data?.sendBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Sending bug report works after authentication, all arguments according to validation rules', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.sendBugReportMutation, validBugReport);
      bugReportEvaluator(response.body.data.sendBugReport);
      expect(response.body.errors).toBeUndefined();
    });

    it('Sending bug report succesfull without card id', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.sendBugReportMutation, { type: validBugReport.type, bugMessage: validBugReport.bugMessage });
      bugReportEvaluator(response.body.data.sendBugReport);
      expect(response.body.errors).toBeUndefined();
    });
  });

  describe('Solving bug reports', () => {
    beforeAll(async () => { await setUpEnvironment(); });

    it('Solving bug report leads to auth error when not logged in', async () => {
      let response = await request(testUrl)
        .post('/')
        .send({ query: mutations.solveBugReportMutation, variables: bugReportToSolve });
      expect(response.body.data?.solveBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Unauthorized error when logged in but not admin', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonMemberAuthToken}`)
        .send({ query: mutations.solveBugReportMutation, variables: bugReportToSolve });

      expect(response.body.data?.solveBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.admin.noAdminRightsError);
    });

    it('Unauthorized error when admin but no write permission', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${adminAuthReadToken}`)
        .send({ query: mutations.solveBugReportMutation, variables: bugReportToSolve });

      expect(response.body.data?.solveBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.admin.noAdminWriteRights);
    });

    it('Error when write permission but bug id negative integer', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${adminAuthWriteToken}`)
        .send({ query: mutations.solveBugReportMutation, variables: {...bugReportToSolve, bugId: -1 } });

      expect(response.body.data?.solveBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.negativeNumberTypeError);
    });

    it('Error when write permission but bug id zero integer', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${adminAuthWriteToken}`)
        .send({ query: mutations.solveBugReportMutation, variables: {...bugReportToSolve, bugId: 0 } });

      expect(response.body.data?.solveBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.negativeNumberTypeError);
    });

    it('Error when write permission but bug id type not integer', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${adminAuthWriteToken}`)
        .send({ query: mutations.solveBugReportMutation, variables: {...bugReportToSolve, bugId: 'x' } });

      expect(response.body.data?.solveBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when bug solve message too short', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${adminAuthWriteToken}`)
        .send({ query: mutations.solveBugReportMutation, variables: {...bugReportToSolve, solvedMessage: 'x'.repeat(constants.bugs.solvedMessageMinLength - 1) } });

      expect(response.body.data?.solveBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.bug.bugSolveMessageTooShortError);
    });

    it('Error when bug solve message too short', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${adminAuthWriteToken}`)
        .send({ query: mutations.solveBugReportMutation, variables: {...bugReportToSolve, solvedMessage: 'x'.repeat(constants.bugs.solvedMessageMaxLength + 1) } });

      expect(response.body.data?.solveBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.bug.bugSolveMessageTooLongError);
    });

    it('Error when bug solve message not type string', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${adminAuthWriteToken}`)
        .send({ query: mutations.solveBugReportMutation, variables: {...bugReportToSolve, solvedMessage: 1 } });

      expect(response.body.data?.solveBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when solved not type boolean', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${adminAuthWriteToken}`)
        .send({ query: mutations.solveBugReportMutation, variables: {...bugReportToSolve, solved: 1 } });

      expect(response.body.data?.solveBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Solve bug report succesful when admin with write permission, all arguments according to validation rules', async () => {
      const response = await sendRequest(testUrl, adminAuthWriteToken, mutations.solveBugReportMutation, bugReportToSolve);
      bugReportEvaluator(response.body.data.solveBugReport);
      expect(response.body.errors).toBeUndefined();
    });

    it('Solve bug report possible with solved message omitted', async () => {
      const response = await sendRequest(testUrl, adminAuthWriteToken, mutations.solveBugReportMutation, { bugId: bugReportToSolve.bugId, solved: bugReportToSolve.solved });
      bugReportEvaluator(response.body.data.solveBugReport);
      expect(response.body.errors).toBeUndefined();
    });

    it('Solve bug report possible with solved boolean omitted', async () => {
      const response = await sendRequest(testUrl, adminAuthWriteToken, mutations.solveBugReportMutation, { bugId: bugReportToSolve.bugId, solvedMessage: bugReportToSolve.solvedMessage });
      bugReportEvaluator(response.body.data.solveBugReport);
      expect(response.body.errors).toBeUndefined();
    });
  });

  describe('Deleting bug reports', () => {
    beforeAll(async () => { await setUpEnvironment(); });

    it('Authentication error when trying to delete but not not logged in', async () => {
      const response = await sendRequest(testUrl, null, mutations.deleteBugReportMutation, { bugId: bugReportToSolve.bugId });
      expect(response.body.data?.deleteBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Unauthorized error when logged in but not admin', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.deleteBugReportMutation, { bugId: bugReportToSolve.bugId });
      expect(response.body.data?.deleteBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.admin.noAdminRightsError);
    });

    it('Unauthorized error when admin but no write permission', async () => {
      const response = await sendRequest(testUrl, adminAuthReadToken, mutations.deleteBugReportMutation, { bugId: bugReportToSolve.bugId });
      expect(response.body.data?.deleteBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.admin.noAdminWriteRights);
    });

    it('Error when write permission but bug id negative integer', async () => {
      const response = await sendRequest(testUrl, adminAuthWriteToken, mutations.deleteBugReportMutation, { bugId: -1 });
      expect(response.body.data?.deleteBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.negativeNumberTypeError);
    });

    it('Error when write permission but bug id zero integer', async () => {
      const response = await sendRequest(testUrl, adminAuthWriteToken, mutations.deleteBugReportMutation, { bugId: 0 });
      expect(response.body.data?.deleteBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.negativeNumberTypeError);
    });

    it('Error when write permission but bug id type not integer', async () => {
      const response = await sendRequest(testUrl, adminAuthWriteToken, mutations.deleteBugReportMutation, { bugId: 'x' });
      expect(response.body.data?.deleteBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when write permission but bug id not send', async () => {
      const response = await sendRequest(testUrl, adminAuthWriteToken, mutations.deleteBugReportMutation, null);
      expect(response.body.data?.deleteBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when write permission but bug with id not found', async () => {
      const response = await sendRequest(testUrl, adminAuthWriteToken, mutations.deleteBugReportMutation, { bugId: 9999 });
      expect(response.body.data?.deleteBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.bug.bugByIdNotFound);
    });

    it('Delete bug report succesfully when admin with write permisson', async () => {
      const response = await sendRequest(testUrl, adminAuthWriteToken, mutations.deleteBugReportMutation, { bugId: bugReportToSolve.bugId });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.deleteBugReport).toBeDefined();
      expect(response.body.data.deleteBugReport).toBe(bugReportToSolve.bugId);
    });
  });

  describe('Fetching bug reports', () => {
    beforeAll(async () => { await setUpEnvironment(); });

    it('Authentication error when trying to fetch bug reports but not not logged in', async () => {
      const response = await sendRequest(testUrl, null, queries.fetchAllBugReports, null);
      expect(response.body.data?.fetchAllBugReports).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Unauthorized error when logged in but not admin', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.fetchAllBugReports, null);
      expect(response.body.data?.fetchAllBugReports).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.admin.noAdminRightsError);
    });

    it('Access possible when admin but no write permission', async () => {
      const response = await sendRequest(testUrl, adminAuthReadToken, queries.fetchAllBugReports, null);
      response.body.data.fetchAllBugReports.forEach(bugReport => bugReportEvaluator(bugReport));
      expect(response.body.errors).toBeUndefined();
    });

    it('Access possible when admin with write permission', async () => {
      const response = await sendRequest(testUrl, adminAuthWriteToken, queries.fetchAllBugReports, null);
      response.body.data.fetchAllBugReports.forEach(bugReport => bugReportEvaluator(bugReport));
      expect(response.body.errors).toBeUndefined();
    });
  });

  describe('Fetching bug report by id', () => {
    beforeAll(async () => { await setUpEnvironment(); });

    it('Authentication error when trying to fetch bug report by id but not not logged in', async () => {
      const response = await sendRequest(testUrl, null, queries.fetchBugReportById, { bugId: bugReportToSolve.bugId });
      expect(response.body.data?.fetchBugReportById).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Unauthorized error when logged in but not admin', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.fetchBugReportById, { bugId: bugReportToSolve.bugId });
      expect(response.body.data?.fetchBugReportById).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.admin.noAdminRightsError);
    });

    it('Error when read permission but bug id negative integer', async () => {
      const response = await sendRequest(testUrl, adminAuthReadToken, queries.fetchBugReportById, { bugId: -1 });
      expect(response.body.data?.fetchBugReportById.id).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.negativeNumberTypeError);
    });

    it('Error when read permission but bug id zero integer', async () => {
      const response = await sendRequest(testUrl, adminAuthReadToken, queries.fetchBugReportById, { bugId: 0 });
      expect(response.body.data?.fetchBugReportById.id).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.negativeNumberTypeError);
    });

    it('Error when read permission but bug id type not integer', async () => {
      const response = await sendRequest(testUrl, adminAuthReadToken, queries.fetchBugReportById, { bugId: 'x' });
      expect(response.body.data?.fetchBugReportById.id).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when read permission but bug with id not found', async () => {
      const response = await sendRequest(testUrl, adminAuthReadToken, queries.fetchBugReportById, { bugId: 9999 });
      expect(response.body.data?.fetchBugReportById.id).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.bug.bugByIdNotFound);
    });

    it('Error when read permission but bug id not send', async () => {
      const response = await sendRequest(testUrl, adminAuthReadToken, queries.fetchBugReportById, null);
      expect(response.body.data?.fetchBugReportById.id).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Access possible when admin with read permission', async () => {
      const response = await sendRequest(testUrl, adminAuthReadToken, queries.fetchBugReportById, { bugId: bugReportToSolve.id });
      bugReportEvaluator(response.body.data.fetchBugReportById);
      expect(response.body.errors).toBeUndefined();
    });

    it('Access possible when admin with write permission', async () => {
      const response = await sendRequest(testUrl, adminAuthWriteToken, queries.fetchBugReportById, { bugId: bugReportToSolve.id });
      bugReportEvaluator(response.body.data.fetchBugReportById);
      expect(response.body.errors).toBeUndefined();
    });
  });

  describe('Fetching bug reports by type', () => {
    beforeAll(async () => { await setUpEnvironment(); });

    it('Authentication error when trying to fetch bug report by id but not not logged in', async () => {
      const response = await sendRequest(testUrl, null, queries.fetchBugReportsByType, { type: findTypeFirst });
      expect(response.body.data?.fetchBugReportsByType).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Unauthorized error when logged in but not admin', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.fetchBugReportsByType, { type: findTypeFirst });
      expect(response.body.data?.fetchBugReportsByType).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.admin.noAdminRightsError);
    });

    it('Error when read permission but bug type enum invalid', async () => {
      const response = await sendRequest(testUrl, adminAuthReadToken, queries.fetchBugReportsByType, { type: stringData.notValidEnum });
      expect(response.body.data?.fetchBugReportsByType).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when read permission but bug type wrong type', async () => {
      const response = await sendRequest(testUrl, adminAuthReadToken, queries.fetchBugReportsByType, { type: 1 });
      expect(response.body.data?.fetchBugReportsByType).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when read permission but bug type not send', async () => {
      const response = await sendRequest(testUrl, adminAuthReadToken, queries.fetchBugReportsByType, null);
      expect(response.body.data?.fetchBugReportsByType).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it(`Access possible when admin with read permission, searching type '${findTypeFirst}'`, async () => {
      const response = await sendRequest(testUrl, adminAuthReadToken, queries.fetchBugReportsByType, { type: findTypeFirst });
      response.body.data.fetchBugReportsByType.forEach(bugReport => bugReportEvaluator(bugReport));
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.fetchBugReportsByType.every(bug => bug.type === findTypeFirst)).toBe(true);
    });

    it(`Access possible when admin with write permission, searching type '${findTypeFirst}'`, async () => {
      const response = await sendRequest(testUrl, adminAuthWriteToken, queries.fetchBugReportsByType, { type: findTypeFirst });
      response.body.data.fetchBugReportsByType.forEach(bugReport => bugReportEvaluator(bugReport));
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.fetchBugReportsByType.every(bug => bug.type === findTypeFirst)).toBe(true);
    });

    it(`Access possible when admin with read permission, searching type '${findTypeSecond}'`, async () => {
      const response = await sendRequest(testUrl, adminAuthReadToken, queries.fetchBugReportsByType, { type: findTypeSecond });  
      response.body.data.fetchBugReportsByType.forEach(bugReport => bugReportEvaluator(bugReport));
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.fetchBugReportsByType.every(bug => bug.type === findTypeSecond)).toBe(true);
    });

    it(`Access possible when admin with write permission, searching type '${findTypeSecond}'`, async () => {
      const response = await sendRequest(testUrl, adminAuthWriteToken, queries.fetchBugReportsByType, { type: findTypeSecond });
      response.body.data.fetchBugReportsByType.forEach(bugReport => bugReportEvaluator(bugReport));
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.fetchBugReportsByType.every(bug => bug.type === findTypeSecond)).toBe(true);
    });
  });
});
