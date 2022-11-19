const { expect, describe, beforeAll, afterAll, it } = require('@jest/globals');
const request = require('supertest');
const { PORT } = require('../util/config');
const { connectToDatabase } = require('../database');
const { account, adminReadRights, adminWriteRights, validBugReport, solveBugReport } = require('./utils/constants'); 
const mutations = require('./utils/mutations');
const errors = require('../util/errors/errors');
const server = require('../util/server');
const helpers = require('./utils/helper');

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

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.createAccount).toBeDefined();

      response = await request(testUrl)
        .post('/')
        .send({ query: mutations.loginMutation, variables: account });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.login.token).toBeDefined();
      nonAdminAuthToken = response.body.data.login.token.value;

      response = await request(testUrl)
        .post('/')
        .send({ query: mutations.loginMutation, variables: adminReadRights });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.login.token).toBeDefined();
      adminAuthReadToken = response.body.data.login.token.value;

      response = await request(testUrl)
        .post('/')
        .send({ query: mutations.loginMutation, variables: adminWriteRights });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.login.token).toBeDefined();
      adminAuthWriteToken = response.body.data.login.token.value;
    });
  });

  describe('Creating a bug report', () => {

    it('Sending bug report leads to auth error when not logged in', async () => {
      let response = await request(testUrl)
        .post('/')
        .send({ query: mutations.sendBugReportMutation, variables: validBugReport });

      expect(response.body.data?.fetchDecks).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });


    it('Sending bug report works after authentication', async () => {
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
  });

  describe('Solving bug reports', () => {

    it('Solving bug report leads to auth error when not logged in', async () => {
      let response = await request(testUrl)
        .post('/')
        .send({ query: mutations.solveBugReportMutation, variables: bugReportToSolve });

      expect(response.body.data?.solveBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Solving bug report leads to unauthorixed error when logged in but not admin', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: mutations.solveBugReportMutation, variables: bugReportToSolve });

      expect(response.body.data?.solveBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.admin.noAdminRightsError);
    });


    it('Solving bug report leads to unauthorixed error when admin but no write permission', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${adminAuthReadToken}`)
        .send({ query: mutations.solveBugReportMutation, variables: bugReportToSolve });

      expect(response.body.data?.solveBugReport).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.admin.noAdminWriteRights);
    });

    it('Solving bug report succesful when admin with write permission', async () => {
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
  });
});
