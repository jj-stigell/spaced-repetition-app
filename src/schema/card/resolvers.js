const constants = require('../../util/constants');
const errors = require('../../util/errors/errors');
const graphQlErrors = require('../../util/errors/graphQlErrors');
const { calculateDate } = require('../../util/helper');
const { formStatistics, cardFormatter } = require('../../util/formatter');
const { validateMember, checkAdminPermission } = require('../../util/authorization');
//const services = require('../services');
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
    cardsByType: async (_, { cardType, languageId }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      await checkAdminPermission(currentUser.id, 'READ');
      //await validator.validateFetchCardsByType(cardType, languageId);
      //const selectedLanguage = languageId ? languageId : constants.general.defaultLanguage;
      let cards = await cardService.fetchCardsByType(cardType, currentUser.id, languageId);

      // No cards found with the card type, return empty array
      if (cards.length === 0) return [];
      return cardFormatter(cards);
    },
    reviewHistory: async (_, { limitReviews }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      await validator.validateInteger(limitReviews);
      const reviewHistory = await cardService.findReviewHistory(limitReviews, currentUser.id);
      if (reviewHistory.length === 0) return [];
      return reviewHistory;
    },
    dueCount: async (_, { limitReviews }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      await validator.validateInteger(limitReviews);
      const dueReviews = await cardService.findDueReviewsCount(limitReviews, currentUser.id);
      if (dueReviews.length === 0) return [];

      // Group all reviews before or today in one day, future reviews in their own days
      const currentDate = new Date().toISOString().split('T')[0];
      const dueAfterToday = dueReviews.filter(value => value.date > currentDate);
      const dueTodayOrBefore = dueReviews.filter(value => value.date <= currentDate);
      const initialValue = 0;
      const sumWithInitial = dueTodayOrBefore.reduce(
        (accumulator, currentValue) => accumulator + parseInt(currentValue.reviews),
        initialValue
      );

      // concat only if current date has reviews due
      return sumWithInitial > 0 ? [{ date: currentDate, reviews: sumWithInitial.toString() }].concat(dueAfterToday) : dueAfterToday;
    },
    learningStatistics: async (_, { cardType }, { currentUser }) => {
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
      const newDueDate = calculateDate(newInterval);

      // Check if card exists for the user for that card id
      let accountCard = await cardService.findAccountCard(cardId, currentUser.id);

      // Create new custom card for the user, if none found the current user id and kanji id
      if (!accountCard) {
        // Check that card actually exists in the database
        const card = cardService.findCardById(cardId);
        if (!card) return graphQlErrors.defaultError(errors.nonExistingId);
        accountCard = await cardService.createAccountCard(cardId, currentUser.id, null, null, newEasyFactor, newDueDate, newInterval, true);
      } else {
        // Update existing user card
        try {
          // Update and save changes, card is set to mature if the interval is higher than set maturing interval
          accountCard.set({
            easyFactor: newEasyFactor,
            dueAt: newDueDate,
            mature: newInterval > constants.matureInterval ? true : false,
            reviewCount: accountCard.reviewCount + 1
          });
          await accountCard.save();
        } catch(error) {
          return graphQlErrors.internalServerError(error);
        }
      }
      // Add new row to review history
      await cardService.createAccountReview(cardId, currentUser.id, reviewResult, extraReview, timing);

      return {
        id: accountCard.id,
        reviewCount: accountCard.reviewCount,
        easyFactor: accountCard.easyFactor,
        accountStory: accountCard.accountStory,
        accountHint: accountCard.accountHint,
        dueAt: accountCard.dueAt,
        mature: accountCard.mature,
        createdAt: accountCard.createdAt,
        updatedAt: accountCard.updatedAt
      };
    },
    pushCards: async (_, { deckId, days }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      await validateMember(currentUser.id);
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
      await validateMember(currentUser.id);
      await validator.validateEditAccountCard(cardId, story, hint);

      // If no story or hint provided return id back to the user
      if (!story && !hint) graphQlErrors.defaultError(errors.provideStoryOrHintError);

      // Check that card actually exists in the database
      const card = await cardService.findCardById(cardId);
      if (!card) graphQlErrors.defaultError(errors.nonExistingIdError);
      let accountCard = await cardService.findAccountCard(cardId, currentUser.id);

      // Create new custom card for the user, if none found the current user id and kanji id
      if (!accountCard) {
        accountCard = await cardService.createAccountCard(cardId, currentUser.id, story, hint, null, null, null, false);
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

      return {
        id: accountCard.id,
        reviewCount: accountCard.reviewCount,
        easyFactor: accountCard.easyFactor,
        accountStory: accountCard.accountStory,
        accountHint: accountCard.accountHint,
        dueAt: accountCard.dueAt,
        mature: accountCard.mature,
        createdAt: accountCard.createdAt,
        updatedAt: accountCard.updatedAt
      };
    },
  }
};

module.exports = resolvers;
