/* eslint-disable no-unused-vars */
const { it, expect, describe, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { account, adminReadRights, adminWriteRights, nonMemberAccount, accountCard, accountReview, cardsFromDeck } = require('./utils/constants'); 
const { cardEvaluator, accountCardEvaluator } = require('./utils/expectHelper');
const { connectToDatabase } = require('../database');
const mutations = require('./utils/mutations');
const errors = require('../util/errors/errors');
const sendRequest = require('./utils/request');
const constants = require('../util/constants');
const testHelpers = require('./utils/helper');
const { PORT } = require('../util/config');
const queries = require('./utils/queries');
const helpers = require('../util/helper');
const server = require('../util/server');

describe('Cardintegration tests', () => {
  let testServer, testUrl, memberAuthToken, adminAuthReadToken,
    adminAuthWriteToken, nonMemberAuthToken, memberAcc, nonMemberAcc,
    adminReadAcc, adminWriteAcc, matureCount, newCount, dateToday;
  
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
    dateToday = new Date();
  });

  const addReviews = async (amount) => {
    //Add reviews to the deck 1 for both non-member and member
    await testHelpers.addDueReviews(nonMemberAcc.id, amount, 1, dateToday);
    await testHelpers.addDueReviews(memberAcc.id, amount, 1, dateToday);
    //Add reviews to the deck 2 for both non-member and member
    await testHelpers.addDueReviews(nonMemberAcc.id, amount, 200, dateToday);
    await testHelpers.addDueReviews(memberAcc.id, amount, 200, dateToday);
  };

  describe('Fetch new cards', () => {

    it('Authentication error when not logged in', async () => {
      const response = await sendRequest(testUrl, null, queries.cardsFromDeck, cardsFromDeck);
      expect(response.body.data?.cardsFromDeck).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Error when deck id not send', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, null);
      expect(response.body.data?.cardsFromDeck).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when deck id wrong type (string)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, deckId: '1' });
      expect(response.body.data?.cardsFromDeck).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when deck id negative integer', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, deckId: -1 });
      expect(response.body.data?.cardsFromDeck).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.validationErrors.negativeNumberTypeError);
    });

    it('Error when deck id zero integer', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, deckId: 0 });
      expect(response.body.data?.cardsFromDeck).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.validationErrors.negativeNumberTypeError);
    });

    it('Error when language id non existing ENUM', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, languageId: 'XX' });
      expect(response.body.data?.cardsFromDeck).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when language id wrong type (integer)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, languageId: 1 });
      expect(response.body.data?.cardsFromDeck).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });
    
    it('Error when new cards wrong type (string)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, newCards: 'true' });
      expect(response.body.data?.cardsFromDeck).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when date wrong type (string)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, date: 'XX' });
      expect(response.body.data?.cardsFromDeck).toBeUndefined();
      expect(response.body.errors[0].extensions.exception.message).toContain(errors.graphQlErrors.validationError);
    });

    it('Error when date invalid', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, date: '2022-2-29' });
      expect(response.body.data?.cardsFromDeck).toBeUndefined();
      expect(response.body.errors[0].extensions.exception.message).toContain(errors.graphQlErrors.validationError);
    });

    it('Error when date earlier than allowed', async () => {
      // date can be maximum 1 day before the server date
      const tooEarlyDate = helpers.calculateDateToString(-2);
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, date: tooEarlyDate });
      expect(response.body.data?.cardsFromDeck).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.validationErrors.invalidDateError);
    });

    it('Error when date too far in the future', async () => {
      const dateTooLongInTheFuture = helpers.calculateDateToString(constants.review.maxReviewInterval + 1);
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, date: dateTooLongInTheFuture });
      expect(response.body.data?.cardsFromDeck).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.validationErrors.invalidDateError);
    });

    describe('Fetch new cards from kanji deck (id = 1)', () => {

      it('Succesfully fetch new cards as non-member account', async () => {
        const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, cardsFromDeck);
        response.body.data.cardsFromDeck.forEach(card => cardEvaluator(card, true, false, true));
        expect(response.body.errors).toBeUndefined();
      });

      it('Succesfully fetch new cards as member account', async () => {
        const response = await sendRequest(testUrl, memberAuthToken, queries.cardsFromDeck, cardsFromDeck);
        response.body.data.cardsFromDeck.forEach(card => cardEvaluator(card, true, true, true));
        expect(response.body.errors).toBeUndefined();
      });
    });

    describe('Fetch new cards from word deck (id = 2)', () => {

      it('Succesfully fetch new cards as non-member account', async () => {
        const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, deckId: 2 });
        response.body.data.cardsFromDeck.forEach(card => cardEvaluator(card, true, false, true));
        expect(response.body.errors).toBeUndefined();
      });

      it('Succesfully fetch new cards as member account', async () => {
        const response = await sendRequest(testUrl, memberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, deckId: 2 });
        response.body.data.cardsFromDeck.forEach(card => cardEvaluator(card, true, true, true));
        expect(response.body.errors).toBeUndefined();
      });
    });
  });

  describe('Fetch due cards', () => {
    
    it('Authentication error when not logged in', async () => {
      const response = await sendRequest(testUrl, null, queries.cardsFromDeck, { ...cardsFromDeck, newCards: false });
      expect(response.body.data?.cardsFromDeck).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Error when deck id not send', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, null);
      expect(response.body.data?.cardsFromDeck).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when deck id wrong type (string)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, newCards: false, deckId: '1' });
      expect(response.body.data?.cardsFromDeck).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when deck id negative integer', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, newCards: false, deckId: -1 });
      expect(response.body.data?.cardsFromDeck).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.validationErrors.negativeNumberTypeError);
    });

    it('Error when deck id zero integer', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, newCards: false, deckId: 0 });
      expect(response.body.data?.cardsFromDeck).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.validationErrors.negativeNumberTypeError);
    });

    it('Error when language id non existing ENUM', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, newCards: false, languageId: 'XX' });
      expect(response.body.data?.cardsFromDeck).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when language id wrong type (integer)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, newCards: false, languageId: 1 });
      expect(response.body.data?.cardsFromDeck).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });
    
    it('Error when new cards wrong type (string)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, newCards: 'false' });
      expect(response.body.data?.cardsFromDeck).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when date wrong type (string)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, newCards: false, date: 'XX' });
      expect(response.body.data?.cardsFromDeck).toBeUndefined();
      expect(response.body.errors[0].extensions.exception.message).toContain(errors.graphQlErrors.validationError);
    });

    it('Error when date invalid', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, newCards: false, date: '2022-2-29' });
      expect(response.body.data?.cardsFromDeck).toBeUndefined();
      expect(response.body.errors[0].extensions.exception.message).toContain(errors.graphQlErrors.validationError);
    });

    it('Error when date earlier than allowed', async () => {
      // date can be maximum 1 day before the server date
      const tooEarlyDate = helpers.calculateDateToString(-2);
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, newCards: false, date: tooEarlyDate });
      expect(response.body.data?.cardsFromDeck).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.validationErrors.invalidDateError);
    });

    it('Error when date too far in the future', async () => {
      const dateTooLongInTheFuture = helpers.calculateDateToString(constants.review.maxReviewInterval + 1);
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, newCards: false, date: dateTooLongInTheFuture });
      expect(response.body.data?.cardsFromDeck).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.validationErrors.invalidDateError);
    });

    it('Error when no due cards', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, newCards: false });
      expect(response.body.data?.cardsFromDeck).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.cardErrors.noDueCardsError);
    });

    describe('Fetch due cards from kanji deck (id = 1)', () => {

      it('Succesfully fetch due cards as non-member account', async () => {
        await addReviews(20);
        const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, newCards: false });
        response.body.data.cardsFromDeck.forEach(card => cardEvaluator(card, false, false, true));
        expect(response.body.data.cardsFromDeck.length).toBe(20);
        expect(response.body.errors).toBeUndefined();
      });

      it('Deck settings max due reviews = 10, should return 10 cards even when 20 due', async () => {
        await addReviews(20);
        await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, { deckId: 1, reviewsPerDay: 10 });
        const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, newCards: false });
        response.body.data.cardsFromDeck.forEach(card => cardEvaluator(card, false, false, true));
        expect(response.body.data.cardsFromDeck.length).toBe(10);
        expect(response.body.errors).toBeUndefined();
      });

      it('Deck settings max due reviews = 10, should return no due cards error when 10 due cards have been reviewed', async () => {
        await addReviews(20);
        await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, { deckId: 1, reviewsPerDay: 10 });
        let response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, newCards: false });
        const cards = response.body.data.cardsFromDeck;
        expect(cards.length).toBe(10);
        expect(response.body.errors).toBeUndefined();

        for (let i = 1; i <= cards.length; i++) {
          await sendRequest(testUrl, nonMemberAuthToken, mutations.rescheduleCard, {
            cardId: i,
            reviewResult: 'AGAIN',
            newInterval: constants.review.matureInterval,
            newEasyFactor: 2.5,
            date: dateToday,
            reviewType: 'RECALL'
          });
        }

        response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, newCards: false });
        expect(response.body.data?.cardsFromDeck).toBeUndefined();
        expect(response.body.errors[0].extensions.code).toContain(errors.cardErrors.noDueCardsError);
      });

      it('Succesfully fetch due cards as member account', async () => {
        await addReviews(20);
        const response = await sendRequest(testUrl, memberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, newCards: false });
        response.body.data.cardsFromDeck.forEach(card => cardEvaluator(card, false, true, true));
        expect(response.body.data.cardsFromDeck.length).toBe(20);
        expect(response.body.errors).toBeUndefined();
      });

      it('Setting non-member account as member should include custom story and hint in the due cards', async () => {
        await addReviews(20);
        await testHelpers.setMembership(nonMemberAcc.id, true);
        const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, newCards: false });
        response.body.data.cardsFromDeck.forEach(card => cardEvaluator(card, false, true, true));
        expect(response.body.data.cardsFromDeck.length).toBe(20);
        expect(response.body.errors).toBeUndefined();
      });
    });

    describe('Fetch due cards from word deck (id = 2)', () => {

      it('Succesfully fetch due cards as non-member account', async () => {
        await addReviews(20);
        const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, deckId: 2, newCards: false });
        response.body.data.cardsFromDeck.forEach(card => cardEvaluator(card, false, false, true));
        expect(response.body.data.cardsFromDeck.length).toBe(20);
        expect(response.body.errors).toBeUndefined();
      });

      it('Deck settings max due reviews = 10, should return 10 cards even when 20 due', async () => {
        await addReviews(20);
        await sendRequest(testUrl, nonMemberAuthToken, mutations.changeDeckSettings, { deckId: 2, reviewsPerDay: 10 });
        const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, deckId: 2, newCards: false });
        response.body.data.cardsFromDeck.forEach(card => cardEvaluator(card, false, false, true));
        expect(response.body.data.cardsFromDeck.length).toBe(10);
        expect(response.body.errors).toBeUndefined();
      });

      it('Succesfully fetch due cards as non-member account', async () => {
        await addReviews(20);
        const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, deckId: 2, newCards: false });
        response.body.data.cardsFromDeck.forEach(card => cardEvaluator(card, false, false, true));
        expect(response.body.data.cardsFromDeck.length).toBe(20);
        expect(response.body.errors).toBeUndefined();
      });

      it('Succesfully fetch due cards as member account', async () => {
        await addReviews(20);
        const response = await sendRequest(testUrl, memberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, deckId: 2, newCards: false });
        response.body.data.cardsFromDeck.forEach(card => cardEvaluator(card, false, true, true));
        expect(response.body.data.cardsFromDeck.length).toBe(20);
        expect(response.body.errors).toBeUndefined();
      });


      it('Setting non-member account as member should include custom story and hint in the due cards', async () => {
        await addReviews(20);
        await testHelpers.setMembership(nonMemberAcc.id, true);
        const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, deckId: 2, newCards: false });
        response.body.data.cardsFromDeck.forEach(card => cardEvaluator(card, false, true, true));
        expect(response.body.data.cardsFromDeck.length).toBe(20);
        expect(response.body.errors).toBeUndefined();
      });
    });
  });

  describe('Fetch all card due counts grouped by date', () => {

    it('Authentication error when not logged in', async () => {
      const response = await sendRequest(testUrl, null, queries.dueCount, { limitReviews: 10, date: dateToday });
      expect(response.body.data?.dueCount).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Error when limit reviews not send', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.dueCount, null);
      expect(response.body.data?.dueCount).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when limit reviews wrong type (string)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.dueCount,  { limitReviews: '10', date: dateToday });
      expect(response.body.data?.dueCount).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when limit reviews negative integer', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.dueCount,  { limitReviews: -1, date: dateToday });
      expect(response.body.data?.dueCount).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.validationErrors.negativeNumberTypeError);
    });

    it('Error when limit reviews zero integer', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.dueCount,  { limitReviews: 0, date: dateToday });
      expect(response.body.data?.dueCount).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.validationErrors.negativeNumberTypeError);
    });

    it('Error when date wrong type (string)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.dueCount,  { limitReviews: 10, date: 'XX' });
      expect(response.body.data?.dueCount).toBeUndefined();
      expect(response.body.errors[0].extensions.exception.message).toContain(errors.graphQlErrors.validationError);
    });

    it('Error when date invalid', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.dueCount,  { limitReviews: 10, date: '2022-2-29' });
      expect(response.body.data?.dueCount).toBeUndefined();
      expect(response.body.errors[0].extensions.exception.message).toContain(errors.graphQlErrors.validationError);
    });

    it('Error when date earlier than allowed', async () => {
      // date can be maximum 1 day before the server date
      const tooEarlyDate = helpers.calculateDateToString(-2);
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.dueCount,  { limitReviews: 10, date: tooEarlyDate });
      expect(response.body.data?.dueCount).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.validationErrors.invalidDateError);
    });

    it('Error when date too far in the future', async () => {
      const dateTooLongInTheFuture = helpers.calculateDateToString(constants.review.maxReviewInterval + 1);
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.dueCount,  { limitReviews: 10, date: dateTooLongInTheFuture });
      expect(response.body.data?.dueCount).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.validationErrors.invalidDateError);
    });

    it('Should return empty array if no cards due', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.dueCount,  { limitReviews: 10, date: dateToday });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.dueCount).toBeDefined();
      expect(response.body.data.dueCount.length).toBe(0);
    });

    /*
    it('Succesfully fetch next 10 days due review count grouped by date', async () => {
      await addReviews();
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.dueCount,  { limitReviews: 10, date: '2022-12-23' });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.dueCount).toBeDefined();
      expect(response.body.data.dueCount[0].date).toBe(dateToday.toISOString().split('T')[0]);
      expect(response.body.data.dueCount[0].reviews).toBe(40);
      expect(response.body.data.dueCount.length).toBe(1);
    });

    it('Succesfully fetch all by setting limitReviews high', async () => {
      await addReviews();
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.dueCount,  { limitReviews: 9999, date: '2022-12-23' });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.dueCount).toBeDefined();
      expect(response.body.data.dueCount[0].date).toBe(dateToday.toISOString().split('T')[0]);
      expect(response.body.data.dueCount[0].reviews).toBe(40);
      expect(response.body.data.dueCount.length).toBe(20);
    });
    */
  });

  describe('Fetch review history', () => {

    it('Authentication error when not logged in', async () => {
      const response = await sendRequest(testUrl, null, queries.reviewHistory, { limitReviews: 10 });
      expect(response.body.data?.reviewHistory).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Error when limit reviews not send', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.reviewHistory, { limitReviews: null });
      expect(response.body.data?.reviewHistory).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when limit reviews wrong type (string)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.reviewHistory,  { limitReviews: '10' });
      expect(response.body.data?.reviewHistory).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when limit reviews negative integer', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.reviewHistory,  { limitReviews: -1 });
      expect(response.body.data?.reviewHistory).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.validationErrors.negativeNumberTypeError);
    });

    it('Error when limit reviews zero integer', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.reviewHistory,  { limitReviews: 0 });
      expect(response.body.data?.reviewHistory).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.validationErrors.negativeNumberTypeError);
    });

    it('Should return empty array (length 0) if no cards due', async () => {
      const response = await sendRequest(testUrl, memberAuthToken, queries.reviewHistory,  { limitReviews: 10 });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.reviewHistory).toBeDefined();
      expect(response.body.data.reviewHistory.length).toBe(0);
    });

    it('Succesfully fetch 10 days review history', async () => {
      //add extra reviews to the db for non-member account
      await testHelpers.addReviews(nonMemberAcc.id, 30);
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.reviewHistory,  { limitReviews: 10 });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.reviewHistory).toBeDefined();
      expect(response.body.data.reviewHistory[0].date).toBeDefined();
      expect(response.body.data.reviewHistory[0].reviews).toBeDefined();
      expect(response.body.data.reviewHistory.length).toBe(10);
      // all dates in the result must be this date or earlier
      const result = response.body.data.reviewHistory.every(review => new Date(review.date) <= dateToday);
      expect(result).toBe(true);
    });
  });

  describe('Fetch learning statistics based on type', () => {

    it('Authentication error when not logged in', async () => {
      const response = await sendRequest(testUrl, null, queries.learningStatisticsByType, { cardType: 'KANJI', reviewType: 'RECALL' });
      expect(response.body.data?.learningStatisticsByType).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Error when card type not send', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.learningStatisticsByType, { cardType: null, reviewType: 'RECALL' });
      expect(response.body.data?.learningStatisticsByType).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when review type not send', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.learningStatisticsByType, { cardType: 'KANJI', reviewType: null });
      expect(response.body.data?.learningStatisticsByType).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when card type non existing ENUM', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.learningStatisticsByType,  { cardType: 'NONEXISTING', reviewType: 'RECALL' });
      expect(response.body.data?.learningStatisticsByType).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when review type non existing ENUM', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.learningStatisticsByType,  { cardType: 'KANJI', reviewType: 'NONEXISTING' });
      expect(response.body.data?.learningStatisticsByType).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when card type wrong type (integer)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.learningStatisticsByType,  { cardType: 1, reviewType: 'RECALL' });
      expect(response.body.data?.learningStatisticsByType).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when review type wrong type (integer)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.learningStatisticsByType,  { cardType: 'KANJI', reviewType: 1 });
      expect(response.body.data?.learningStatisticsByType).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Succesfully fetch KANJI type statistics, matured: 0, learning: 0 when now reviews', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.learningStatisticsByType,  { cardType: 'KANJI', reviewType: 'RECALL' });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.learningStatisticsByType).toBeDefined();
      expect(response.body.data.learningStatisticsByType.matured).toBe(0);
      expect(response.body.data.learningStatisticsByType.learning).toBe(0);
      expect(response.body.data.learningStatisticsByType.new).toBeDefined();
    });

    it('Succesfully fetch WORD type statistics, matured: 0, learning: 0 when now reviews', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.learningStatisticsByType,  { cardType: 'WORD', reviewType: 'RECALL' });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.learningStatisticsByType).toBeDefined();
      expect(response.body.data.learningStatisticsByType.matured).toBe(0);
      expect(response.body.data.learningStatisticsByType.learning).toBe(0);
      expect(response.body.data.learningStatisticsByType.new).toBeDefined();
    });

    it('Rescheduling one card as mature should increase KANJI type statistics mature field by one', async () => {
      let response = await sendRequest(testUrl, nonMemberAuthToken, queries.learningStatisticsByType,  { cardType: 'KANJI', reviewType: 'RECALL' });
      matureCount = response.body.data.learningStatisticsByType.matured;
      newCount = response.body.data.learningStatisticsByType.new;
      await sendRequest(testUrl, nonMemberAuthToken, mutations.rescheduleCard, { ...accountReview, newInterval: constants.review.matureInterval });
      response = await sendRequest(testUrl, nonMemberAuthToken, queries.learningStatisticsByType,  { cardType: 'KANJI', reviewType: 'RECALL' });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.learningStatisticsByType).toBeDefined();
      expect(response.body.data.learningStatisticsByType.matured).toBe(matureCount + 1);
      expect(response.body.data.learningStatisticsByType.learning).toBeDefined();
      expect(response.body.data.learningStatisticsByType.new).toBe(newCount - 1);
    });
  });

  describe('Fetch cards based on type (limited to admins)', () => {

    it('Authentication error when not logged in', async () => {
      const response = await sendRequest(testUrl, null, queries.cardsByType, { cardType: 'KANJI', languageId: 'EN' });
      expect(response.body.data?.cardsByType).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Unauthorized error when logged in but not admin', async () => {
      const response = await sendRequest(testUrl, memberAuthToken, queries.cardsByType, { cardType: 'KANJI', languageId: 'EN' });
      expect(response.body.data?.cardsByType).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.adminErrors.noAdminRightsError);
    });

    it('Error when admin but card type not send', async () => {
      const response = await sendRequest(testUrl, adminAuthReadToken, queries.cardsByType, { languageId: 'EN' });
      expect(response.body.data?.cardsByType).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when admin but card type non existing ENUM', async () => {
      const response = await sendRequest(testUrl, adminAuthReadToken, queries.cardsByType, { cardType: 'NONEXISTING', languageId: 'EN' });
      expect(response.body.data?.cardsByType).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when admin but card type wrong type (integer)', async () => {
      const response = await sendRequest(testUrl, adminAuthReadToken, queries.cardsByType, { cardType: 1, languageId: 'EN' });
      expect(response.body.data?.cardsByType).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when admin but language id non existing ENUM', async () => {
      const response = await sendRequest(testUrl, adminAuthReadToken, queries.cardsByType, { cardType: 'KANJI', languageId: 'XX' });
      expect(response.body.data?.cardsByType).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when admin but language id wrong type (integer)', async () => {
      const response = await sendRequest(testUrl, adminAuthReadToken, queries.cardsByType, { cardType: 'KANJI', languageId: 1 });
      expect(response.body.data?.cardsByType).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Succesfully fetch all KANJI cards when admin (read), language id set EN', async () => {
      const response = await sendRequest(testUrl, adminAuthReadToken, queries.cardsByType, { cardType: 'KANJI', languageId: 'EN' });
      response.body.data.cardsByType.forEach(card => cardEvaluator(card, true, true, false));
      expect(response.body.errors).toBeUndefined();
    });

    it('Succesfully fetch all KANJI cards when admin (read), language id not set, defaults to EN', async () => {
      const response = await sendRequest(testUrl, adminAuthReadToken, queries.cardsByType, { cardType: 'KANJI' });
      response.body.data.cardsByType.forEach(card => cardEvaluator(card, true, true, false));
      expect(response.body.errors).toBeUndefined();
    });

    it('Succesfully fetch all WORD cards when admin (read), language id set EN', async () => {
      const response = await sendRequest(testUrl, adminAuthReadToken, queries.cardsByType, { cardType: 'WORD', languageId: 'EN' });
      response.body.data.cardsByType.forEach(card => cardEvaluator(card, true, true, false));
      expect(response.body.errors).toBeUndefined();
    });

    it('Succesfully fetch all WORD cards when admin (read), language id not set, defaults to EN', async () => {
      const response = await sendRequest(testUrl, adminAuthReadToken, queries.cardsByType, { cardType: 'WORD' });
      response.body.data.cardsByType.forEach(card => cardEvaluator(card, true, true, false));
      expect(response.body.errors).toBeUndefined();
    });

    it('Succesfully fetch when admin (write)', async () => {
      const response = await sendRequest(testUrl, adminAuthWriteToken, queries.cardsByType, { cardType: 'KANJI', languageId: 'EN' });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.cardsByType).toBeDefined();
      expect(response.body.data.cardsByType[0].id).toBeDefined();
    });
  });

  describe('Edit account card', () => {

    it('Authentication error when not logged in', async () => {
      const response = await sendRequest(testUrl, null, mutations.editAccountCard, accountCard);
      expect(response.body.data?.editAccountCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Error when card id not send', async () => {
      const response = await sendRequest(testUrl, memberAuthToken, mutations.editAccountCard, { ...accountCard, cardId: null });
      expect(response.body.data?.editAccountCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when card does not exist', async () => {
      const response = await sendRequest(testUrl, memberAuthToken, mutations.editAccountCard, { ...accountCard, cardId: 99999 });
      expect(response.body.data?.editAccountCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.cardErrors.nonExistingCardIdError);
    });

    it('Error when card id wrong type (string)', async () => {
      const response = await sendRequest(testUrl, memberAuthToken, mutations.editAccountCard, { ...accountCard, cardId: '1' });
      expect(response.body.data?.editAccountCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when story wrong type (integer)', async () => {
      const response = await sendRequest(testUrl, memberAuthToken, mutations.editAccountCard, { ...accountCard, story: 1 });
      expect(response.body.data?.editAccountCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when hint wrong type (integer)', async () => {
      const response = await sendRequest(testUrl, memberAuthToken, mutations.editAccountCard, { ...accountCard, hint: 1 });
      expect(response.body.data?.editAccountCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when story too long', async () => {
      const response = await sendRequest(testUrl, memberAuthToken, mutations.editAccountCard, { ...accountCard, story: 'x'.repeat(constants.card.storyMaxLength + 1) });
      expect(response.body.data?.editAccountCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.cardErrors.storyTooLongError);
    });

    it('Error when story too short', async () => {
      const response = await sendRequest(testUrl, memberAuthToken, mutations.editAccountCard, { ...accountCard, story: 'x'.repeat(constants.card.storyMinLength - 1) });
      expect(response.body.data?.editAccountCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.cardErrors.storyTooShortError);
    });

    it('Error when hint too long', async () => {
      const response = await sendRequest(testUrl, memberAuthToken, mutations.editAccountCard, { ...accountCard, hint: 'x'.repeat(constants.card.hintMaxLength + 1) });
      expect(response.body.data?.editAccountCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.cardErrors.hintTooLongError);
    });

    it('Error when hint too short', async () => {
      const response = await sendRequest(testUrl, memberAuthToken, mutations.editAccountCard, { ...accountCard, hint: 'x'.repeat(constants.card.storyMinLength - 1)});
      expect(response.body.data?.editAccountCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.cardErrors.hintTooShortError);
    });

    it('Error when both story ands hint not provided', async () => {
      const response = await sendRequest(testUrl, memberAuthToken, mutations.editAccountCard, { cardId: accountCard.cardId });
      expect(response.body.data?.editAccountCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.cardErrors.provideStoryOrHintError);
    });

    it('Error when non-member submitting the custom card information', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.editAccountCard, accountCard);
      expect(response.body.data?.editAccountCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.accountErrors.memberFeatureError);
    });

    it('Succesfully set story and hint after logged in and active member', async () => {
      const response = await sendRequest(testUrl, memberAuthToken, mutations.editAccountCard, accountCard);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.editAccountCard).toBeDefined();
      expect(response.body.data.editAccountCard.id).toBeDefined();
      expect(response.body.data.editAccountCard.accountId).toBe(memberAcc.id);
      expect(response.body.data.editAccountCard.cardId).toBe(accountCard.cardId);
      expect(response.body.data.editAccountCard.accountStory).toBe(accountCard.story);
      expect(response.body.data.editAccountCard.accountHint).toBe(accountCard.hint);
      expect(response.body.data.editAccountCard.createdAt).toBeDefined();
      expect(response.body.data.editAccountCard.updatedAt).toBeDefined();
    });

    it('Succesfully set only story (first time edit), hint is null', async () => {
      const response = await sendRequest(testUrl, memberAuthToken, mutations.editAccountCard, { cardId: accountCard.cardId, story: accountCard.story });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.editAccountCard).toBeDefined();
      expect(response.body.data.editAccountCard.id).toBeDefined();
      expect(response.body.data.editAccountCard.accountId).toBe(memberAcc.id);
      expect(response.body.data.editAccountCard.cardId).toBe(accountCard.cardId);
      expect(response.body.data.editAccountCard.accountStory).toBe(accountCard.story);
      expect(response.body.data.editAccountCard.accountHint).toBe(null);
      expect(response.body.data.editAccountCard.createdAt).toBeDefined();
      expect(response.body.data.editAccountCard.updatedAt).toBeDefined();
    });

    it('Succesfully set only hint (first time edit), story is null', async () => {
      const response = await sendRequest(testUrl, memberAuthToken, mutations.editAccountCard, { cardId: accountCard.cardId, hint: accountCard.hint });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.editAccountCard).toBeDefined();
      expect(response.body.data.editAccountCard.id).toBeDefined();
      expect(response.body.data.editAccountCard.accountId).toBe(memberAcc.id);
      expect(response.body.data.editAccountCard.cardId).toBe(accountCard.cardId);
      expect(response.body.data.editAccountCard.accountStory).toBe(null);
      expect(response.body.data.editAccountCard.accountHint).toBe(accountCard.hint);
      expect(response.body.data.editAccountCard.createdAt).toBeDefined();
      expect(response.body.data.editAccountCard.updatedAt).toBeDefined();
    });

    it('Succesfully set only story, hint should not change', async () => {
      let response = await sendRequest(testUrl, memberAuthToken, mutations.editAccountCard, accountCard);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.editAccountCard.id).toBeDefined();
      expect(response.body.data.editAccountCard.accountId).toBe(memberAcc.id);
      expect(response.body.data.editAccountCard.cardId).toBe(accountCard.cardId);
      expect(response.body.data.editAccountCard.accountStory).toBe(accountCard.story);
      expect(response.body.data.editAccountCard.accountHint).toBe(accountCard.hint);
      expect(response.body.data.editAccountCard.createdAt).toBeDefined();
      expect(response.body.data.editAccountCard.updatedAt).toBeDefined();
      response = await sendRequest(testUrl, memberAuthToken, mutations.editAccountCard, { cardId: accountCard.cardId, story: '1234567abcdefg' });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.editAccountCard.id).toBeDefined();
      expect(response.body.data.editAccountCard.accountId).toBe(memberAcc.id);
      expect(response.body.data.editAccountCard.cardId).toBe(accountCard.cardId);
      expect(response.body.data.editAccountCard.accountStory).toBe('1234567abcdefg');
      expect(response.body.data.editAccountCard.accountHint).toBe(accountCard.hint);
      expect(response.body.data.editAccountCard.createdAt).toBeDefined();
      expect(response.body.data.editAccountCard.updatedAt).toBeDefined();
    });

    it('Succesfully set only hint, story should not change', async () => {
      let response = await sendRequest(testUrl, memberAuthToken, mutations.editAccountCard, accountCard);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.editAccountCard.id).toBeDefined();
      expect(response.body.data.editAccountCard.accountId).toBe(memberAcc.id);
      expect(response.body.data.editAccountCard.cardId).toBe(accountCard.cardId);
      expect(response.body.data.editAccountCard.accountStory).toBe(accountCard.story);
      expect(response.body.data.editAccountCard.accountHint).toBe(accountCard.hint);
      expect(response.body.data.editAccountCard.createdAt).toBeDefined();
      expect(response.body.data.editAccountCard.updatedAt).toBeDefined();
      response = await sendRequest(testUrl, memberAuthToken, mutations.editAccountCard, { cardId: accountCard.cardId, hint: '1234567abcdefg' });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.editAccountCard.id).toBeDefined();
      expect(response.body.data.editAccountCard.accountId).toBe(memberAcc.id);
      expect(response.body.data.editAccountCard.cardId).toBe(accountCard.cardId);
      expect(response.body.data.editAccountCard.accountStory).toBe(accountCard.story);
      expect(response.body.data.editAccountCard.accountHint).toBe('1234567abcdefg');
      expect(response.body.data.editAccountCard.createdAt).toBeDefined();
      expect(response.body.data.editAccountCard.updatedAt).toBeDefined();
    });
  });

  describe('Reschedule card', () => {

    it('Authentication error when not logged in', async () => {
      const response = await sendRequest(testUrl, null, mutations.rescheduleCard, accountReview);
      expect(response.body.data?.rescheduleCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Error when card id not send', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.rescheduleCard, { ...accountReview, cardId: null });
      expect(response.body.data?.rescheduleCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when review result not send', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.rescheduleCard, { ...accountReview, reviewResult: null });
      expect(response.body.data?.rescheduleCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when new interval not send', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.rescheduleCard, { ...accountReview, newInterval: null });
      expect(response.body.data?.rescheduleCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when new easy factor not send', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.rescheduleCard, { ...accountReview, newEasyFactor: null });
      expect(response.body.data?.rescheduleCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when date not send', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.rescheduleCard, { ...accountReview, date: null });
      expect(response.body.data?.rescheduleCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when review type not send', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.rescheduleCard, { ...accountReview, reviewType: null });
      expect(response.body.data?.rescheduleCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when card id wrong type (string)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.rescheduleCard, { ...accountReview, cardId: '1' });
      expect(response.body.data?.rescheduleCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when card id negative integer', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.rescheduleCard, { ...accountReview, cardId: -1 });
      expect(response.body.data?.rescheduleCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.validationErrors.negativeNumberTypeError);
    });

    it('Error when card id zero integer)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.rescheduleCard, { ...accountReview, cardId: 0 });
      expect(response.body.data?.rescheduleCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.validationErrors.negativeNumberTypeError);
    });

    it('Error when review result wrong type (integer)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.rescheduleCard, { ...accountReview, reviewResult: 1 });
      expect(response.body.data?.rescheduleCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when review result non-existing ENUM', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.rescheduleCard, { ...accountReview, reviewResult: 'NOTEXIST' });
      expect(response.body.data?.rescheduleCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when review type wrong type (integer)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.rescheduleCard, { ...accountReview, reviewType: 1 });
      expect(response.body.data?.rescheduleCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when review type non-existing ENUM', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.rescheduleCard, { ...accountReview, reviewType: 'NOTEXIST' });
      expect(response.body.data?.rescheduleCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when new interval wrong type (string)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.rescheduleCard, { ...accountReview, newInterval: '1' });
      expect(response.body.data?.rescheduleCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when new interval too long', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.rescheduleCard, {
        ...accountReview,
        newInterval: constants.review.maxReviewInterval + 1
      });
      expect(response.body.data?.rescheduleCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.cardErrors.maxReviewIntervalError);
    });

    it('Error when new interval too long', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.rescheduleCard, {
        ...accountReview,
        newInterval: constants.review.minReviewInterval - 1
      });
      expect(response.body.data?.rescheduleCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.cardErrors.minReviewIntervalError);
    });

    it('Error when new easy factor wrong type (string)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.rescheduleCard, { ...accountReview, newEasyFactor: '1.0' });
      expect(response.body.data?.rescheduleCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when timing wrong type (string)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.rescheduleCard, { ...accountReview, timing: '1' });
      expect(response.body.data?.rescheduleCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when extra review wrong type (string)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.rescheduleCard, { ...accountReview, extraReview: '1' });
      expect(response.body.data?.rescheduleCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when date wrong type (string)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.rescheduleCard, { ...accountReview, date: 'XX' });
      expect(response.body.data?.rescheduleCard).toBeUndefined();
      expect(response.body.errors[0].extensions.exception.message).toContain(errors.graphQlErrors.validationError);
    });

    it('Error when date invalid', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.rescheduleCard, { ...accountReview, date: '2022-2-29' });
      expect(response.body.data?.rescheduleCard).toBeUndefined();
      expect(response.body.errors[0].extensions.exception.message).toContain(errors.graphQlErrors.validationError);
    });

    it('Error when date earlier than allowed', async () => {
      // date can be maximum 1 day before the server date
      const tooEarlyDate = helpers.calculateDateToString(-2);
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.rescheduleCard, { ...accountReview, date: tooEarlyDate });
      expect(response.body.data?.rescheduleCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.validationErrors.invalidDateError);
    });

    it('Error when date too far in the future', async () => {
      const dateTooLongInTheFuture = helpers.calculateDateToString(constants.review.maxReviewInterval + 1);
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.rescheduleCard, { ...accountReview, date: dateTooLongInTheFuture });
      expect(response.body.data?.rescheduleCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.validationErrors.invalidDateError);
    });

    it('Succesfull when all validations pass and logged in (non-member)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.rescheduleCard, accountReview);
      accountCardEvaluator(response.body.data.rescheduleCard, 1, accountReview.newEasyFactor);
      expect(response.body.errors).toBeUndefined();
    });

    it('Succesfull when all validations pass and logged in (member)', async () => {
      const response = await sendRequest(testUrl, memberAuthToken, mutations.rescheduleCard, accountReview);
      accountCardEvaluator(response.body.data.rescheduleCard, 1, accountReview.newEasyFactor);
      expect(response.body.errors).toBeUndefined();
    });

    it('Rescheduling again should increment review count by one', async () => {
      await sendRequest(testUrl, memberAuthToken, mutations.rescheduleCard, accountReview);
      const response = await sendRequest(testUrl, memberAuthToken, mutations.rescheduleCard, accountReview);
      accountCardEvaluator(response.body.data.rescheduleCard, 2, accountReview.newEasyFactor, null, null, false);
      expect(response.body.errors).toBeUndefined();
    });

    it('Rescheduling card with high enough interval should make card mature', async () => {
      const response = await sendRequest(testUrl, memberAuthToken, mutations.rescheduleCard, { ...accountReview, newInterval: constants.review.matureInterval });
      accountCardEvaluator(response.body.data.rescheduleCard, 1, accountReview.newEasyFactor, null, null, true);
      expect(response.body.errors).toBeUndefined();
    });
  });
});
