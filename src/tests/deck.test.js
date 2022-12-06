const { expect, describe, beforeAll, afterAll, it } = require('@jest/globals');
const request = require('supertest');
const { PORT } = require('../util/config');
const { connectToDatabase } = require('../database');
const { account } = require('./utils/constants'); 
const mutations = require('./utils/mutations');
const queries = require('./utils/queries');
const errors = require('../util/errors/errors');
const server = require('../util/server');
const constants = require('../util/constants');
const helpers = require('./utils/helper');

describe('Deck integration tests', () => {
  let testServer, testUrl, authToken;
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

    it('Create and log in to new account for tests', async () => {
      let response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: account });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.createAccount.email).toBe(account.email);
      expect(response.body.data.createAccount.username).toBe(account.username);
      expect(response.body.data.createAccount.languageId).toBe(account.languageId);
      expect(response.body.data.createAccount.id).toBeDefined();
      expect(response.body.data.createAccount.lastLogin).toBeDefined();
      expect(response.body.data.createAccount.createdAt).toBeDefined();
      expect(response.body.data.createAccount.updatedAt).toBeDefined();

      response = await request(testUrl)
        .post('/')
        .send({ query: mutations.loginMutation, variables: account });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.login.token).toBeDefined();
      expect(response.body.data.login.account.email).toBe(account.email);
      expect(response.body.data.login.account.username).toBe(account.username);
      expect(response.body.data.login.account.languageId).toBe(account.languageId);
      expect(response.body.data.login.account.id).toBeDefined();
      expect(response.body.data.login.account.lastLogin).toBeDefined();
      expect(response.body.data.login.account.createdAt).toBeDefined();
      expect(response.body.data.login.account.updatedAt).toBeDefined();
      authToken = response.body.data.login.token.value;
    });
  });

  describe('Fetching decks and cards', () => {

    it('Fetch decks leads to auth error when not logged in', async () => {
      let response = await request(testUrl)
        .post('/')
        .send({ query: queries.fetchDecksQuery});

      expect(response.body.data?.fetchDecks).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Fetch all available decks, 3 at the moment', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: queries.fetchDecksQuery});

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.fetchDecks.Decks).toBeDefined();
      expect(response.body.data.fetchDecks.Decks.length).toBe(3);
    });

    it('Fetch deck settings leads to auth error when not logged in', async () => {
      let response = await request(testUrl)
        .post('/')
        .send({ query: queries.fetchDeckSettings, variables: { deckId: 1 } });

      expect(response.body.data?.fecthDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Fetch deck setting for deck id 1, settings should be default, defined in constants', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: queries.fetchDeckSettings, variables: { deckId: 1 } });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.fecthDeckSettings).toBeDefined();
      expect(response.body.data.fecthDeckSettings.deckId).toBe(1);
      expect(response.body.data.fecthDeckSettings.favorite).toBe(false);
      expect(response.body.data.fecthDeckSettings.reviewInterval).toBe(constants.defaultInterval);
      expect(response.body.data.fecthDeckSettings.reviewsPerDay).toBe(constants.defaultReviewPerDay);
      expect(response.body.data.fecthDeckSettings.newCardsPerDay).toBe(constants.defaultNewPerDay);
    });
  });
});
