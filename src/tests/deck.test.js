/* eslint-disable no-unused-vars */
const { it, expect, describe, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { account, nonMemberAccount, adminReadRights, adminWriteRights, deckSettings } = require('./utils/constants');
const { deckEvaluator, deckSettingsEvaluator } = require('./utils/expectHelper');
const { connectToDatabase } = require('../database');
const errors = require('../util/errors/errors');
const sendRequest = require('./utils/request');
const constants = require('../util/constants');
const mutations = require('./utils/mutations');
const { PORT } = require('../util/config');
const queries = require('./utils/queries');
const testHelpers = require('./utils/helper');
const helpers = require('../util/helper');
const server = require('../util/server');

describe('Deckintegration tests', () => {
  let testServer, testUrl, originalDeckSettings, newDeckSettings, currentDateObject,
    memberAuthToken, adminAuthReadToken, adminAuthWriteToken, nonMemberAuthToken,
    memberAcc, nonMemberAcc, adminReadAcc, adminWriteAcc, currentDateString;

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
    await testHelpers.resetDatabaseEntries();
    [ memberAuthToken, memberAcc ] = await testHelpers.getToken(testUrl, account);
    [ nonMemberAuthToken, nonMemberAcc ] = await testHelpers.getToken(testUrl, nonMemberAccount);
    [ adminAuthReadToken, adminReadAcc ] = await testHelpers.getToken(testUrl, adminReadRights);
    [ adminAuthWriteToken, adminWriteAcc ] = await testHelpers.getToken(testUrl, adminWriteRights);
    currentDateObject = new Date();
    currentDateString = currentDateObject.toISOString().split('T')[0];
  });

  describe('Fetching decks', () => {

    it('Fetch decks leads to authentication error when not logged in', async () => {
      const response = await sendRequest(testUrl, null, queries.decks, { date: currentDateString });
      expect(response.body.data?.decks).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Error when authenticated but date wrong type (text string)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.decks, { date: 'notgood' });
      expect(response.body.data?.decks).toBeUndefined();
      expect(response.body.errors[0].extensions.exception.message).toContain(errors.graphQlErrors.validationError);
    });

    it('Error when authenticated but date wrong type (integer)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.decks, { date: 123 });
      expect(response.body.data?.decks).toBeUndefined();
      expect(response.body.errors[0].extensions.exception.message).toContain(errors.graphQlErrors.validationError);
    });

    it('Error when authenticated but date earlier than allowed', async () => {
      // date can be maximum 1 day before the server date
      const tooEarlyDate = helpers.calculateDateToString(-2);
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.decks, { date: tooEarlyDate });
      expect(response.body.data?.decks).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.validation.invalidDateError);
    });

    it('Error when authenticated but date too far in the future', async () => {
      const dateTooLongInTheFuture = helpers.calculateDateToString(constants.card.maxReviewInterval + 1);
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.decks, { date: dateTooLongInTheFuture });
      expect(response.body.data?.decks).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.validation.invalidDateError);
    });

    it('Fetch all available decks should be possible with max review interval set as the date', async () => {
      const maxDatePossible = helpers.calculateDateToString(constants.card.maxReviewInterval);
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.decks, { date: maxDatePossible });
      response.body.data.decks.forEach(deck => deckEvaluator(deck));
      expect(response.body.errors).toBeUndefined();
    });

    it('Fetch all available decks, account specific deck settings are null when no reviews', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.decks, { date: currentDateString });
      response.body.data.decks.forEach(deck => deckEvaluator(deck));
      expect(response.body.errors).toBeUndefined();
    });

    it('Fetch all available decks, account specific deck settings exists after accessing settings before decks query', async () => {
      let response = await sendRequest(testUrl, nonMemberAuthToken, queries.decks, { date: currentDateString });
      for (let i = 0; i < response.body.data.decks.length; i++) {
        await sendRequest(testUrl, nonMemberAuthToken, queries.deckSettings, { deckId: response.body.data.decks[i].id });
      }
      response = await sendRequest(testUrl, nonMemberAuthToken, queries.decks, { date: currentDateString });
      expect(response.body.data.decks[0].accountDeckSettings).toBeDefined();
      response.body.data.decks.forEach(deck => deckEvaluator(deck));
      expect(response.body.errors).toBeUndefined();
    });

    it('Fetch all available decks, account specific deck (1) settings have 10 due reviews waiting', async () => {
      await testHelpers.addDueReviews(nonMemberAcc.id, 10, 1, currentDateObject);
      await sendRequest(testUrl, nonMemberAuthToken, queries.deckSettings, { deckId: 1 });
      let response = await sendRequest(testUrl, nonMemberAuthToken, queries.decks, { date: currentDateString });
      response = await sendRequest(testUrl, nonMemberAuthToken, queries.decks, { date: currentDateString });
      const deckOne = response.body.data.decks.filter(deck => deck.id === 1);
      expect(deckOne[0].accountDeckSettings.dueCards).toBe(10);
      expect(response.body.data.decks[0].accountDeckSettings).toBeDefined();
      response.body.data.decks.forEach(deck => deckEvaluator(deck));
      expect(response.body.errors).toBeUndefined();
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
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.deckSettings, { deckId: constants.maxAmountOfDecks + 1 });
      expect(response.body.data?.deckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.nonExistingDeckError);
    });

    it('Fetch deck setting for deck id 1, settings should be default for initial fetch, defined in constants', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.deckSettings, { deckId: 1 });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.deckSettings).toBeDefined();
      expect(response.body.data.deckSettings.accountId).toBeDefined();
      expect(response.body.data.deckSettings.deckId).toBe(1);
      expect(response.body.data.deckSettings.favorite).toBe(false);
      expect(response.body.data.deckSettings.dueCards).toBe(0);
      expect(response.body.data.deckSettings.reviewInterval).toBe(constants.defaultInterval);
      expect(response.body.data.deckSettings.reviewsPerDay).toBe(constants.defaultReviewPerDay);
      expect(response.body.data.deckSettings.newCardsPerDay).toBe(constants.defaultNewPerDay);
      expect(response.body.data.deckSettings.createdAt).toBeDefined();
      expect(response.body.data.deckSettings.updatedAt).toBeDefined();
    });
  });

  describe('Edit deck settings', () => {

    it('Editing deck settings leads to auth error when not logged in', async () => {
      const response = await sendRequest(testUrl, null, mutations.changeDeckSettings, deckSettings);
      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Error when authenticated but deck with id non existing', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, { ...deckSettings, deckId: 9999 });
      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.nonExistingDeckError);
    });

    it('Error when authenticated but deck id not send', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, { ...deckSettings, deckId: null });
      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when authenticated but deck id negative integer', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, { ...deckSettings, deckId: -1 });
      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.negativeNumberTypeError);
    });

    it('Error when authenticated but deck id zero integer', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, { ...deckSettings, deckId: 0 });
      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.negativeNumberTypeError);
    });

    it('Error when authenticated but deck id wrong type (string)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, { ...deckSettings, deckId: '1' });
      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when authenticated but favorite wrong type (string)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, { ...deckSettings, favorite: 'true' });
      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when authenticated but favorite wrong type (integer)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, { ...deckSettings, favorite: 1 });
      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when authenticated but reviewInterval wrong type (string)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, { ...deckSettings, reviewInterval: '1' });
      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when authenticated but reviewInterval too high', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, { ...deckSettings, reviewInterval: constants.card.maxReviewInterval + 1 });
      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.cardErrors.card.maxReviewIntervalError);
    });

    it('Error when authenticated but reviewInterval too low', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, { ...deckSettings, reviewInterval: constants.card.minReviewInterval - 1  });
      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.cardErrors.minReviewIntervalError);
    });

    it('Error when authenticated but reviewsPerDay wrong type (string)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, { ...deckSettings, reviewsPerDay: '1' });
      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when authenticated but reviewsPerDay too high', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, { ...deckSettings, reviewsPerDay: constants.maxLimitReviews + 1 });
      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.maxLimitReviewsError);
    });

    it('Error when authenticated but reviewsPerDay too low', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, { ...deckSettings, reviewsPerDay: constants.minLimitReviews - 1 });
      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.minLimitReviewsError);
    });

    it('Error when authenticated but newCardsPerDay wrong type (string)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, { ...deckSettings, newCardsPerDay: '1' });
      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when authenticated but newCardsPerDay too high', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, { ...deckSettings, newCardsPerDay: constants.maxNewReviews + 1 });
      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.maxNewReviewsError);
    });

    it('Error when authenticated but newCardsPerDay too low', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, { ...deckSettings, newCardsPerDay: constants.minNewReviews - 1 });
      expect(response.body.data?.changeDeckSettings).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.minNewReviewsError);
    });

    it('Succesfully change settings after authentication', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, deckSettings);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.changeDeckSettings).toBeDefined();
      expect(response.body.data.changeDeckSettings.accountId).toBe(nonMemberAcc.id);
      expect(response.body.data.changeDeckSettings.deckId).toBe(deckSettings.deckId);
      expect(response.body.data.changeDeckSettings.favorite).toBe(deckSettings.favorite);
      expect(response.body.data.changeDeckSettings.dueCards).toBe(0);
      expect(response.body.data.changeDeckSettings.reviewInterval).toBe(deckSettings.reviewInterval);
      expect(response.body.data.changeDeckSettings.reviewsPerDay).toBe(deckSettings.reviewsPerDay);
      expect(response.body.data.changeDeckSettings.newCardsPerDay).toBe(deckSettings.newCardsPerDay);
      expect(response.body.data.changeDeckSettings.createdAt).toBeDefined();
      expect(response.body.data.changeDeckSettings.updatedAt).toBeDefined(); 
    });

    it('Toggling only favorite boolean should not change other values', async () => {
      // fetch current settings for deck id 1
      let response = await sendRequest(testUrl, nonMemberAuthToken, queries.deckSettings, { deckId: 1 });
      let currentSettings = response.body.data.deckSettings;

      // send all current settings, but set favorite = !favorite
      response = await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, { ...currentSettings, favorite: !currentSettings.favorite });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.changeDeckSettings).toBeDefined();
      expect(response.body.data.changeDeckSettings.accountId).toBe(nonMemberAcc.id);
      expect(response.body.data.changeDeckSettings.deckId).toBe(currentSettings.deckId);
      expect(response.body.data.changeDeckSettings.favorite).toBe(!currentSettings.favorite);
      expect(response.body.data.changeDeckSettings.dueCards).toBe(0);
      expect(response.body.data.changeDeckSettings.reviewInterval).toBe(currentSettings.reviewInterval);
      expect(response.body.data.changeDeckSettings.reviewsPerDay).toBe(currentSettings.reviewsPerDay);
      expect(response.body.data.changeDeckSettings.newCardsPerDay).toBe(currentSettings.newCardsPerDay);
      expect(response.body.data.changeDeckSettings.createdAt).toBe(currentSettings.createdAt);
      expect(response.body.data.changeDeckSettings.updatedAt).not.toBe(currentSettings.updatedAt);
      currentSettings = response.body.data.changeDeckSettings;

      // send just deckId and new value for favorite
      response = await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, { deckId: currentSettings.deckId, favorite: !currentSettings.favorite });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.changeDeckSettings).toBeDefined();
      expect(response.body.data.changeDeckSettings.accountId).toBe(nonMemberAcc.id);
      expect(response.body.data.changeDeckSettings.deckId).toBe(currentSettings.deckId);
      expect(response.body.data.changeDeckSettings.favorite).toBe(!currentSettings.favorite);
      expect(response.body.data.changeDeckSettings.dueCards).toBe(0);
      expect(response.body.data.changeDeckSettings.reviewInterval).toBe(currentSettings.reviewInterval);
      expect(response.body.data.changeDeckSettings.reviewsPerDay).toBe(currentSettings.reviewsPerDay);
      expect(response.body.data.changeDeckSettings.newCardsPerDay).toBe(currentSettings.newCardsPerDay);
      expect(response.body.data.changeDeckSettings.createdAt).toBe(currentSettings.createdAt);
      expect(response.body.data.changeDeckSettings.updatedAt).not.toBe(currentSettings.updatedAt);
    });

    it('Toggling only review interval should not change other values', async () => {
      // fetch current settings for deck id 1
      let response = await sendRequest(testUrl, nonMemberAuthToken, queries.deckSettings, { deckId: 1 });
      let currentSettings = response.body.data.deckSettings;

      // send all current settings, but set review interval += 5
      response = await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, { ...currentSettings, reviewInterval: currentSettings.reviewInterval - 5 });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.changeDeckSettings).toBeDefined();
      expect(response.body.data.changeDeckSettings.accountId).toBe(nonMemberAcc.id);
      expect(response.body.data.changeDeckSettings.deckId).toBe(currentSettings.deckId);
      expect(response.body.data.changeDeckSettings.favorite).toBe(currentSettings.favorite);
      expect(response.body.data.changeDeckSettings.dueCards).toBe(0);
      expect(response.body.data.changeDeckSettings.reviewInterval).toBe(currentSettings.reviewInterval - 5);
      expect(response.body.data.changeDeckSettings.reviewsPerDay).toBe(currentSettings.reviewsPerDay);
      expect(response.body.data.changeDeckSettings.newCardsPerDay).toBe(currentSettings.newCardsPerDay);
      expect(response.body.data.changeDeckSettings.createdAt).toBe(currentSettings.createdAt);
      expect(response.body.data.changeDeckSettings.updatedAt).not.toBe(currentSettings.updatedAt);
      currentSettings = response.body.data.changeDeckSettings;

      // send just deckId and new value for review interval
      response = await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, { deckId: currentSettings.deckId, reviewInterval: currentSettings.reviewInterval + 2 });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.changeDeckSettings).toBeDefined();
      expect(response.body.data.changeDeckSettings.accountId).toBe(nonMemberAcc.id);
      expect(response.body.data.changeDeckSettings.deckId).toBe(currentSettings.deckId);
      expect(response.body.data.changeDeckSettings.favorite).toBe(currentSettings.favorite);
      expect(response.body.data.changeDeckSettings.dueCards).toBe(0);
      expect(response.body.data.changeDeckSettings.reviewInterval).toBe(currentSettings.reviewInterval + 2);
      expect(response.body.data.changeDeckSettings.reviewsPerDay).toBe(currentSettings.reviewsPerDay);
      expect(response.body.data.changeDeckSettings.newCardsPerDay).toBe(currentSettings.newCardsPerDay);
      expect(response.body.data.changeDeckSettings.createdAt).toBe(currentSettings.createdAt);
      expect(response.body.data.changeDeckSettings.updatedAt).not.toBe(currentSettings.updatedAt);
    });

    it('Toggling only reviews per day should not change other values', async () => {
      // fetch current settings for deck id 1
      let response = await sendRequest(testUrl, nonMemberAuthToken, queries.deckSettings, { deckId: 1 });
      let currentSettings = response.body.data.deckSettings;

      // send all current settings, but set revies per day += 5
      response = await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, { ...currentSettings, reviewsPerDay: currentSettings.reviewsPerDay - 5 });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.changeDeckSettings).toBeDefined();
      expect(response.body.data.changeDeckSettings.accountId).toBe(nonMemberAcc.id);
      expect(response.body.data.changeDeckSettings.deckId).toBe(currentSettings.deckId);
      expect(response.body.data.changeDeckSettings.favorite).toBe(currentSettings.favorite);
      expect(response.body.data.changeDeckSettings.dueCards).toBe(0);
      expect(response.body.data.changeDeckSettings.reviewInterval).toBe(currentSettings.reviewInterval);
      expect(response.body.data.changeDeckSettings.reviewsPerDay).toBe(currentSettings.reviewsPerDay - 5);
      expect(response.body.data.changeDeckSettings.newCardsPerDay).toBe(currentSettings.newCardsPerDay);
      expect(response.body.data.changeDeckSettings.createdAt).toBe(currentSettings.createdAt);
      expect(response.body.data.changeDeckSettings.updatedAt).not.toBe(currentSettings.updatedAt);
      currentSettings = response.body.data.changeDeckSettings;

      // send just deckId and new value for reviews per day
      response = await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, { deckId: currentSettings.deckId, reviewsPerDay: currentSettings.reviewsPerDay + 2 });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.changeDeckSettings).toBeDefined();
      expect(response.body.data.changeDeckSettings.accountId).toBe(nonMemberAcc.id);
      expect(response.body.data.changeDeckSettings.deckId).toBe(currentSettings.deckId);
      expect(response.body.data.changeDeckSettings.favorite).toBe(currentSettings.favorite);
      expect(response.body.data.changeDeckSettings.dueCards).toBe(0);
      expect(response.body.data.changeDeckSettings.reviewInterval).toBe(currentSettings.reviewInterval);
      expect(response.body.data.changeDeckSettings.reviewsPerDay).toBe(currentSettings.reviewsPerDay + 2);
      expect(response.body.data.changeDeckSettings.newCardsPerDay).toBe(currentSettings.newCardsPerDay);
      expect(response.body.data.changeDeckSettings.createdAt).toBe(currentSettings.createdAt);
      expect(response.body.data.changeDeckSettings.updatedAt).not.toBe(currentSettings.updatedAt);
    });

    it('Toggling only new cards per day should not change other values', async () => {
      // fetch current settings for deck id 1
      let response = await sendRequest(testUrl, nonMemberAuthToken, queries.deckSettings, { deckId: 1 });
      let currentSettings = response.body.data.deckSettings;

      // send all current settings, but set new cards per day += 5
      response = await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, { ...currentSettings, newCardsPerDay: currentSettings.newCardsPerDay - 5 });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.changeDeckSettings).toBeDefined();
      expect(response.body.data.changeDeckSettings.accountId).toBe(nonMemberAcc.id);
      expect(response.body.data.changeDeckSettings.deckId).toBe(currentSettings.deckId);
      expect(response.body.data.changeDeckSettings.favorite).toBe(currentSettings.favorite);
      expect(response.body.data.changeDeckSettings.dueCards).toBe(0);
      expect(response.body.data.changeDeckSettings.reviewInterval).toBe(currentSettings.reviewInterval);
      expect(response.body.data.changeDeckSettings.reviewsPerDay).toBe(currentSettings.reviewsPerDay);
      expect(response.body.data.changeDeckSettings.newCardsPerDay).toBe(currentSettings.newCardsPerDay - 5);
      expect(response.body.data.changeDeckSettings.createdAt).toBe(currentSettings.createdAt);
      expect(response.body.data.changeDeckSettings.updatedAt).not.toBe(currentSettings.updatedAt);
      currentSettings = response.body.data.changeDeckSettings;

      // send just deckId and new value for new cards per day
      response = await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, { deckId: currentSettings.deckId, newCardsPerDay: currentSettings.newCardsPerDay + 2 });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.changeDeckSettings).toBeDefined();
      expect(response.body.data.changeDeckSettings.accountId).toBe(nonMemberAcc.id);
      expect(response.body.data.changeDeckSettings.deckId).toBe(currentSettings.deckId);
      expect(response.body.data.changeDeckSettings.favorite).toBe(currentSettings.favorite);
      expect(response.body.data.changeDeckSettings.dueCards).toBe(0);
      expect(response.body.data.changeDeckSettings.reviewInterval).toBe(currentSettings.reviewInterval);
      expect(response.body.data.changeDeckSettings.reviewsPerDay).toBe(currentSettings.reviewsPerDay);
      expect(response.body.data.changeDeckSettings.newCardsPerDay).toBe(currentSettings.newCardsPerDay + 2);
      expect(response.body.data.changeDeckSettings.createdAt).toBe(currentSettings.createdAt);
      expect(response.body.data.changeDeckSettings.updatedAt).not.toBe(currentSettings.updatedAt);
    });
  });
});
