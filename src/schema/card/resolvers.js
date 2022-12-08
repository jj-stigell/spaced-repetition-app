const constants = require('../../util/constants');
const errors = require('../../util/errors/errors');
const graphQlErrors = require('../../util/errors/graphQlErrors');
const { calculateDate, formStatistics } = require('../../util/helper');
const cardService = require('../services/cardService');
const deckService = require('../services/deckService');
const validator = require('../../util/validation//validator');

const resolvers = {
  Query: {
    // Fetch cards that are due or new cards based on the newCards boolean value, defaults to false.
    fetchCards: async (_, { deckId, languageId, newCards }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      await validator.validateFetchCards(deckId, languageId, newCards);

      let selectedLanguage;
      // If language id is empty, set to default 'en'
      if (!languageId) {
        selectedLanguage = constants.general.defaultLanguage;
      } {
        selectedLanguage = languageId;
      }

      // Check that deck exists
      const deck = await deckService.findDeckById(deckId);

      // No deck found with an id
      if (!deck) return graphQlErrors.defaultError(errors.nonExistingDeckError);

      // Deck not active
      if (!deck.active) return graphQlErrors.defaultError(errors.nonActiveDeckError);

      // Check if deck has an account specific settings
      let accountDeckSettings = await deckService.findAccountDeckSettings(deckId, currentUser.id);
      
      // Create new accoung deck settings if no existing one
      if (!accountDeckSettings) {
        accountDeckSettings = await deckService.createAccountDeckSettings(deckId, currentUser.id);
      }

      let cards = [];

      if (newCards) {
        // Fetch new cards
        cards = await cardService.fetchNewCards(deckId, currentUser.id, accountDeckSettings.newCardsPerDay, selectedLanguage);
      } else {
        // Fetch due cards
        cards = await cardService.fetchDueCards(deckId, currentUser.id, accountDeckSettings.reviewsPerDay, selectedLanguage);
      }

      if (!cards) return graphQlErrors.defaultError(errors.noDueCardsError);

      return { Cards: cards };
    },
    fetchCardsByType: async (_, { type, languageId }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      await validator.validateFetchCardsByType(type, languageId);
      const selectedLanguage = languageId ? languageId : constants.general.defaultLanguage;
      const cards = await cardService.fetchCardsByType(type, currentUser.id, selectedLanguage);
      
      // No cards found with the type
      if (cards.length === 0) return graphQlErrors.defaultError(errors.noCardsFound);

      return { Cards: cards };
    },
    fetchReviewHistory: async (_, { limitReviews }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      await validator.validateInteger(limitReviews);
      const reviewHistory = await cardService.findReviewHistory(limitReviews, currentUser.id);
      if (reviewHistory.length === 0) return graphQlErrors.defaultError(errors.noRecordsFoundError);
      return { reviews: reviewHistory };
    },
    fetchDueCount: async (_, { limitReviews }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      await validator.validateInteger(limitReviews);
      const dueReviews = await cardService.findDueReviewsCount(limitReviews, currentUser.id);
      if (dueReviews.length === 0) return graphQlErrors.defaultError(errors.noDueCardsError);
      return { reviews: dueReviews };
    },
    fetchLearningStatistics: async (_, { cardType }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      await validator.validateCardType(cardType);
      const statsFromDb = await cardService.findLearningProgressByType(cardType, currentUser.id);
      return formStatistics(statsFromDb);
    },
  },
  Mutation: {
    rescheduleCard: async (_, { cardId, reviewResult, newInterval, newEasyFactor, extraReview, timing }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      await validator.validateRescheduleCard(cardId, reviewResult, newInterval, newEasyFactor, extraReview, timing);

      let status = false;
      // Calculate new duedate
      const newDueDate = calculateDate(newInterval);

      // Check if card exists for the user for that card id
      let accountCard = await cardService.findAccountCard(cardId, currentUser.id);

      // Create new custom card for the user, if none found the current user id and kanji id
      if (!accountCard) {
        // Check that card actually exists in the database
        const card = cardService.findCardById(cardId);
        if (!card) return graphQlErrors.defaultError(errors.nonExistingId);
        accountCard = await cardService.createAccountCard(cardId, currentUser.id);
      } else {
        // Update existing user card
        try {
          // Update and save changes, card is set to mature if the interval is higher than set maturing interval
          accountCard.set({
            easyFactor: newEasyFactor,
            dueDate: newDueDate,
            mature: newInterval > constants.matureInterval ? true : false
          });
          accountCard.save();
        } catch(error) {
          return graphQlErrors.internalServerError(error);
        }
      }
      // Add new row to review history
      const newReviewHistory = await cardService.createAccountReview(cardId, currentUser.id, reviewResult, extraReview, timing);
      if (newReviewHistory) status = true;

      return { status: status };
    },
    pushCards: async (_, { deckId, days }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      await validator.validatePushCards(deckId, days);
      if (deckId) {
        await cardService.pushCardsInDeck(deckId, days, currentUser.id);
      } else {
        await cardService.pushAllCards(days, currentUser.id);
      }
      
      return { status: true };
    },
    editAccountCard: async (_, { cardId, story, hint }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      await validator.validateEditAccountCard(cardId, story, hint);
      let accountCard = await cardService.findAccountCard(cardId, currentUser.id);

      // Create new custom card for the user, if none found the current user id and kanji id
      if (!accountCard) {
        // Check that card actually exists in the database
        const card = cardService.findCardById(cardId);
        if (!card) return graphQlErrors.defaultError(errors.nonExistingId);
        accountCard = await cardService.createAccountCard(cardId, currentUser.id, story, hint);
      } else {
        // Update existing user card
        try {
          // Update and save changes, card is set to mature if the interval is higher than set maturing interval
          accountCard.set({
            accountStory: story ? story : accountCard.accountStory,
            accountHint: hint ? hint : accountCard.accountHint,
          });
          accountCard.save();
        } catch(error) {
          return graphQlErrors.internalServerError(error);
        }
      }
      return { accountCard };
    },
  }
};

module.exports = resolvers;
