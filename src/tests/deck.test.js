const { expect, describe, beforeAll, afterAll, it } = require('@jest/globals');
const request = require('supertest');
const { PORT } = require('../util/config');
const { connectToDatabase } = require('../database');
const { account, nonMemberAccount, adminReadRights, adminWriteRights, deckSettings } = require('./utils/constants'); 
const mutations = require('./utils/mutations');
const queries = require('./utils/queries');
const errors = require('../util/errors/errors');
const server = require('../util/server');
const constants = require('../util/constants');
const helpers = require('./utils/helper');
const sendRequest = require('./utils/request');

describe('Deckintegration tests', () => {
  // eslint-disable-next-line no-unused-vars
  let testServer, testUrl, originalDeckSettings, newDeckSettings, memberAuthToken, adminAuthReadToken, adminAuthWriteToken, nonMemberAuthToken, memberAcc, nonMemberAcc, adminReadAcc, adminWriteAcc;
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
      helpers.healthCheck(testUrl);
    });

    it('Fetch tokens for accounts and admins', async () => {
      [ memberAuthToken, memberAcc ] = await helpers.getToken(testUrl, account);
      [ nonMemberAuthToken, nonMemberAcc ] = await helpers.getToken(testUrl, nonMemberAccount);
      [ adminAuthReadToken, adminReadAcc ] = await helpers.getToken(testUrl, adminReadRights);
      [ adminAuthWriteToken, adminWriteAcc ] = await helpers.getToken(testUrl, adminWriteRights);
    });
  });

  describe('Fetching decks', () => {

    it('Fetch decks leads to authentication error when not logged in', async () => {
      const response = await sendRequest(testUrl, null, queries.decks, null);
      expect(response.body.data?.decks).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Fetch all available decks, 3 at the moment', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.decks, null);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.decks).toBeDefined();
      expect(response.body.data.decks.length).toBe(3);
      expect(response.body.data.decks[0].id).toBeDefined();
      expect(response.body.data.decks[0].deckName).toBeDefined();
      expect(response.body.data.decks[0].type).toBeDefined();
      expect(response.body.data.decks[0].subscriberOnly).toBeDefined();
      expect(response.body.data.decks[0].languageId).toBeDefined();
      expect(response.body.data.decks[0].active).toBeDefined();
      expect(response.body.data.decks[0].createdAt).toBeDefined();
      expect(response.body.data.decks[0].updatedAt).toBeDefined();
      expect(response.body.data.decks[0].deck_translations).toBeDefined();
    });
  });

  describe('Fetching deck settings', () => {

    it('Fetch deck settings leads to auth error when not logged in', async () => {
      const response = await sendRequest(testUrl, null, queries.deckSettings, { deckId: 1 });
      expect(response.body.data?.deckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Error when authenticated but deck id negative integer', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.deckSettings, { deckId: -1 });
      expect(response.body.data?.deckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.negativeNumberTypeError);
    });

    it('Error when authenticated but deck id zero integer', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.deckSettings, { deckId: 0 });
      expect(response.body.data?.deckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.negativeNumberTypeError);
    });
    
    it('Error when authenticated but deck id wrong type (string)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.deckSettings, { deckId: '1' });
      expect(response.body.data?.deckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when authenticated but deck id wrong type (float)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.deckSettings, { deckId: 1.01 });
      expect(response.body.data?.deckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when authenticated but deck id not send', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.deckSettings, null);
      expect(response.body.data?.deckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when authenticated but non-existing deck id', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.deckSettings, { deckId: 9999 });
      expect(response.body.data?.deckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.nonExistingDeckError);
    });

    it('Fetch deck setting for deck id 1, settings should be default for initial fetch, defined in constants', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.deckSettings, { deckId: 1 });
      originalDeckSettings = response.body.data.deckSettings;
      newDeckSettings = { ...deckSettings, deckId: response.body.data.deckSettings.deckId };
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.deckSettings).toBeDefined();
      expect(response.body.data.deckSettings.accountId).toBeDefined();
      expect(response.body.data.deckSettings.deckId).toBe(1);
      expect(response.body.data.deckSettings.favorite).toBe(false);
      expect(response.body.data.deckSettings.reviewInterval).toBe(constants.defaultInterval);
      expect(response.body.data.deckSettings.reviewsPerDay).toBe(constants.defaultReviewPerDay);
      expect(response.body.data.deckSettings.newCardsPerDay).toBe(constants.defaultNewPerDay);
      expect(response.body.data.deckSettings.createdAt).toBeDefined();
      expect(response.body.data.deckSettings.updatedAt).toBeDefined();
    });
  });

  describe('Edit deck settings', () => {

    it('Editing deck settings leads to auth error when not logged in', async () => {
      const response = await sendRequest(testUrl, null, mutations.changeDeckSettings, newDeckSettings);
      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Error when authenticated but deck with id non existing', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, { ...newDeckSettings, deckId: 9999 });
      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.nonExistingDeckError);
    });

    it('Error when authenticated but deck id not send', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, {
        favorite: newDeckSettings.favorite,
        reviewInterval: newDeckSettings.reviewInterval,
        reviewsPerDay: newDeckSettings.reviewsPerDay,
        newCardsPerDay: newDeckSettings.newCardsPerDay
      });
      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when authenticated but deck id negative integer', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, { ...newDeckSettings, deckId: -1 });
      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.negativeNumberTypeError);
    });

    it('Error when authenticated but deck id zero integer', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, { ...newDeckSettings, deckId: 0 });
      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.negativeNumberTypeError);
    });

    it('Error when authenticated but deck id wrong type (string)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, { ...newDeckSettings, deckId: '1' });
      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when authenticated but favorite wrong type (string)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, { ...newDeckSettings, favorite: 'true' });
      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when authenticated but favorite wrong type (integer)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, { ...newDeckSettings, favorite: 1 });
      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when authenticated but reviewInterval wrong type (string)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, { ...newDeckSettings, reviewInterval: '1' });
      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when authenticated but reviewInterval too high', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, { ...newDeckSettings, reviewInterval: constants.maxReviewInterval + 1 });
      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.maxReviewIntervalError);
    });

    it('Error when authenticated but reviewInterval too low', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, { ...newDeckSettings, reviewInterval: constants.minReviewInterval - 1  });
      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.minReviewIntervalError);
    });

    it('Error when authenticated but reviewsPerDay wrong type (string)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, { ...newDeckSettings, reviewsPerDay: '1' });
      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when authenticated but reviewsPerDay too high', async () => {
      const invalidDeckSettings = { ...newDeckSettings, reviewsPerDay: constants.maxLimitReviews + 1 };
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonMemberAuthToken}`)
        .send({ query: mutations.changeDeckSettings, variables: invalidDeckSettings });

      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.maxLimitReviewsError);
    });

    it('Error when authenticated but reviewsPerDay too low', async () => {
      const invalidDeckSettings = { ...newDeckSettings, reviewsPerDay: constants.minLimitReviews - 1 };
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonMemberAuthToken}`)
        .send({ query: mutations.changeDeckSettings, variables: invalidDeckSettings });

      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.minLimitReviewsError);
    });

    it('Error when authenticated but newCardsPerDay wrong type (string)', async () => {
      const invalidDeckSettings = { ...newDeckSettings, newCardsPerDay: '1' };
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonMemberAuthToken}`)
        .send({ query: mutations.changeDeckSettings, variables: invalidDeckSettings });

      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when authenticated but newCardsPerDay too high', async () => {
      const invalidDeckSettings = { ...newDeckSettings, newCardsPerDay: constants.maxNewReviews + 1 };
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonMemberAuthToken}`)
        .send({ query: mutations.changeDeckSettings, variables: invalidDeckSettings });

      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.maxNewReviewsError);
    });

    it('Error when authenticated but newCardsPerDay too low', async () => {
      const invalidDeckSettings = { ...newDeckSettings, newCardsPerDay: constants.minNewReviews - 1 };
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonMemberAuthToken}`)
        .send({ query: mutations.changeDeckSettings, variables: invalidDeckSettings });

      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.minNewReviewsError);
    });

    it('Succesfully change settings after authentication', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonMemberAuthToken}`)
        .send({ query: mutations.changeDeckSettings, variables: newDeckSettings });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.changeDeckSettings).toBeDefined();
      expect(response.body.data.changeDeckSettings.accountId).toBe(originalDeckSettings.accountId);
      expect(response.body.data.changeDeckSettings.deckId).toBe(originalDeckSettings.deckId);
      expect(response.body.data.changeDeckSettings.favorite).toBe(newDeckSettings.favorite);
      expect(response.body.data.changeDeckSettings.reviewInterval).toBe(newDeckSettings.reviewInterval);
      expect(response.body.data.changeDeckSettings.reviewsPerDay).toBe(newDeckSettings.reviewsPerDay);
      expect(response.body.data.changeDeckSettings.newCardsPerDay).toBe(newDeckSettings.newCardsPerDay);
      expect(response.body.data.changeDeckSettings.createdAt).toBeDefined();
      expect(response.body.data.changeDeckSettings.updatedAt).toBeDefined(); 
    });

    it('Toggling only favorite boolean should not change other values', async () => {
      // fetch current settings for deck id 1
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonMemberAuthToken}`)
        .send({ query: queries.deckSettings, variables: { deckId: 1 } });

      let currentSettings = response.body.data.deckSettings;
      // send all current settings, but set favorite = !favorite
      response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonMemberAuthToken}`)
        .send({ query: mutations.changeDeckSettings, variables: { ...currentSettings, favorite: !currentSettings.favorite } });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.changeDeckSettings).toBeDefined();
      expect(response.body.data.changeDeckSettings.accountId).toBe(currentSettings.accountId);
      expect(response.body.data.changeDeckSettings.deckId).toBe(currentSettings.deckId);
      expect(response.body.data.changeDeckSettings.favorite).toBe(!currentSettings.favorite);
      expect(response.body.data.changeDeckSettings.reviewInterval).toBe(currentSettings.reviewInterval);
      expect(response.body.data.changeDeckSettings.reviewsPerDay).toBe(currentSettings.reviewsPerDay);
      expect(response.body.data.changeDeckSettings.newCardsPerDay).toBe(currentSettings.newCardsPerDay);
      expect(response.body.data.changeDeckSettings.createdAt).toBe(currentSettings.createdAt);
      expect(response.body.data.changeDeckSettings.updatedAt).not.toBe(currentSettings.updatedAt);
      currentSettings = response.body.data.changeDeckSettings;

      // send just deckId and new value for favorite
      response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonMemberAuthToken}`)
        .send({ query: mutations.changeDeckSettings, variables: { deckId: currentSettings.deckId, favorite: !currentSettings.favorite } });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.changeDeckSettings).toBeDefined();
      expect(response.body.data.changeDeckSettings.accountId).toBe(currentSettings.accountId);
      expect(response.body.data.changeDeckSettings.deckId).toBe(currentSettings.deckId);
      expect(response.body.data.changeDeckSettings.favorite).toBe(!currentSettings.favorite);
      expect(response.body.data.changeDeckSettings.reviewInterval).toBe(currentSettings.reviewInterval);
      expect(response.body.data.changeDeckSettings.reviewsPerDay).toBe(currentSettings.reviewsPerDay);
      expect(response.body.data.changeDeckSettings.newCardsPerDay).toBe(currentSettings.newCardsPerDay);
      expect(response.body.data.changeDeckSettings.createdAt).toBe(currentSettings.createdAt);
      expect(response.body.data.changeDeckSettings.updatedAt).not.toBe(currentSettings.updatedAt);
    });

    it('Toggling only review interval should not change other values', async () => {
      // fetch current settings for deck id 1
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonMemberAuthToken}`)
        .send({ query: queries.deckSettings, variables: { deckId: 1 } });

      let currentSettings = response.body.data.deckSettings;
      // send all current settings, but set review interval += 5
      response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonMemberAuthToken}`)
        .send({ query: mutations.changeDeckSettings, variables: { ...currentSettings, reviewInterval: currentSettings.reviewInterval + 5 } });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.changeDeckSettings).toBeDefined();
      expect(response.body.data.changeDeckSettings.accountId).toBe(currentSettings.accountId);
      expect(response.body.data.changeDeckSettings.deckId).toBe(currentSettings.deckId);
      expect(response.body.data.changeDeckSettings.favorite).toBe(currentSettings.favorite);
      expect(response.body.data.changeDeckSettings.reviewInterval).toBe(currentSettings.reviewInterval + 5);
      expect(response.body.data.changeDeckSettings.reviewsPerDay).toBe(currentSettings.reviewsPerDay);
      expect(response.body.data.changeDeckSettings.newCardsPerDay).toBe(currentSettings.newCardsPerDay);
      expect(response.body.data.changeDeckSettings.createdAt).toBe(currentSettings.createdAt);
      expect(response.body.data.changeDeckSettings.updatedAt).not.toBe(currentSettings.updatedAt);
      currentSettings = response.body.data.changeDeckSettings;

      // send just deckId and new value for review interval
      response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonMemberAuthToken}`)
        .send({ query: mutations.changeDeckSettings, variables: { deckId: currentSettings.deckId, reviewInterval: currentSettings.reviewInterval + 2 } });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.changeDeckSettings).toBeDefined();
      expect(response.body.data.changeDeckSettings.accountId).toBe(currentSettings.accountId);
      expect(response.body.data.changeDeckSettings.deckId).toBe(currentSettings.deckId);
      expect(response.body.data.changeDeckSettings.favorite).toBe(currentSettings.favorite);
      expect(response.body.data.changeDeckSettings.reviewInterval).toBe(currentSettings.reviewInterval + 2);
      expect(response.body.data.changeDeckSettings.reviewsPerDay).toBe(currentSettings.reviewsPerDay);
      expect(response.body.data.changeDeckSettings.newCardsPerDay).toBe(currentSettings.newCardsPerDay);
      expect(response.body.data.changeDeckSettings.createdAt).toBe(currentSettings.createdAt);
      expect(response.body.data.changeDeckSettings.updatedAt).not.toBe(currentSettings.updatedAt);
    });

    it('Toggling only reviews per day should not change other values', async () => {
      // fetch current settings for deck id 1
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonMemberAuthToken}`)
        .send({ query: queries.deckSettings, variables: { deckId: 1 } });

      let currentSettings = response.body.data.deckSettings;
      // send all current settings, but set revies per day += 5
      response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonMemberAuthToken}`)
        .send({ query: mutations.changeDeckSettings, variables: { ...currentSettings, reviewsPerDay: currentSettings.reviewsPerDay + 5 } });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.changeDeckSettings).toBeDefined();
      expect(response.body.data.changeDeckSettings.accountId).toBe(currentSettings.accountId);
      expect(response.body.data.changeDeckSettings.deckId).toBe(currentSettings.deckId);
      expect(response.body.data.changeDeckSettings.favorite).toBe(currentSettings.favorite);
      expect(response.body.data.changeDeckSettings.reviewInterval).toBe(currentSettings.reviewInterval);
      expect(response.body.data.changeDeckSettings.reviewsPerDay).toBe(currentSettings.reviewsPerDay + 5);
      expect(response.body.data.changeDeckSettings.newCardsPerDay).toBe(currentSettings.newCardsPerDay);
      expect(response.body.data.changeDeckSettings.createdAt).toBe(currentSettings.createdAt);
      expect(response.body.data.changeDeckSettings.updatedAt).not.toBe(currentSettings.updatedAt);
      currentSettings = response.body.data.changeDeckSettings;

      // send just deckId and new value for reviews per day
      response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonMemberAuthToken}`)
        .send({ query: mutations.changeDeckSettings, variables: { deckId: currentSettings.deckId, reviewsPerDay: currentSettings.reviewsPerDay + 2 } });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.changeDeckSettings).toBeDefined();
      expect(response.body.data.changeDeckSettings.accountId).toBe(currentSettings.accountId);
      expect(response.body.data.changeDeckSettings.deckId).toBe(currentSettings.deckId);
      expect(response.body.data.changeDeckSettings.favorite).toBe(currentSettings.favorite);
      expect(response.body.data.changeDeckSettings.reviewInterval).toBe(currentSettings.reviewInterval);
      expect(response.body.data.changeDeckSettings.reviewsPerDay).toBe(currentSettings.reviewsPerDay + 2);
      expect(response.body.data.changeDeckSettings.newCardsPerDay).toBe(currentSettings.newCardsPerDay);
      expect(response.body.data.changeDeckSettings.createdAt).toBe(currentSettings.createdAt);
      expect(response.body.data.changeDeckSettings.updatedAt).not.toBe(currentSettings.updatedAt);
    });

    it('Toggling only new cards per day should not change other values', async () => {
      // fetch current settings for deck id 1
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonMemberAuthToken}`)
        .send({ query: queries.deckSettings, variables: { deckId: 1 } });

      let currentSettings = response.body.data.deckSettings;
      // send all current settings, but set new cards per day += 5
      response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonMemberAuthToken}`)
        .send({ query: mutations.changeDeckSettings, variables: { ...currentSettings, newCardsPerDay: currentSettings.newCardsPerDay + 5 } });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.changeDeckSettings).toBeDefined();
      expect(response.body.data.changeDeckSettings.accountId).toBe(currentSettings.accountId);
      expect(response.body.data.changeDeckSettings.deckId).toBe(currentSettings.deckId);
      expect(response.body.data.changeDeckSettings.favorite).toBe(currentSettings.favorite);
      expect(response.body.data.changeDeckSettings.reviewInterval).toBe(currentSettings.reviewInterval);
      expect(response.body.data.changeDeckSettings.reviewsPerDay).toBe(currentSettings.reviewsPerDay);
      expect(response.body.data.changeDeckSettings.newCardsPerDay).toBe(currentSettings.newCardsPerDay + 5);
      expect(response.body.data.changeDeckSettings.createdAt).toBe(currentSettings.createdAt);
      expect(response.body.data.changeDeckSettings.updatedAt).not.toBe(currentSettings.updatedAt);
      currentSettings = response.body.data.changeDeckSettings;

      // send just deckId and new value for new cards per day
      response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonMemberAuthToken}`)
        .send({ query: mutations.changeDeckSettings, variables: { deckId: currentSettings.deckId, newCardsPerDay: currentSettings.newCardsPerDay + 2 } });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.changeDeckSettings).toBeDefined();
      expect(response.body.data.changeDeckSettings.accountId).toBe(currentSettings.accountId);
      expect(response.body.data.changeDeckSettings.deckId).toBe(currentSettings.deckId);
      expect(response.body.data.changeDeckSettings.favorite).toBe(currentSettings.favorite);
      expect(response.body.data.changeDeckSettings.reviewInterval).toBe(currentSettings.reviewInterval);
      expect(response.body.data.changeDeckSettings.reviewsPerDay).toBe(currentSettings.reviewsPerDay);
      expect(response.body.data.changeDeckSettings.newCardsPerDay).toBe(currentSettings.newCardsPerDay + 2);
      expect(response.body.data.changeDeckSettings.createdAt).toBe(currentSettings.createdAt);
      expect(response.body.data.changeDeckSettings.updatedAt).not.toBe(currentSettings.updatedAt);
    });
  });
});
