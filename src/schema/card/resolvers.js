const { findDeckById, findDeckTranslation, findAccountDeckSettings, createAccountDeckSettings, countNewReviewsTodayInDeck, countDueReviewsTodayInDeck } = require('../services/deckService');
const { notAuthError, defaultError, internalServerError, notAuthorizedError } = require('../../util/errors/graphQlErrors');
const { formStatistics, cardFormatter, accountCardFormatter } = require('../../util/formatter');
const { validateMember, checkAdminPermission } = require('../../util/authorization');
const { cardService, accountService } = require('../services');
const validator = require('../../util/validation//validator');
const errors = require('../../util/errors/errors');
const constants = require('../../util/constants');

const resolvers = {
  Query: {
    cardsFromDeck: async (_, { deckId, languageId, newCards, date }, { currentUser }) => {
      if (!currentUser) return notAuthError();
      await validator.validateInteger(deckId);
      await validator.validateDate(date);
      let selectedLanguage = constants.general.defaultLanguage, cards = [], currentDate = new Date(date);

      // Check that deck exists
      const deck = await findDeckById(deckId);

      // No deck found with an id
      if (!deck) return defaultError(errors.nonExistingDeckError);

      // Deck not active
      if (!deck.active) return defaultError(errors.nonActiveDeckError);

      const account = await accountService.findAccountById(currentUser.id);

      // check that user is member, if the deck is member deck
      if (deck.subscriberOnly && !account.member) notAuthorizedError(errors.account.memberFeatureError);

      const deckTranslation = await findDeckTranslation(deckId, languageId);
      if (deckTranslation.length !== 0 && deckTranslation[0]?.active) {
        selectedLanguage = deckTranslation[0]?.languageId ? deckTranslation[0]?.languageId: constants.general.defaultLanguage;
      }

      // Check if deck has an account specific settings
      let accountDeckSettings = await findAccountDeckSettings(deckId, currentUser.id);
      
      // Create new accoung deck settings if no existing one
      if (!accountDeckSettings) {
        accountDeckSettings = await createAccountDeckSettings(deckId, currentUser.id);
      }

      if (newCards) {
        const newReviesDoneToday = await countNewReviewsTodayInDeck(currentUser.id, date, deckId);
        const fetchAmount = accountDeckSettings.newCardsPerDay - newReviesDoneToday;
        if (fetchAmount <= 0) return defaultError(errors.noDueCardsError);
        cards = await cardService.fetchNewCards(deckId, currentUser.id, fetchAmount, selectedLanguage);
      } else {
        const dueReviesDoneToday = await countDueReviewsTodayInDeck(currentUser.id, date, deckId);
        const fetchAmount = accountDeckSettings.reviewsPerDay - dueReviesDoneToday;
        currentDate = currentDate.toISOString().split('T')[0];
        cards = await cardService.fetchDueCards(deckId, currentUser.id, fetchAmount, selectedLanguage, currentDate);
      }
      if (!cards) return defaultError(errors.noDueCardsError);
      return cardFormatter(cards, false, account.member, newCards);
    },
    cardsByType: async (_, { cardType, languageId }, { currentUser }) => {
      if (!currentUser) return notAuthError();
      await checkAdminPermission(currentUser.id, 'READ');
      const cards = await cardService.fetchCardsByType(cardType, currentUser.id, languageId);
      if (cards.length === 0) return [];
      return cardFormatter(cards, true, true);
    },
    reviewHistory: async (_, { limitReviews }, { currentUser }) => {
      if (!currentUser) return notAuthError();
      await validator.validateInteger(limitReviews);
      const reviewHistory = await cardService.findReviewHistory(limitReviews, currentUser.id);
      if (reviewHistory.length === 0) return [];
      return reviewHistory;
    },
    dueCount: async (_, { limitReviews, date }, { currentUser }) => {
      if (!currentUser) return notAuthError();
      await validator.validateInteger(limitReviews);
      await validator.validateDate(date);
      let dueReviews = await cardService.findDueReviewsCount(limitReviews, currentUser.id, date);
      if (dueReviews.length === 0) return [];

      dueReviews = dueReviews.reduce((acc, curr) => {
        if (!acc[curr.date]) {
          acc[curr.date] = { date: curr.date, reviews: 0 };
        }
        acc[curr.date].reviews += parseInt(curr.reviews);
        return acc;
      }, {});
      return Object.values(dueReviews);
    },
    learningStatisticsByType: async (_, { cardType, reviewType }, { currentUser }) => {
      if (!currentUser) return notAuthError();
      const statistics = await cardService.findLearningProgressByType(cardType, reviewType, currentUser.id);
      return formStatistics(statistics);
    },
  },
  Mutation: {
    rescheduleCard: async (_, { cardId, reviewResult, newInterval, newEasyFactor, extraReview, timing, date, reviewType }, { currentUser }) => {
      if (!currentUser) return notAuthError();
      await validator.validateRescheduleCard(cardId, newInterval, newEasyFactor, extraReview, timing, date);

      let newDueDate = new Date(date);
      const currentDate = newDueDate.toISOString().split('T')[0];
      newDueDate.setDate(newDueDate.getDate() + newInterval);
      newDueDate = newDueDate.toISOString().split('T')[0];

      // Check if card exists for the user for that card id
      let accountCard = await cardService.findAccountCard(cardId, currentUser.id, reviewType);

      // Create new custom card for the user, if none found the current user id and kanji id
      if (!accountCard) {
        // Check that card actually exists in the database
        const card = cardService.findCardById(cardId);
        if (!card) return defaultError(errors.nonExistingId);
        accountCard = await cardService.createAccountCard(cardId, currentUser.id, newEasyFactor, newDueDate, newInterval, reviewType, date);
      } else {
        // Update existing user card
        try {
          // Update and save changes, card is set to mature if the interval is higher than set maturing interval
          accountCard.set({
            easyFactor: newEasyFactor,
            dueAt: newDueDate,
            mature: newInterval > constants.matureInterval ? true : false,
            reviewCount: accountCard.reviewCount + 1,
            updatedAt: date
          });
          await accountCard.save();
        } catch(error) {
          internalServerError(error);
        }
      }
      // Add new row to review history
      await cardService.createAccountReview(cardId, currentUser.id, reviewResult, reviewType, extraReview, timing, currentDate);
      return accountCardFormatter(accountCard);
    },
    pushCards: async (_, { deckId, days, date }, { currentUser }) => {
      if (!currentUser) return notAuthError();
      await validateMember(currentUser.id);
      await validator.validatePushCards(deckId, days, date);

      let newDueDate = new Date(date);
      const currentDate = newDueDate.toISOString().split('T')[0];
      newDueDate.setDate(newDueDate.getDate() + days);
      newDueDate = newDueDate.toISOString().split('T')[0];

      if (deckId) {
        await cardService.pushCardsInDeck(currentDate, newDueDate, days, currentUser.id, deckId);
      } else {
        await cardService.pushAllCards(currentDate, newDueDate, days, currentUser.id);
      }

      return true;
    },
    editAccountCard: async (_, { cardId, story, hint }, { currentUser }) => {
      if (!currentUser) return notAuthError();
      if (!story && !hint) return defaultError(errors.provideStoryOrHintError);
      await validator.validateEditAccountCard(cardId, story, hint);
      await validateMember(currentUser.id);

      // Check that card actually exists in the database
      const card = await cardService.findCardById(cardId);
      if (!card) return defaultError(errors.nonExistingIdError);

      // Find account card custom data from db
      let accountCardCustomData = await cardService.findAccountCardCustomData(cardId, currentUser.id);

      // Create new custom card for the user, if none found the current user id and kanji id
      if (!accountCardCustomData) {
        accountCardCustomData = await cardService.createAccountCardCustomData(cardId, currentUser.id, story, hint);
      } else {
        // Update existing account card custom data
        try {
          accountCardCustomData.set({
            accountStory: story ? story : accountCardCustomData.accountStory,
            accountHint: hint ? hint : accountCardCustomData.accountHint,
          });
          accountCardCustomData.save();
        } catch(error) {
          return internalServerError(error);
        }
      }
      return accountCardCustomData;
    },
  }
};

module.exports = resolvers;
