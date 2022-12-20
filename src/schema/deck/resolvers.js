const { findAllDecks, findDeckById, findAccountDeckSettings, createAccountDeckSettings } = require('../services/deckService');
const { notAuthError, defaultError, internalServerError } = require('../../util/errors/graphQlErrors');
const { validateInteger, validateDeckSettings } = require('../../util/validation/validator');
const { deckFormatter, deckSettingsFormatter } = require('../../util/formatter');
const errors = require('../../util/errors/errors');

const resolvers = {
  Query: {
    decks: async (root, args, { currentUser }) => {
      if (!currentUser) return notAuthError();
      const decks = await findAllDecks(false, currentUser.id);
      if (decks.length === 0) return defaultError(errors.deckErrors.noDecksFoundError);
      return deckFormatter(decks);
    },
    deckSettings: async (_, { deckId }, { currentUser }) => {
      if (!currentUser) return notAuthError();
      await validateInteger(deckId);
      const deck = await findDeckById(deckId);
      if (!deck) return defaultError(errors.nonExistingDeckError);
      let deckSettings = await findAccountDeckSettings(deckId, currentUser.id);

      //create new accoung deck settings if no existing one
      if (!deckSettings) {
        deckSettings = await createAccountDeckSettings(deckId, currentUser.id);
      }
      return deckSettingsFormatter(deckSettings);
    },
  },
  Mutation: {
    changeDeckSettings: async (_, { deckId, favorite, reviewInterval, reviewsPerDay, newCardsPerDay }, { currentUser }) => {
      if (!currentUser) return notAuthError();
      await validateDeckSettings(deckId, favorite, reviewInterval, reviewsPerDay, newCardsPerDay);

      // Check that deck exists
      const deck = await findDeckById(deckId);

      // No deck found with an id
      if (!deck) return defaultError(errors.nonExistingDeckError);

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
        return internalServerError(error);
      }
      return deckSettingsFormatter(deckSettings);
    },
  }
};

module.exports = resolvers;
