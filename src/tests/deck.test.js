const { expect, describe, beforeAll, afterAll, it } = require('@jest/globals');
const request = require('supertest');
const { PORT } = require('../util/config');
const { connectToDatabase } = require('../database');
const { account, adminReadRights, adminWriteRights } = require('./utils/constants'); 
const mutations = require('./utils/mutations');
const queries = require('./utils/queries');
const errors = require('../util/errors/errors');
const server = require('../util/server');
const constants = require('../util/constants');
const helpers = require('./utils/helper');

describe('Deck integration tests', () => {
  // eslint-disable-next-line no-unused-vars
  let testServer, testUrl, nonAdminAuthToken, adminAuthReadToken, adminAuthWriteToken, nonAdminAccount;
  // before the tests spin up an Apollo Server
  beforeAll(async () => {
    await connectToDatabase();
    await helpers.resetDatabaseEntries('deck');
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

      nonAdminAccount = response.body.data.login.account;
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

  describe('Fetching decks', () => {

    it('Fetch decks leads to authentication error when not logged in', async () => {
      let response = await request(testUrl)
        .post('/')
        .send({ query: queries.fetchDecks});

      expect(response.body.data?.fetchDecks).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Fetch all available decks, 3 at the moment', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: queries.fetchDecks});

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.fetchDecks.Decks).toBeDefined();
      expect(response.body.data.fetchDecks.Decks.length).toBe(3);
    });
  });

  describe('Fetching deck settings', () => {

    it('Fetch deck settings leads to auth error when not logged in', async () => {
      let response = await request(testUrl)
        .post('/')
        .send({ query: queries.fetchDeckSettings, variables: { deckId: 1 } });

      expect(response.body.data?.fecthDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Error when authenticated but deck id negative integer', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: queries.fetchDeckSettings, variables: { deckId: -1 } });

      expect(response.body.data?.fecthDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.negativeNumberTypeError);
    });

    it('Error when authenticated but deck id zero integer', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: queries.fetchDeckSettings, variables: { deckId: 0 } });

      expect(response.body.data?.fecthDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.negativeNumberTypeError);
    });
    
    it('Error when authenticated but deck id wrong type (string)', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: queries.fetchDeckSettings, variables: { deckId: '1' } });

      expect(response.body.data?.fecthDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when authenticated but deck id wrong type (float)', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: queries.fetchDeckSettings, variables: { deckId: 1.01 } });

      expect(response.body.data?.fecthDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when authenticated but deck id not send', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: queries.fetchDeckSettings });

      expect(response.body.data?.fecthDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when authenticated but non-existing deck id', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: queries.fetchDeckSettings, variables: { deckId: 9999 } });

      expect(response.body.data?.fecthDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.nonExistingDeckError);
    });

    it('Fetch deck setting for deck id 1, settings should be default for initial fetch, defined in constants', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: queries.fetchDeckSettings, variables: { deckId: 1 } });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.fecthDeckSettings).toBeDefined();
      expect(response.body.data.fecthDeckSettings.accountId).toBe(parseInt(nonAdminAccount.id));
      expect(response.body.data.fecthDeckSettings.deckId).toBe(1);
      expect(response.body.data.fecthDeckSettings.favorite).toBe(false);
      expect(response.body.data.fecthDeckSettings.reviewInterval).toBe(constants.defaultInterval);
      expect(response.body.data.fecthDeckSettings.reviewsPerDay).toBe(constants.defaultReviewPerDay);
      expect(response.body.data.fecthDeckSettings.newCardsPerDay).toBe(constants.defaultNewPerDay);
      expect(response.body.data.fecthDeckSettings.createdAt).toBeDefined();
      expect(response.body.data.fecthDeckSettings.updatedAt).toBeDefined();
    });
  });

});
