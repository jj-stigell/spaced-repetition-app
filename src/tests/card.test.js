const { expect, describe, beforeAll, afterAll, it } = require('@jest/globals');
const { PORT } = require('../util/config');
const { connectToDatabase } = require('../database');
const { account, adminReadRights, adminWriteRights, nonMemberAccount, accountCard, accountReview, cardsFromDeck } = require('./utils/constants'); 
const mutations = require('./utils/mutations');
const { cardEvaluator } = require('./utils/expectHelper');
const errors = require('../util/errors/errors');
const server = require('../util/server');
const helpers = require('./utils/helper');
const sendRequest = require('./utils/request');
const constants = require('../util/constants');
const queries = require('./utils/queries');

describe('Cardintegration tests', () => {
  // eslint-disable-next-line no-unused-vars
  let testServer, testUrl, memberAuthToken, adminAuthReadToken, adminAuthWriteToken, nonMemberAuthToken, memberAcc, nonMemberAcc, adminReadAcc, adminWriteAcc, matureCount, newCount;
  // before the tests spin up an Apollo Server
  beforeAll(async () => {
    await connectToDatabase();
    await helpers.resetDatabaseEntries('card');
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

    it('Error when limit reviews negative integer', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, deckId: -1 });
      expect(response.body.data?.cardsFromDeck).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.negativeNumberTypeError);
    });

    it('Error when limit reviews zero integer', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, deckId: 0 });
      expect(response.body.data?.cardsFromDeck).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.negativeNumberTypeError);
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

    it('Error when limit reviews negative integer', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, newCards: false, deckId: -1 });
      expect(response.body.data?.cardsFromDeck).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.negativeNumberTypeError);
    });

    it('Error when limit reviews zero integer', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, newCards: false, deckId: 0 });
      expect(response.body.data?.cardsFromDeck).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.negativeNumberTypeError);
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

    it('Error when no due cards', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, newCards: false });
      expect(response.body.data?.cardsFromDeck).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.noDueCardsError);
    });

    describe('Fetch due cards from kanji deck (id = 1)', () => {

      it('Add reviews to the deck', async () => {
        await helpers.addDueReviewsForThisDay(nonMemberAcc.id, 20, 1);
        await helpers.addDueReviewsForThisDay(memberAcc.id, 20, 1);
        expect(1).toBe(1);
      });

      it('Succesfully fetch new cards as non-member account', async () => {
        const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, newCards: false });
        response.body.data.cardsFromDeck.forEach(card => cardEvaluator(card, false, false, true));
        expect(response.body.data.cardsFromDeck.length).toBe(20);
        expect(response.body.errors).toBeUndefined();
      });

      it('Succesfully fetch new cards as member account', async () => {
        const response = await sendRequest(testUrl, memberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, newCards: false });
        response.body.data.cardsFromDeck.forEach(card => cardEvaluator(card, false, true, true));
        expect(response.body.data.cardsFromDeck.length).toBe(20);
        expect(response.body.errors).toBeUndefined();
      });
    });

    describe('Fetch due cards from word deck (id = 2)', () => {

      it('Add reviews to the deck', async () => {
        await helpers.addDueReviewsForThisDay(nonMemberAcc.id, 20, 200);
        await helpers.addDueReviewsForThisDay(memberAcc.id, 20, 200);
        expect(1).toBe(1);
      });

      it('Succesfully fetch new cards as non-member account', async () => {
        const response = await sendRequest(testUrl, nonMemberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, deckId: 2, newCards: false });
        response.body.data.cardsFromDeck.forEach(card => cardEvaluator(card, false, false, true));
        expect(response.body.data.cardsFromDeck.length).toBe(20);
        expect(response.body.errors).toBeUndefined();
      });

      it('Succesfully fetch new cards as member account', async () => {
        const response = await sendRequest(testUrl, memberAuthToken, queries.cardsFromDeck, { ...cardsFromDeck, deckId: 2, newCards: false });
        response.body.data.cardsFromDeck.forEach(card => cardEvaluator(card, false, true, true));
        expect(response.body.data.cardsFromDeck.length).toBe(20);
        expect(response.body.errors).toBeUndefined();
      });
    });
  });

  describe('Fetch all card due counts grouped by date', () => {

    it('Authentication error when not logged in', async () => {
      const response = await sendRequest(testUrl, null, queries.dueCount, { limitReviews: 10 });
      expect(response.body.data?.dueCount).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Error when limit reviews not send', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.dueCount, null);
      expect(response.body.data?.dueCount).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when limit reviews wrong type (string)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.dueCount,  { limitReviews: '10' });
      expect(response.body.data?.dueCount).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when limit reviews negative integer', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.dueCount,  { limitReviews: -1 });
      expect(response.body.data?.dueCount).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.negativeNumberTypeError);
    });

    it('Error when limit reviews zero integer', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.dueCount,  { limitReviews: 0 });
      expect(response.body.data?.dueCount).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.negativeNumberTypeError);
    });

    it('Should return empty array (length 0) if no cards due', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.dueCount,  { limitReviews: 10 });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.dueCount).toBeDefined();
      expect(response.body.data.dueCount.length).toBe(0);
    });

    it('Succesfully fetch next 10 days reviews after inserting reviews', async () => {
      const newDate = new Date();
      const fixedDate = newDate.setDate(newDate.getDate() + 10);
      const anotherDate = new Date(fixedDate);
      for (let i = 10; i < 30; i++) {
        await sendRequest(testUrl, nonMemberAuthToken, mutations.rescheduleCard, { ...accountReview, cardId: i, newInterval: i });
      }
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.dueCount,  { limitReviews: 10 });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.dueCount).toBeDefined();
      expect(response.body.data.dueCount[0].date).toBe(anotherDate.toISOString().split('T')[0]);
      expect(response.body.data.dueCount[0].reviews).toBe(1);
      expect(response.body.data.dueCount.length).toBe(10);
    });

    it('Succesfully fetch all by setting limitReviews high', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.dueCount,  { limitReviews: 9999 });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.dueCount).toBeDefined();
      expect(response.body.data.dueCount[0].date).toBeDefined();
      expect(response.body.data.dueCount[0].reviews).toBeDefined();
      expect(response.body.data.dueCount.length).toBe(20);
    });
  });

  describe('Fetch reviewed cards review history', () => {

    it('Authentication error when not logged in', async () => {
      const response = await sendRequest(testUrl, null, queries.reviewHistory, { limitReviews: 10 });
      expect(response.body.data?.reviewHistory).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Error when limit reviews not send', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.reviewHistory, null);
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
      expect(response.body.errors[0].extensions.code).toContain(errors.negativeNumberTypeError);
    });

    it('Error when limit reviews zero integer', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.reviewHistory,  { limitReviews: 0 });
      expect(response.body.data?.reviewHistory).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.negativeNumberTypeError);
    });

    it('Should return empty array (length 0) if no cards due', async () => {
      const response = await sendRequest(testUrl, memberAuthToken, queries.reviewHistory,  { limitReviews: 10 });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.reviewHistory).toBeDefined();
      expect(response.body.data.reviewHistory.length).toBe(0);
    });

    it('Succesfully fetch 10 days review history', async () => {
      //add extra reviews to the db for non-member account
      await helpers.addReviews(nonMemberAcc.id, 30);
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.reviewHistory,  { limitReviews: 10 });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.reviewHistory).toBeDefined();
      expect(response.body.data.reviewHistory[0].date).toBeDefined();
      expect(response.body.data.reviewHistory[0].reviews).toBeDefined();
      expect(response.body.data.reviewHistory.length).toBe(10);
      // all dates in the result must be this date or earlier
      const currentDate = new Date().toISOString().split('T')[0];
      const result = response.body.data.reviewHistory.every(review => review.date <= currentDate);
      expect(result).toBe(true);
    });
  });

  describe('Fetch learning statistics based on type', () => {

    it('Authentication error when not logged in', async () => {
      const response = await sendRequest(testUrl, null, queries.learningStatistics, { cardType: 'KANJI' });
      expect(response.body.data?.learningStatistics).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Error when card type not send', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.learningStatistics, null);
      expect(response.body.data?.learningStatistics).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when card type non existing ENUM', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.learningStatistics,  { cardType: 'NONEXISTING' });
      expect(response.body.data?.learningStatistics).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when card type wrong type (integer)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.learningStatistics,  { cardType: 1 });
      expect(response.body.data?.learningStatistics).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Succesfully fetch KANJI type statistics', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.learningStatistics,  { cardType: 'KANJI' });
      matureCount = response.body.data.learningStatistics.matured;
      newCount = response.body.data.learningStatistics.new;
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.learningStatistics).toBeDefined();
      expect(response.body.data.learningStatistics.matured).toBeDefined();
      expect(response.body.data.learningStatistics.learning).toBeDefined();
      expect(response.body.data.learningStatistics.new).toBeDefined();
    });

    it('Succesfully fetch WORD type statistics', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.learningStatistics,  { cardType: 'WORD' });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.learningStatistics).toBeDefined();
      expect(response.body.data.learningStatistics.matured).toBeDefined();
      expect(response.body.data.learningStatistics.learning).toBeDefined();
      expect(response.body.data.learningStatistics.new).toBeDefined();
    });

    it('Rescheduling one card as mature should increase KANJI type statistics mature field by one', async () => {
      await sendRequest(testUrl, nonMemberAuthToken, mutations.rescheduleCard, { ...accountReview, cardId: 100, newInterval: constants.matureInterval + 1 });
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.learningStatistics,  { cardType: 'KANJI' });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.learningStatistics).toBeDefined();
      expect(response.body.data.learningStatistics.matured).toBe(matureCount + 1);
      expect(response.body.data.learningStatistics.learning).toBeDefined();
      expect(response.body.data.learningStatistics.new).toBe(newCount - 1);
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
      expect(response.body.errors[0].extensions.code).toContain(errors.admin.noAdminRightsError);
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

  describe('Fetch learning statistics based on type', () => {

    it('Authentication error when not logged in', async () => {
      const response = await sendRequest(testUrl, null, queries.learningStatistics, { cardType: 'KANJI' });
      expect(response.body.data?.learningStatistics).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Error when card type not send', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.learningStatistics, null);
      expect(response.body.data?.learningStatistics).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when card type non existing ENUM', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.learningStatistics,  { cardType: 'NONEXISTING' });
      expect(response.body.data?.learningStatistics).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when card type wrong type (integer)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.learningStatistics,  { cardType: 1 });
      expect(response.body.data?.learningStatistics).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Succesfully fetch KANJI type statistics', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.learningStatistics,  { cardType: 'KANJI' });
      matureCount = response.body.data.learningStatistics.matured;
      newCount = response.body.data.learningStatistics.new;
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.learningStatistics).toBeDefined();
      expect(response.body.data.learningStatistics.matured).toBeDefined();
      expect(response.body.data.learningStatistics.learning).toBeDefined();
      expect(response.body.data.learningStatistics.new).toBeDefined();
    });

    it('Succesfully fetch WORD type statistics', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.learningStatistics,  { cardType: 'WORD' });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.learningStatistics).toBeDefined();
      expect(response.body.data.learningStatistics.matured).toBeDefined();
      expect(response.body.data.learningStatistics.learning).toBeDefined();
      expect(response.body.data.learningStatistics.new).toBeDefined();
    });

    it('Rescheduling one card as mature should increase KANJI type statistics mature field by one', async () => {
      await sendRequest(testUrl, nonMemberAuthToken, mutations.rescheduleCard, { ...accountReview, cardId: 78, newInterval: constants.matureInterval + 1 });
      const response = await sendRequest(testUrl, nonMemberAuthToken, queries.learningStatistics,  { cardType: 'KANJI' });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.learningStatistics).toBeDefined();
      expect(response.body.data.learningStatistics.matured).toBe(matureCount + 1);
      expect(response.body.data.learningStatistics.learning).toBeDefined();
      expect(response.body.data.learningStatistics.new).toBe(newCount - 1);
    });
  });

  describe('Edit account card', () => {

    it('Authentication error when not logged in', async () => {
      const response = await sendRequest(testUrl, null, mutations.editAccountCard, accountCard);
      expect(response.body.data?.editAccountCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.unauthenticated);
    });

    it('Error when card id not send', async () => {
      const response = await sendRequest(testUrl, memberAuthToken, mutations.editAccountCard, { story: accountCard.story, hint: accountCard.hint });
      expect(response.body.data?.editAccountCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
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
      expect(response.body.errors[0].extensions.code).toContain(errors.storyTooLongError);
    });

    it('Error when story too short', async () => {
      const response = await sendRequest(testUrl, memberAuthToken, mutations.editAccountCard, { ...accountCard, story: 'x'.repeat(constants.card.storyMinLength - 1) });
      expect(response.body.data?.editAccountCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.storyTooShortError);
    });

    it('Error when hint too long', async () => {
      const response = await sendRequest(testUrl, memberAuthToken, mutations.editAccountCard, { ...accountCard, hint: 'x'.repeat(constants.card.hintMaxLength + 1) });
      expect(response.body.data?.editAccountCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.hintTooLongError);
    });

    it('Error when hint too short', async () => {
      const response = await sendRequest(testUrl, memberAuthToken, mutations.editAccountCard, { ...accountCard, hint: 'x'.repeat(constants.card.storyMinLength - 1)});
      expect(response.body.data?.editAccountCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.hintTooShortError);
    });

    it('Error when both story ands hint not provided', async () => {
      const response = await sendRequest(testUrl, memberAuthToken, mutations.editAccountCard, { cardId: accountCard.cardId });
      expect(response.body.data?.editAccountCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.provideStoryOrHintError);
    });

    it('Error when non-member submitting the custom card information', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.editAccountCard, accountCard);
      expect(response.body.data?.editAccountCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.account.memberFeatureError);
    });

    it('Succesfully set story and hint after logged in and active member', async () => {
      const response = await sendRequest(testUrl, memberAuthToken, mutations.editAccountCard, accountCard);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.editAccountCard.id).toBeDefined();
      expect(response.body.data.editAccountCard.reviewCount).toBe(0);
      expect(response.body.data.editAccountCard.easyFactor).toBe(constants.card.defaultEasyFactor);
      expect(response.body.data.editAccountCard.accountStory).toBe(accountCard.story);
      expect(response.body.data.editAccountCard.accountHint).toBe(accountCard.hint);
      expect(response.body.data.editAccountCard.dueAt).toBeDefined();
      expect(response.body.data.editAccountCard.mature).toBe(false);
      expect(response.body.data.editAccountCard.createdAt).toBeDefined();
      expect(response.body.data.editAccountCard.updatedAt).toBeDefined();
    });

    it('Succesfully set only story, hint stays the same', async () => {
      const response = await sendRequest(testUrl, memberAuthToken, mutations.editAccountCard, { cardId: accountCard.cardId, story: accountCard.hint });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.editAccountCard.id).toBeDefined();
      expect(response.body.data.editAccountCard.reviewCount).toBe(0);
      expect(response.body.data.editAccountCard.easyFactor).toBe(constants.card.defaultEasyFactor);
      expect(response.body.data.editAccountCard.accountStory).toBe(accountCard.hint);
      expect(response.body.data.editAccountCard.accountHint).toBe(accountCard.hint);
      expect(response.body.data.editAccountCard.dueAt).toBeDefined();
      expect(response.body.data.editAccountCard.mature).toBe(false);
      expect(response.body.data.editAccountCard.createdAt).toBeDefined();
      expect(response.body.data.editAccountCard.updatedAt).toBeDefined();
    });

    it('Succesfully set only hint, story stays the same', async () => {
      const response = await sendRequest(testUrl, memberAuthToken, mutations.editAccountCard, { cardId: accountCard.cardId, hint: accountCard.story });
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.editAccountCard.id).toBeDefined();
      expect(response.body.data.editAccountCard.reviewCount).toBe(0);
      expect(response.body.data.editAccountCard.easyFactor).toBe(constants.card.defaultEasyFactor);
      expect(response.body.data.editAccountCard.accountStory).toBe(accountCard.hint);
      expect(response.body.data.editAccountCard.accountHint).toBe(accountCard.story);
      expect(response.body.data.editAccountCard.dueAt).toBeDefined();
      expect(response.body.data.editAccountCard.mature).toBe(false);
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
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.rescheduleCard, {
        reviewResult: accountReview.reviewResult,
        newInterval: accountReview.newInterval,
        newEasyFactor: accountReview.newEasyFactor
      });
      expect(response.body.data?.rescheduleCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when review result not send', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.rescheduleCard, {
        cardId: accountReview.cardId,
        newInterval: accountReview.newInterval,
        newEasyFactor: accountReview.newEasyFactor
      });
      expect(response.body.data?.rescheduleCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when new interval not send', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.rescheduleCard, {
        cardId: accountReview.cardId,
        reviewResult: accountReview.reviewResult,
        newEasyFactor: accountReview.newEasyFactor
      });
      expect(response.body.data?.rescheduleCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when new easy factor not send', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.rescheduleCard, {
        cardId: accountReview.cardId,
        reviewResult: accountReview.reviewResult,
        newInterval: accountReview.newInterval
      });
      expect(response.body.data?.rescheduleCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when card id wrong type (string)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.rescheduleCard, { ...accountReview, cardId: '1' });
      expect(response.body.data?.rescheduleCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when review result wrong type (integer)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.rescheduleCard, { ...accountReview, reviewResult: 1 });
      expect(response.body.data?.rescheduleCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
    });

    it('Error when review result non-existing ENUM', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.rescheduleCard, { ...accountReview, reviewResult: 'NOTEXIST' });
      expect(response.body.data?.rescheduleCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.invalidResultTypeError);
    });

    it('Error when new interval wrong type (string)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.rescheduleCard, { ...accountReview, newInterval: '1' });
      expect(response.body.data?.rescheduleCard).toBeUndefined();
      expect(response.body.errors[0].extensions.code).toContain(errors.graphQlErrors.badUserInput);
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

    it('Succesfull when all validations pass and logged in (non-member)', async () => {
      const response = await sendRequest(testUrl, nonMemberAuthToken, mutations.rescheduleCard, accountReview);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.rescheduleCard.id).toBeDefined();
      expect(response.body.data.rescheduleCard.reviewCount).toBe(1);
      expect(response.body.data.rescheduleCard.easyFactor).toBe(accountReview.newEasyFactor);
      expect(response.body.data.rescheduleCard.accountStory).toBeDefined();
      expect(response.body.data.rescheduleCard.accountHint).toBeDefined();
      expect(response.body.data.rescheduleCard.dueAt).toBeDefined();
      expect(response.body.data.rescheduleCard.mature).toBeDefined();
      expect(response.body.data.rescheduleCard.createdAt).toBeDefined();
      expect(response.body.data.rescheduleCard.updatedAt).toBeDefined();
    });

    it('Succesfull when all validations pass and logged in (member)', async () => {
      const response = await sendRequest(testUrl, memberAuthToken, mutations.rescheduleCard, accountReview);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.rescheduleCard.id).toBeDefined();
      expect(response.body.data.rescheduleCard.reviewCount).toBe(1);
      expect(response.body.data.rescheduleCard.easyFactor).toBe(accountReview.newEasyFactor);
      expect(response.body.data.rescheduleCard.accountStory).toBeDefined();
      expect(response.body.data.rescheduleCard.accountHint).toBeDefined();
      expect(response.body.data.rescheduleCard.dueAt).toBeDefined();
      expect(response.body.data.rescheduleCard.mature).toBeDefined();
      expect(response.body.data.rescheduleCard.createdAt).toBeDefined();
      expect(response.body.data.rescheduleCard.updatedAt).toBeDefined();
    });

    it('Rescheduling again should increment review count by one', async () => {
      const response = await sendRequest(testUrl, memberAuthToken, mutations.rescheduleCard, accountReview);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.rescheduleCard.id).toBeDefined();
      expect(response.body.data.rescheduleCard.reviewCount).toBe(2);
      expect(response.body.data.rescheduleCard.easyFactor).toBe(accountReview.newEasyFactor);
      expect(response.body.data.rescheduleCard.accountStory).toBeDefined();
      expect(response.body.data.rescheduleCard.accountHint).toBeDefined();
      expect(response.body.data.rescheduleCard.dueAt).toBeDefined();
      expect(response.body.data.rescheduleCard.mature).toBeDefined();
      expect(response.body.data.rescheduleCard.createdAt).toBeDefined();
      expect(response.body.data.rescheduleCard.updatedAt).toBeDefined();
    });
  });
});
