const { expect, describe, beforeAll, afterAll, it } = require('@jest/globals');
const request = require('supertest');
const { PORT } = require('../util/config');
const { connectToDatabase } = require('../database');
const { account, adminReadRights, adminWriteRights, validBugReport, solveBugReport, stringData } = require('./utils/constants'); 
const mutations = require('./utils/mutations');
const errors = require('../util/errors/errors');
const server = require('../util/server');
const helpers = require('./utils/helper');
const constants = require('../util/constants');
const queries = require('./utils/queries');

describe('Bug integration tests', () => {
  let testServer, testUrl, nonAdminAuthToken, adminAuthReadToken, adminAuthWriteToken, bugReportToSolve, bugSubmitterId;
  // before the tests spin up an Apollo Server
  beforeAll(async () => {
    await connectToDatabase();
    await helpers.resetDatabaseEntries('bug');
    const serverInfo = await server.listen({ port: PORT });
    testServer = serverInfo.server;
    testUrl = serverInfo.url;
  });

  // after the tests stop the server
  afterAll(async () => {
    await testServer?.close();
  });

  describe('Setup test environment', () => {

    it('Server should respond 200 ok to health check', async () => {
      const response = await request(`${testUrl}.well-known/apollo/server-health`)
        .post('/')
        .send();
  
      expect(response.body.status).toBeDefined();
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('pass');
    });

    it('Fetch tokens for accounts and admins', async () => {

      let response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: account });

      response = await request(testUrl)
        .post('/')
        .send({ query: mutations.loginMutation, variables: account });

      nonAdminAuthToken = response.body.data.login.token.value;

      response = await request(testUrl)
        .post('/')
        .send({ query: mutations.loginMutation, variables: adminReadRights });

      adminAuthReadToken = response.body.data.login.token.value;

      response = await request(testUrl)
        .post('/')
        .send({ query: mutations.loginMutation, variables: adminWriteRights });

      adminAuthWriteToken = response.body.data.login.token.value;
    });
  });

  describe('Send a bug report', () => {

    it('Authentication error when not logged in', async () => {
      let response = await request(testUrl)
        .post('/')
        .send({ query: mutations.sendBugReportMutation, variables: validBugReport });

      expect(response.body.data?.sendBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Error when bug type does not match any of the enum types', async () => {
      const invalidTypeBugReport = { ...validBugReport, type: 'NOTVALID' };
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: mutations.sendBugReportMutation, variables: invalidTypeBugReport });

      expect(response.body.data?.sendBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when bug message too short', async () => {
      const invalidTypeBugReport = { ...validBugReport, bugMessage: 'x'.repeat(constants.bugs.solvedMessageMinLength - 1) };
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: mutations.sendBugReportMutation, variables: invalidTypeBugReport });

      expect(response.body.data?.sendBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.bug.bugMessageTooShortError);
    });

    it('Error when bug message too long', async () => {
      const invalidTypeBugReport = { ...validBugReport, bugMessage: 'x'.repeat(constants.bugs.bugMessageMaxLength + 1) };
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: mutations.sendBugReportMutation, variables: invalidTypeBugReport });

      expect(response.body.data?.sendBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.bug.bugMessageTooLongError);
    });

    it('Error when bug message type not string', async () => {
      const invalidTypeBugReport = { ...validBugReport, bugMessage: 1 };
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: mutations.sendBugReportMutation, variables: invalidTypeBugReport });

      expect(response.body.data?.sendBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when bug message not send', async () => {
      const invalidTypeBugReport = { ...validBugReport, bugMessage: null };
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: mutations.sendBugReportMutation, variables: invalidTypeBugReport });

      expect(response.body.data?.sendBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when card id negative integer', async () => {
      const invalidTypeBugReport = { ...validBugReport, cardId: -1 };
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: mutations.sendBugReportMutation, variables: invalidTypeBugReport });

      expect(response.body.data?.sendBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.negativeNumberTypeError);
    });

    it('Error when card id zero', async () => {
      const invalidTypeBugReport = { ...validBugReport, cardId: 0 };
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: mutations.sendBugReportMutation, variables: invalidTypeBugReport });

      expect(response.body.data?.sendBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.negativeNumberTypeError);
    });

    it('Error when card id type not integer', async () => {
      const invalidTypeBugReport = { ...validBugReport, cardId: 'x' };
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: mutations.sendBugReportMutation, variables: invalidTypeBugReport });

      expect(response.body.data?.sendBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Sending bug report works after authentication, all arguments according to validation rules', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: mutations.sendBugReportMutation, variables: validBugReport });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.sendBugReport.id).toBeDefined();
      expect(response.body.data.sendBugReport.accountId).toBeDefined();
      expect(response.body.data.sendBugReport.createdAt).toBeDefined();
      expect(response.body.data.sendBugReport.updatedAt).toBeDefined();
      expect(response.body.data.sendBugReport.solvedMessage).toBe(null);
      expect(response.body.data.sendBugReport.solved).toBeFalsy();
      expect(response.body.data.sendBugReport.cardId).toBe(validBugReport.cardId);
      expect(response.body.data.sendBugReport.type).toBe(validBugReport.type);
      expect(response.body.data.sendBugReport.bugMessage).toBe(validBugReport.bugMessage);
      bugReportToSolve = { ...solveBugReport, bugId: parseInt(response.body.data.sendBugReport.id) };
      bugSubmitterId = parseInt(response.body.data.sendBugReport.accountId);
    });

    it('Sending bug report succesfull without card id', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: mutations.sendBugReportMutation, variables: { type: validBugReport.type, bugMessage: validBugReport.bugMessage } });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.sendBugReport.id).toBeDefined();
      expect(response.body.data.sendBugReport.accountId).toBeDefined();
      expect(response.body.data.sendBugReport.createdAt).toBeDefined();
      expect(response.body.data.sendBugReport.updatedAt).toBeDefined();
      expect(response.body.data.sendBugReport.solvedMessage).toBe(null);
      expect(response.body.data.sendBugReport.solved).toBeFalsy();
      expect(response.body.data.sendBugReport.cardId).toBe(null);
      expect(response.body.data.sendBugReport.type).toBe(validBugReport.type);
      expect(response.body.data.sendBugReport.bugMessage).toBe(validBugReport.bugMessage);
    });
  });

  describe('Solving bug reports', () => {

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
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
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
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${adminAuthWriteToken}`)
        .send({ query: mutations.solveBugReportMutation, variables: bugReportToSolve });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.solveBugReport.id).toBeDefined();
      expect(response.body.data.solveBugReport.accountId).toBe(bugSubmitterId);
      expect(response.body.data.solveBugReport.bugMessage).toBe(validBugReport.bugMessage);
      expect(response.body.data.solveBugReport.cardId).toBe(validBugReport.cardId);
      expect(response.body.data.solveBugReport.createdAt).toBeDefined();
      expect(response.body.data.solveBugReport.solved).toBeTruthy();
      expect(response.body.data.solveBugReport.solvedMessage).toBe(bugReportToSolve.solvedMessage);
      expect(response.body.data.solveBugReport.type).toBe(validBugReport.type);
      expect(response.body.data.solveBugReport.updatedAt).toBeDefined();
    });

    it('Solve bug report possible with solved message omitted', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${adminAuthWriteToken}`)
        .send({ query: mutations.solveBugReportMutation, variables: { bugId: bugReportToSolve.bugId, solved: bugReportToSolve.solved } });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.solveBugReport.id).toBeDefined();
      expect(response.body.data.solveBugReport.accountId).toBe(bugSubmitterId);
      expect(response.body.data.solveBugReport.bugMessage).toBe(validBugReport.bugMessage);
      expect(response.body.data.solveBugReport.cardId).toBe(validBugReport.cardId);
      expect(response.body.data.solveBugReport.createdAt).toBeDefined();
      expect(response.body.data.solveBugReport.solved).toBeTruthy();
      expect(response.body.data.solveBugReport.solvedMessage).toBe(null);
      expect(response.body.data.solveBugReport.type).toBe(validBugReport.type);
      expect(response.body.data.solveBugReport.updatedAt).toBeDefined();
    });

    it('Solve bug report possible with solved boolean omitted', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${adminAuthWriteToken}`)
        .send({ query: mutations.solveBugReportMutation, variables: { bugId: bugReportToSolve.bugId, solvedMessage: bugReportToSolve.solvedMessage } });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.solveBugReport.id).toBeDefined();
      expect(response.body.data.solveBugReport.accountId).toBe(bugSubmitterId);
      expect(response.body.data.solveBugReport.bugMessage).toBe(validBugReport.bugMessage);
      expect(response.body.data.solveBugReport.cardId).toBe(validBugReport.cardId);
      expect(response.body.data.solveBugReport.createdAt).toBeDefined();
      expect(response.body.data.solveBugReport.solved).toBeFalsy();
      expect(response.body.data.solveBugReport.solvedMessage).toBe(bugReportToSolve.solvedMessage);
      expect(response.body.data.solveBugReport.type).toBe(validBugReport.type);
      expect(response.body.data.solveBugReport.updatedAt).toBeDefined();
    });
  });

  describe('Deleting bug reports', () => {

    it('Authentication error when trying to delete but not not logged in', async () => {
      let response = await request(testUrl)
        .post('/')
        .send({ query: mutations.deleteBugReportMutation, variables: { bugId: bugReportToSolve.bugId } });

      expect(response.body.data?.deleteBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Unauthorized error when logged in but not admin', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: mutations.deleteBugReportMutation, variables: { bugId: bugReportToSolve.bugId } });

      expect(response.body.data?.deleteBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.admin.noAdminRightsError);
    });

    it('Unauthorized error when admin but no write permission', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${adminAuthReadToken}`)
        .send({ query: mutations.deleteBugReportMutation, variables: { bugId: bugReportToSolve.bugId } });

      expect(response.body.data?.deleteBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.admin.noAdminWriteRights);
    });

    it('Error when write permission but bug id negative integer', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${adminAuthWriteToken}`)
        .send({ query: mutations.deleteBugReportMutation, variables: { bugId: -1 } });

      expect(response.body.data?.deleteBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.negativeNumberTypeError);
    });

    it('Error when write permission but bug id zero integer', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${adminAuthWriteToken}`)
        .send({ query: mutations.deleteBugReportMutation, variables: { bugId: 0 } });

      expect(response.body.data?.deleteBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.negativeNumberTypeError);
    });

    it('Error when write permission but bug id type not integer', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${adminAuthWriteToken}`)
        .send({ query: mutations.deleteBugReportMutation, variables: { bugId: 'x' } });

      expect(response.body.data?.deleteBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when write permission but bug id not send', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${adminAuthWriteToken}`)
        .send({ query: mutations.deleteBugReportMutation });

      expect(response.body.data?.deleteBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when write permission but bug with id not found', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${adminAuthWriteToken}`)
        .send({ query: mutations.deleteBugReportMutation, variables: { bugId: 9999 } });

      expect(response.body.data?.deleteBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.bug.bugByIdNotFound);
    });

    it('Delete bug report succesfully when admin with write permisson', async () => {
      const newBugReport = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: mutations.sendBugReportMutation, variables: { type: validBugReport.type, bugMessage: validBugReport.bugMessage } });

      expect(newBugReport.body.errors).toBeUndefined();
      expect(newBugReport.body.data.sendBugReport.id).toBeDefined();

      let deleteId = parseInt(newBugReport.body.data.sendBugReport.id);
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${adminAuthWriteToken}`)
        .send({ query: mutations.deleteBugReportMutation, variables: { bugId: deleteId } });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data?.deleteBugReport).toBeDefined();
      expect(response.body.data?.deleteBugReport).toBe(deleteId);
    });
  });

  describe('Fetching bug reports', () => {

    it('Authentication error when trying to fetch bug reports but not not logged in', async () => {
      let response = await request(testUrl)
        .post('/')
        .send({ query: queries.fetchAllBugReports });

      expect(response.body.data?.fetchAllBugReports).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Unauthorized error when logged in but not admin', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: queries.fetchAllBugReports });

      expect(response.body.data?.fetchAllBugReports).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.admin.noAdminRightsError);
    });

    it('Access possible when admin but no write permission', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${adminAuthReadToken}`)
        .send({ query: queries.fetchAllBugReports });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.fetchAllBugReports[0].id).toBeDefined();
      expect(response.body.data.fetchAllBugReports[0].accountId).toBeDefined();
      expect(response.body.data.fetchAllBugReports[0].cardId).toBeDefined();
      expect(constants.bugs.bugTypes).toContain(response.body.data.fetchAllBugReports[0].type);
      expect(response.body.data.fetchAllBugReports[0].bugMessage).toBeDefined();
      expect(response.body.data.fetchAllBugReports[0].solvedMessage).toBeDefined();
      expect(response.body.data.fetchAllBugReports[0].solved).toBeDefined();
      expect(response.body.data.fetchAllBugReports[0].createdAt).toBeDefined();
      expect(response.body.data.fetchAllBugReports[0].updatedAt).toBeDefined();

      expect(response.body.data.fetchAllBugReports[1].id).toBeDefined();
      expect(response.body.data.fetchAllBugReports[1].accountId).toBeDefined();
      expect(response.body.data.fetchAllBugReports[1].cardId).toBeDefined();
      expect(constants.bugs.bugTypes).toContain(response.body.data.fetchAllBugReports[1].type);
      expect(response.body.data.fetchAllBugReports[1].bugMessage).toBeDefined();
      expect(response.body.data.fetchAllBugReports[1].solvedMessage).toBeDefined();
      expect(response.body.data.fetchAllBugReports[1].solved).toBeDefined();
      expect(response.body.data.fetchAllBugReports[1].createdAt).toBeDefined();
      expect(response.body.data.fetchAllBugReports[1].updatedAt).toBeDefined();
    });

    it('Access possible when admin with write permission', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${adminAuthWriteToken}`)
        .send({ query: queries.fetchAllBugReports });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.fetchAllBugReports[0].id).toBeDefined();
      expect(response.body.data.fetchAllBugReports[0].accountId).toBeDefined();
      expect(response.body.data.fetchAllBugReports[0].cardId).toBeDefined();
      expect(constants.bugs.bugTypes).toContain(response.body.data.fetchAllBugReports[0].type);
      expect(response.body.data.fetchAllBugReports[0].bugMessage).toBeDefined();
      expect(response.body.data.fetchAllBugReports[0].solvedMessage).toBeDefined();
      expect(response.body.data.fetchAllBugReports[0].solved).toBeDefined();
      expect(response.body.data.fetchAllBugReports[0].createdAt).toBeDefined();
      expect(response.body.data.fetchAllBugReports[0].updatedAt).toBeDefined();
  
      expect(response.body.data.fetchAllBugReports[1].id).toBeDefined();
      expect(response.body.data.fetchAllBugReports[1].accountId).toBeDefined();
      expect(response.body.data.fetchAllBugReports[1].cardId).toBeDefined();
      expect(constants.bugs.bugTypes).toContain(response.body.data.fetchAllBugReports[1].type);
      expect(response.body.data.fetchAllBugReports[1].bugMessage).toBeDefined();
      expect(response.body.data.fetchAllBugReports[1].solvedMessage).toBeDefined();
      expect(response.body.data.fetchAllBugReports[1].solved).toBeDefined();
      expect(response.body.data.fetchAllBugReports[1].createdAt).toBeDefined();
      expect(response.body.data.fetchAllBugReports[1].updatedAt).toBeDefined();
    });
  });

  describe('Fetching bug report by id', () => {
    let searchForBug, searchForBugId;

    it('Authentication error when trying to fetch bug report by id but not not logged in', async () => {
      // Fetch all reports first, and take the first bug for testing
      let bugReports = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${adminAuthReadToken}`)
        .send({ query: queries.fetchAllBugReports });

      searchForBug = bugReports.body.data.fetchAllBugReports[0];
      searchForBugId = parseInt(searchForBug.id);

      let response = await request(testUrl)
        .post('/')
        .send({ query: queries.fetchBugReportById, variables: { bugId: searchForBugId } });

      expect(response.body.data?.fetchBugReportById).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Unauthorized error when logged in but not admin', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: queries.fetchBugReportById, variables: { bugId: searchForBugId } });

      expect(response.body.data?.fetchBugReportById).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.admin.noAdminRightsError);
    });

    it('Error when read permission but bug id negative integer', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${adminAuthReadToken}`)
        .send({ query: queries.fetchBugReportById, variables: { bugId: -1 } });

      expect(response.body.data?.fetchBugReportById.id).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.negativeNumberTypeError);
    });

    it('Error when read permission but bug id zero integer', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${adminAuthReadToken}`)
        .send({ query: queries.fetchBugReportById, variables: { bugId: 0 } });

      expect(response.body.data?.fetchBugReportById.id).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.negativeNumberTypeError);
    });

    it('Error when write permission but bug id type not integer', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${adminAuthReadToken}`)
        .send({ query: queries.fetchBugReportById, variables: { bugId: 'x' } });

      expect(response.body.data?.fetchBugReportById.id).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when write permission but bug with id not found', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${adminAuthReadToken}`)
        .send({ query: queries.fetchBugReportById, variables: { bugId: 9999 } });

      expect(response.body.data?.fetchBugReportById.id).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.bug.bugByIdNotFound);
    });

    it('Error when write permission but bug id not send', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${adminAuthReadToken}`)
        .send({ query: queries.fetchBugReportById });

      expect(response.body.data?.fetchBugReportById.id).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Access possible when admin with read permission', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${adminAuthReadToken}`)
        .send({ query: queries.fetchBugReportById, variables: { bugId: searchForBugId } });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.fetchBugReportById.id).toBe(searchForBug.id);
      expect(response.body.data.fetchBugReportById.accountId).toBe(searchForBug.accountId);
      expect(response.body.data.fetchBugReportById.cardId).toBe(searchForBug.cardId);
      expect(response.body.data.fetchBugReportById.type).toBe(searchForBug.type);
      expect(response.body.data.fetchBugReportById.bugMessage).toBe(searchForBug.bugMessage);
      expect(response.body.data.fetchBugReportById.solvedMessage).toBe(searchForBug.solvedMessage);
      expect(response.body.data.fetchBugReportById.solved).toBe(searchForBug.solved);
      expect(response.body.data.fetchBugReportById.createdAt).toBe(searchForBug.createdAt);
      expect(response.body.data.fetchBugReportById.updatedAt).toBe(searchForBug.updatedAt);
    });

    it('Access possible when admin with write permission', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${adminAuthWriteToken}`)
        .send({ query: queries.fetchBugReportById, variables: { bugId: searchForBugId } });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.fetchBugReportById.id).toBe(searchForBug.id);
      expect(response.body.data.fetchBugReportById.accountId).toBe(searchForBug.accountId);
      expect(response.body.data.fetchBugReportById.cardId).toBe(searchForBug.cardId);
      expect(response.body.data.fetchBugReportById.type).toBe(searchForBug.type);
      expect(response.body.data.fetchBugReportById.bugMessage).toBe(searchForBug.bugMessage);
      expect(response.body.data.fetchBugReportById.solvedMessage).toBe(searchForBug.solvedMessage);
      expect(response.body.data.fetchBugReportById.solved).toBe(searchForBug.solved);
      expect(response.body.data.fetchBugReportById.createdAt).toBe(searchForBug.createdAt);
      expect(response.body.data.fetchBugReportById.updatedAt).toBe(searchForBug.updatedAt);
    });
  });

  describe('Fetching bug reports by type', () => {
    let findTypeFirst = 'FUNCTIONALITY', findTypeSecond = 'UI';
    it('Authentication error when trying to fetch bug report by id but not not logged in', async () => {
      let response = await request(testUrl)
        .post('/')
        .send({ query: queries.fetchBugReportsByType, variables: { type: findTypeFirst } });

      expect(response.body.data?.fetchBugReportsByType).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Unauthorized error when logged in but not admin', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: queries.fetchBugReportsByType, variables: { type: findTypeFirst } });

      expect(response.body.data?.fetchBugReportsByType).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.admin.noAdminRightsError);
    });

    it('Error when read permission but bug type enum invalid', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${adminAuthReadToken}`)
        .send({ query: queries.fetchBugReportsByType, variables: { type: stringData.notValidEnum } });

      expect(response.body.data?.fetchBugReportsByType).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when read permission but bug type wrong type', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${adminAuthReadToken}`)
        .send({ query: queries.fetchBugReportsByType, variables: { type: 1 } });

      expect(response.body.data?.fetchBugReportsByType).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when read permission but bug type not send', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${adminAuthReadToken}`)
        .send({ query: queries.fetchBugReportsByType });

      expect(response.body.data?.fetchBugReportsByType).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it(`Access possible when admin with read permission, searching type '${findTypeFirst}'`, async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${adminAuthReadToken}`)
        .send({ query: queries.fetchBugReportsByType, variables: { type: findTypeFirst } });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.fetchBugReportsByType).toBeDefined();

      // Check that all relevant field defined
      expect(response.body.data.fetchBugReportsByType[0].id).toBeDefined();
      expect(response.body.data.fetchBugReportsByType[0].accountId).toBeDefined();
      expect(response.body.data.fetchBugReportsByType[0].cardId).toBeDefined();
      expect(response.body.data.fetchBugReportsByType[0].type).toBeDefined();
      expect(response.body.data.fetchBugReportsByType[0].bugMessage).toBeDefined();
      expect(response.body.data.fetchBugReportsByType[0].solvedMessage).toBeDefined();
      expect(response.body.data.fetchBugReportsByType[0].solved).toBeDefined();
      expect(response.body.data.fetchBugReportsByType[0].createdAt).toBeDefined();
      expect(response.body.data.fetchBugReportsByType[0].updatedAt).toBeDefined();

      // Check that all bugs have correct type
      const result = response.body.data.fetchBugReportsByType.every(bug => bug.type === findTypeFirst);
      expect(result).toBe(true);
    });

    it(`Access possible when admin with write permission, searching type '${findTypeFirst}'`, async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${adminAuthWriteToken}`)
        .send({ query: queries.fetchBugReportsByType, variables: { type: findTypeFirst } });

      expect(response.body.errors).toBeUndefined();

      // Check that all relevant field defined
      expect(response.body.data.fetchBugReportsByType[0].id).toBeDefined();
      expect(response.body.data.fetchBugReportsByType[0].accountId).toBeDefined();
      expect(response.body.data.fetchBugReportsByType[0].cardId).toBeDefined();
      expect(response.body.data.fetchBugReportsByType[0].type).toBeDefined();
      expect(response.body.data.fetchBugReportsByType[0].bugMessage).toBeDefined();
      expect(response.body.data.fetchBugReportsByType[0].solvedMessage).toBeDefined();
      expect(response.body.data.fetchBugReportsByType[0].solved).toBeDefined();
      expect(response.body.data.fetchBugReportsByType[0].createdAt).toBeDefined();
      expect(response.body.data.fetchBugReportsByType[0].updatedAt).toBeDefined();

      expect(response.body.data.fetchBugReportsByType).toBeDefined();
      // Check that all bugs have correct type
      const result = response.body.data.fetchBugReportsByType.every(bug => bug.type === findTypeFirst);
      expect(result).toBe(true);
    });

    it(`Access possible when admin with read permission, searching type '${findTypeSecond}'`, async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${adminAuthReadToken}`)
        .send({ query: queries.fetchBugReportsByType, variables: { type: findTypeSecond } });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.fetchBugReportsByType).toBeDefined();

      // Check that all relevant field defined
      expect(response.body.data.fetchBugReportsByType[0].id).toBeDefined();
      expect(response.body.data.fetchBugReportsByType[0].accountId).toBeDefined();
      expect(response.body.data.fetchBugReportsByType[0].cardId).toBeDefined();
      expect(response.body.data.fetchBugReportsByType[0].type).toBeDefined();
      expect(response.body.data.fetchBugReportsByType[0].bugMessage).toBeDefined();
      expect(response.body.data.fetchBugReportsByType[0].solvedMessage).toBeDefined();
      expect(response.body.data.fetchBugReportsByType[0].solved).toBeDefined();
      expect(response.body.data.fetchBugReportsByType[0].createdAt).toBeDefined();
      expect(response.body.data.fetchBugReportsByType[0].updatedAt).toBeDefined();

      // Check that all bugs have correct type
      const result = response.body.data.fetchBugReportsByType.every(bug => bug.type === findTypeSecond);
      expect(result).toBe(true);
    });

    it(`Access possible when admin with write permission, searching type '${findTypeSecond}'`, async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${adminAuthWriteToken}`)
        .send({ query: queries.fetchBugReportsByType, variables: { type: findTypeSecond } });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.fetchBugReportsByType).toBeDefined();

      // Check that all relevant field defined
      expect(response.body.data.fetchBugReportsByType[0].id).toBeDefined();
      expect(response.body.data.fetchBugReportsByType[0].accountId).toBeDefined();
      expect(response.body.data.fetchBugReportsByType[0].cardId).toBeDefined();
      expect(response.body.data.fetchBugReportsByType[0].type).toBeDefined();
      expect(response.body.data.fetchBugReportsByType[0].bugMessage).toBeDefined();
      expect(response.body.data.fetchBugReportsByType[0].solvedMessage).toBeDefined();
      expect(response.body.data.fetchBugReportsByType[0].solved).toBeDefined();
      expect(response.body.data.fetchBugReportsByType[0].createdAt).toBeDefined();
      expect(response.body.data.fetchBugReportsByType[0].updatedAt).toBeDefined();

      // Check that all bugs have correct type
      const result = response.body.data.fetchBugReportsByType.every(bug => bug.type === findTypeSecond);
      expect(result).toBe(true);
    });
  });
});
