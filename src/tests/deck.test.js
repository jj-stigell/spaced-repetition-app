const { expect, describe, beforeAll, afterAll, it } = require('@jest/globals');
const request = require('supertest');
const { PORT } = require('../util/config');
const { connectToDatabase } = require('../database');
const { account, adminReadRights, adminWriteRights, deckSettings } = require('./utils/constants'); 
const mutations = require('./utils/mutations');
const queries = require('./utils/queries');
const errors = require('../util/errors/errors');
const server = require('../util/server');
const constants = require('../util/constants');
const helpers = require('./utils/helper');

describe('Deck integration tests', () => {
  // eslint-disable-next-line no-unused-vars
  let testServer, testUrl, nonAdminAuthToken, adminAuthReadToken, adminAuthWriteToken, nonAdminAccount, newDeckSettings, originalDeckSettings;
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
        .send({ query: queries.decks});

      expect(response.body.data?.decks).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Fetch all available decks, 3 at the moment', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: queries.decks});

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
      let response = await request(testUrl)
        .post('/')
        .send({ query: queries.deckSettings, variables: { deckId: 1 } });

      expect(response.body.data?.deckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Error when authenticated but deck id negative integer', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: queries.deckSettings, variables: { deckId: -1 } });

      expect(response.body.data?.deckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.negativeNumberTypeError);
    });

    it('Error when authenticated but deck id zero integer', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: queries.deckSettings, variables: { deckId: 0 } });

      expect(response.body.data?.deckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.negativeNumberTypeError);
    });
    
    it('Error when authenticated but deck id wrong type (string)', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: queries.deckSettings, variables: { deckId: '1' } });

      expect(response.body.data?.deckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when authenticated but deck id wrong type (float)', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: queries.deckSettings, variables: { deckId: 1.01 } });

      expect(response.body.data?.deckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when authenticated but deck id not send', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: queries.deckSettings });

      expect(response.body.data?.deckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when authenticated but non-existing deck id', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: queries.deckSettings, variables: { deckId: 9999 } });

      expect(response.body.data?.deckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.nonExistingDeckError);
    });

    it('Fetch deck setting for deck id 1, settings should be default for initial fetch, defined in constants', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: queries.deckSettings, variables: { deckId: 1 } });

      originalDeckSettings = response.body.data.deckSettings;
      newDeckSettings = { ...deckSettings, deckId: response.body.data.deckSettings.deckId };
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.deckSettings).toBeDefined();
      expect(response.body.data.deckSettings.accountId).toBe(parseInt(nonAdminAccount.id));
      expect(response.body.data.deckSettings.deckId).toBe(1);
      expect(response.body.data.deckSettings.favorite).toBe(false);
      expect(response.body.data.deckSettings.reviewInterval).toBe(constants.defaultInterval);
      expect(response.body.data.deckSettings.reviewsPerDay).toBe(constants.defaultReviewPerDay);
      expect(response.body.data.deckSettings.newCardsPerDay).toBe(constants.defaultNewPerDay);
      expect(response.body.data.deckSettings.createdAt).toBeDefined();
      expect(response.body.data.deckSettings.updatedAt).toBeDefined();
    });
  });



















  /*


    changeDeckSettings: async (_, { deckId, favorite, reviewInterval, reviewsPerDay, newCardsPerDay }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      await validator.validateDeckSettings(deckId, favorite, reviewInterval, reviewsPerDay, newCardsPerDay);

      // Check that deck exists
      const deck = await deckService.findDeckById(deckId);

      // No deck found with an id
      if (!deck) return graphQlErrors.defaultError(errors.nonExistingDeckError);

      // Check if deck has an account specific settings
      let deckSettings = await deckService.findAccountDeckSettings(deckId, currentUser.id);

      //create new accoung deck settings if no existing one
      if (!deckSettings) {
        deckSettings = await deckService.createAccountDeckSettings(deckId, currentUser.id, favorite, reviewInterval, reviewsPerDay, newCardsPerDay);
      }

      // Update existing deck settings
      try {
        deckSettings.favorite = favorite ? true : false;
        deckSettings.reviewInterval = reviewInterval ? reviewInterval : deckSettings.reviewInterval,
        deckSettings.reviewsPerDay = reviewsPerDay ? reviewsPerDay : deckSettings.reviewsPerDay,
        deckSettings.newCardsPerDay = newCardsPerDay ? newCardsPerDay : deckSettings.newCardsPerDay,
        await deckSettings.save();
      } catch(error) {
        return graphQlErrors.internalServerError(error);
      }

      return {
        id: deckSettings.id,
        accountId: deckSettings.accountId,
        deckId: deckSettings.deckId,
        favorite: deckSettings.favorite,
        reviewInterval: deckSettings.reviewInterval,
        reviewsPerDay: deckSettings.reviewsPerDay,
        newCardsPerDay: deckSettings.newCardsPerDay,
        createdAt: deckSettings.createdAt,
        updatedAt: deckSettings.updatedAt
      };
    },

      changeDeckSettings: `  mutation ChangeDeckSettings($deckId: Int!, $newCardsPerDay: Int, $reviewsPerDay: Int, $reviewInterval: Int, $favorite: Boolean) {
    changeDeckSettings(deckId: $deckId, newCardsPerDay: $newCardsPerDay, reviewsPerDay: $reviewsPerDay, reviewInterval: $reviewInterval, favorite: $favorite) {
      id
      accountId
      deckId
      favorite
      reviewInterval
      reviewsPerDay
      newCardsPerDay
      createdAt
      updatedAt
    }
  }`,
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
    */



  describe('Edit deck settings', () => {

    it('Editing deck settings leads to auth error when not logged in', async () => {
      let response = await request(testUrl)
        .post('/')
        .send({ query: mutations.changeDeckSettings, variables: newDeckSettings });

      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Error when authenticated but deck id not send', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: mutations.changeDeckSettings, variables: {
          favorite: newDeckSettings.favorite,
          reviewInterval: newDeckSettings.reviewInterval,
          reviewsPerDay: newDeckSettings.reviewsPerDay,
          newCardsPerDay: newDeckSettings.newCardsPerDay
        } });

      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when authenticated but deck id negative integer', async () => {
      const invalidDeckSettings = { ...newDeckSettings, deckId: -1 };
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: mutations.changeDeckSettings, variables: invalidDeckSettings });

      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.negativeNumberTypeError);
    });

    it('Error when authenticated but deck id zero integer', async () => {
      const invalidDeckSettings = { ...newDeckSettings, deckId: 0 };
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: mutations.changeDeckSettings, variables: invalidDeckSettings });

      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.negativeNumberTypeError);
    });

    it('Error when authenticated but deck id wrong type (string)', async () => {
      const invalidDeckSettings = { ...newDeckSettings, deckId: '1' };
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: mutations.changeDeckSettings, variables: invalidDeckSettings });

      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when authenticated but favorite wrong type (string)', async () => {
      const invalidDeckSettings = { ...newDeckSettings, favorite: 'true' };
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: mutations.changeDeckSettings, variables: invalidDeckSettings });

      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when authenticated but reviewInterval wrong type (string)', async () => {
      const invalidDeckSettings = { ...newDeckSettings, reviewInterval: '1' };
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: mutations.changeDeckSettings, variables: invalidDeckSettings });

      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when authenticated but reviewInterval too high', async () => {
      const invalidDeckSettings = { ...newDeckSettings, reviewInterval: constants.maxReviewInterval + 1 };
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: mutations.changeDeckSettings, variables: invalidDeckSettings });

      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.maxReviewIntervalError);
    });

    it('Error when authenticated but reviewInterval too low', async () => {
      const invalidDeckSettings = { ...newDeckSettings, reviewInterval: constants.minReviewInterval - 1 };
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: mutations.changeDeckSettings, variables: invalidDeckSettings });

      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.minReviewIntervalError);
    });

    it('Error when authenticated but reviewsPerDay wrong type (string)', async () => {
      const invalidDeckSettings = { ...newDeckSettings, reviewsPerDay: '1' };
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: mutations.changeDeckSettings, variables: invalidDeckSettings });

      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when authenticated but reviewsPerDay too high', async () => {
      const invalidDeckSettings = { ...newDeckSettings, reviewsPerDay: constants.maxLimitReviews + 1 };
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: mutations.changeDeckSettings, variables: invalidDeckSettings });

      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.maxLimitReviewsError);
    });

    it('Error when authenticated but reviewsPerDay too low', async () => {
      const invalidDeckSettings = { ...newDeckSettings, reviewsPerDay: constants.minLimitReviews - 1 };
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: mutations.changeDeckSettings, variables: invalidDeckSettings });

      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.minLimitReviewsError);
    });

    it('Error when authenticated but newCardsPerDay wrong type (string)', async () => {
      const invalidDeckSettings = { ...newDeckSettings, newCardsPerDay: '1' };
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: mutations.changeDeckSettings, variables: invalidDeckSettings });

      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when authenticated but newCardsPerDay too high', async () => {
      const invalidDeckSettings = { ...newDeckSettings, newCardsPerDay: constants.maxNewReviews + 1 };
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: mutations.changeDeckSettings, variables: invalidDeckSettings });

      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.maxNewReviewsError);
    });

    it('Error when authenticated but newCardsPerDay too low', async () => {
      const invalidDeckSettings = { ...newDeckSettings, newCardsPerDay: constants.minNewReviews - 1 };
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: mutations.changeDeckSettings, variables: invalidDeckSettings });

      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.minNewReviewsError);
    });

    it('Succesfully change settings after authentication', async () => {
      let response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
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
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: queries.deckSettings, variables: { deckId: 1 } });

      let currentSettings = response.body.data.deckSettings;
      // send all current settings, but set favorite = !favorite
      response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: mutations.changeDeckSettings, variables: { ...currentSettings, favorite: !currentSettings.favorite } });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.changeDeckSettings).toBeDefined();
      expect(response.body.data.changeDeckSettings.accountId).toBe(currentSettings.accountId);
      expect(response.body.data.changeDeckSettings.deckId).toBe(currentSettings.deckId);
      expect(response.body.data.changeDeckSettings.favorite).toBe(!currentSettings.favorite);
      expect(response.body.data.changeDeckSettings.reviewInterval).toBe(currentSettings.reviewInterval);
      expect(response.body.data.changeDeckSettings.reviewsPerDay).toBe(currentSettings.reviewsPerDay);
      expect(response.body.data.changeDeckSettings.newCardsPerDay).toBe(currentSettings.newCardsPerDay);
      expect(response.body.data.changeDeckSettings.createdAt).toBeDefined();
      expect(response.body.data.changeDeckSettings.updatedAt).toBeDefined();
      currentSettings = response.body.data.changeDeckSettings;

      // send just deckId and new value for favorite
      response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${nonAdminAuthToken}`)
        .send({ query: mutations.changeDeckSettings, variables: { deckId: currentSettings.deckId, favorite: !currentSettings.favorite } });

      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.changeDeckSettings).toBeDefined();
      expect(response.body.data.changeDeckSettings.accountId).toBe(currentSettings.accountId);
      expect(response.body.data.changeDeckSettings.deckId).toBe(currentSettings.deckId);
      expect(response.body.data.changeDeckSettings.favorite).toBe(!currentSettings.favorite);
      expect(response.body.data.changeDeckSettings.reviewInterval).toBe(currentSettings.reviewInterval);
      expect(response.body.data.changeDeckSettings.reviewsPerDay).toBe(currentSettings.reviewsPerDay);
      expect(response.body.data.changeDeckSettings.newCardsPerDay).toBe(currentSettings.newCardsPerDay);
      expect(response.body.data.changeDeckSettings.createdAt).toBeDefined();
      expect(response.body.data.changeDeckSettings.updatedAt).toBeDefined();
    });

  });
  
});
