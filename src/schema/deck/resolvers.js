const errors = require('../../util/errors/errors');
const { notAuthError, defaultError, internalServerError } = require('../../util/errors/graphQlErrors');
const { findAllDecks, findDeckById, findAccountDeckSettings, createAccountDeckSettings } = require('../services/deckService');
const { validateInteger, validateDeckSettings } = require('../../util/validation/validator');

const resolvers = {
  Query: {
    decks: async (root, args, { currentUser }) => {
      if (!currentUser) notAuthError();
      const decks = await findAllDecks(false);
      if (decks.length === 0) defaultError(errors.deckErrors.noDecksFoundError);
      return decks;
    },
    deckSettings: async (_, { deckId }, { currentUser }) => {
      if (!currentUser) notAuthError();
      await validateInteger(deckId);
      const deck = await findDeckById(deckId);
      if (!deck) defaultError(errors.nonExistingDeckError);
      let deckSettings = await findAccountDeckSettings(deckId, currentUser.id);

      //create new accoung deck settings if no existing one
      if (!deckSettings) {
        deckSettings = await createAccountDeckSettings(deckId, currentUser.id);
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
  },
  Mutation: {
    changeDeckSettings: async (_, { deckId, favorite, reviewInterval, reviewsPerDay, newCardsPerDay }, { currentUser }) => {
      if (!currentUser) notAuthError();
      await validateDeckSettings(deckId, favorite, reviewInterval, reviewsPerDay, newCardsPerDay);

      // Check that deck exists
      const deck = await findDeckById(deckId);

      // No deck found with an id
      if (!deck) defaultError(errors.nonExistingDeckError);

      // Check if deck has an account specific settings
      let deckSettings = await findAccountDeckSettings(deckId, currentUser.id);

      //create new accoung deck settings if no existing one
      if (!deckSettings) {
        deckSettings = await createAccountDeckSettings(deckId, currentUser.id, favorite, reviewInterval, reviewsPerDay, newCardsPerDay);
      }

      // Update deck settings
      try {
        deckSettings.favorite = favorite === undefined ? deckSettings.favorite : favorite,
        deckSettings.reviewInterval = reviewInterval ? reviewInterval : deckSettings.reviewInterval,
        deckSettings.reviewsPerDay = reviewsPerDay ? reviewsPerDay : deckSettings.reviewsPerDay,
        deckSettings.newCardsPerDay = newCardsPerDay ? newCardsPerDay : deckSettings.newCardsPerDay,
        await deckSettings.save();
      } catch(error) {
        internalServerError(error);
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
  }
};

module.exports = resolvers;
