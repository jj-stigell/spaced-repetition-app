/* eslint-disable no-unused-vars */
const { Op } = require('sequelize');
const models = require('../../models');
const { sequelize } = require('../../database');
const constants = require('../../util/constants');
const errors = require('../../util/errors/errors');
const rawQueries = require('../services/rawQueries');
const schema = require('../../util/validation/schema');
const formatYupError = require('../../util/errors/errorFormatter');
const graphQlErrors = require('../../util/errors/graphQlErrors');
const cardService = require('../services/cardService');
const deckService = require('../services/deckService');
const validator = require('../../util/validation//validator');

const resolvers = {
  Query: {
    // Fetch cards that are due or new cards based on the newCards boolean value, defaults to false.
    fetchCards: async (_, { deckId, languageId, newCards }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();

      // validate input
      try {
        await schema.fetchCardsSchema.validate({ deckId, languageId, newCards }, { abortEarly: false });
      } catch (error) {
        return { 
          __typename: 'Error',
          errorCodes: formatYupError(error)
        };
      }

      // Confirm that deck id is not empty
      if (!deckId) {
        return { 
          __typename: 'Error',
          errorCodes: [errors.inputValueMissingError]
        };
      }

      // Check that type of deck id (integer) correct
      if (!Number.isInteger(deckId) || deckId < 1) {
        return { 
          __typename: 'Error',
          errorCodes: [errors.inputValueTypeError]
        };
      }

      let selectedLanguage;
      // If language id is empty, set to default 'en'
      if (!languageId) {
        selectedLanguage = constants.defaultLanguage;
      } else {
        // Check that language id is one of the available if provided
        if (!validator.isIn(languageId.toLowerCase(), constants.availableLanguages)) {
          return { 
            __typename: 'Error',
            errorCodes: [errors.invalidLanguageIdError]
          };
        }
      }
      
      let deck;
      // Check if deck with an id exists
      try {
        deck = await models.Deck.findOne({ where: { id: deckId } });
      } catch(error) {
        console.log(error);
        return graphQlErrors.internalServerError();
      }

      // No deck found with an id
      if (!deck) {
        return { 
          __typename: 'Error',
          errorCodes: [errors.nonExistingDeckError]
        };
      }

      // What if deck is not active?

      let accountDeckSettings;
      // Check if deck has an account specific settings
      try {
        accountDeckSettings = await models.AccountDeckSettings.findOne({ where: { accountId: currentUser.id, deckId: deckId }});
      } catch(error) {
        return {
          __typename: 'Error',
          errorCodes: [errors.internalServerError]
        };
      }

      //create new accoung deck settings if no existing one
      if (!accountDeckSettings) {
        try {
          accountDeckSettings = await models.AccountDeckSettings.create({
            accountId: currentUser.id,
            deckId: deckId
          });
          accountDeckSettings.save();
        } catch(error) {
          console.log('error:', error);
          return {
            __typename: 'Error',
            errorCodes: [errors.internalServerError]
          };
        }
      }

      let cards = [], cardIds = [];

      if (newCards) {
        // Fetch new cards
        cardIds = await sequelize.query(rawQueries.selectNewCardIds, {
          replacements: {
            deckId: deckId,
            accountId: currentUser.id,
            limitReviews: accountDeckSettings.newCardsPerDay,
          },
          model: models.CardList,
          type: sequelize.QueryTypes.SELECT,
          raw: true
        });
      } else {
        // Fetch due cards
        cardIds = await sequelize.query(rawQueries.selectDueCardIds, {
          replacements: {
            deckId: deckId,
            accountId: currentUser.id,
            limitReviews: accountDeckSettings.reviewsPerDay,
          },
          model: models.CardList,
          type: sequelize.QueryTypes.SELECT,
          raw: true
        });
      }
  
      // If no cards found, return error
      if (cardIds.length === 0) {
        return { 
          __typename: 'Error',
          errorCodes: [errors.noDueCardsError]
        };
      }

      const idInLearningOrder = cardIds.map(listItem => listItem.card_id);

      if (newCards) {
        cards = await models.Card.findAll({
          where: {
            'id': { [Op.in]: idInLearningOrder },
            'active': true
          },
          subQuery: false,
          nest: true,
          include: [
            {
              model: models.Kanji,
              include: [
                {
                  model: models.KanjiTranslation,
                  where: {
                    language_id: selectedLanguage
                  },
                },
                {
                  model: models.Radical,
                  attributes: ['id', 'radical', 'reading', 'readingRomaji', 'strokeCount', 'createdAt', 'updatedAt'],
                  include: {
                    model: models.RadicalTranslation,
                    where: {
                      language_id: selectedLanguage
                    }
                  },
                }
              ]
            },
            {
              model: models.Word,
              include: {
                model: models.WordTranslation,
                where: {
                  language_id: selectedLanguage
                },
              }
            }
          ]
        });
      } else {
        cards = await models.Card.findAll({
          where: {
            'id': { [Op.in]: idInLearningOrder },
            'active': true
          },
          subQuery: false,
          nest: true,
          include: [
            {
              model: models.Kanji,
              include: [
                {
                  model: models.KanjiTranslation,
                  where: {
                    language_id: selectedLanguage
                  },
                },
                {
                  model: models.Radical,
                  attributes: ['id', 'radical', 'reading', 'readingRomaji', 'strokeCount', 'createdAt', 'updatedAt'],
                  include: {
                    model: models.RadicalTranslation,
                    where: {
                      language_id: selectedLanguage
                    }
                  },
                }
              ]
            },
            {
              model: models.AccountCard,
              where: {
                accountId: currentUser.id
              }
            },
            {
              model: models.Word,
              include: {
                model: models.WordTranslation,
                where: {
                  language_id: selectedLanguage
                },
              }
            }
          ]
        });
      }

      cards.sort(function (a, b) {
        return idInLearningOrder.indexOf(a.id) - idInLearningOrder.indexOf(b.id);
      });

      return {
        __typename: 'Cardset',
        Cards: cards
      };
    },
    fetchDecks: async (root, args, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      const decks = await deckService.findAllDecks(false);

      return {
        __typename: 'DeckList',
        Decks: decks
      };
    },
    fecthDeckSettings: async (_, { deckId }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      await validator.validateDeckId(deckId);
      const deck = await deckService.findDeckById(deckId);
      if (!deck) return graphQlErrors.defaultError(errors.nonExistingDeckError);
      let deckSettings = await deckService.findAccountDeckSettings(deckId, currentUser.id);

      //create new accoung deck settings if no existing one
      if (!deckSettings) {
        deckSettings = await deckService.createAccountDeckSettings(deckId, currentUser.id);
      }

      return {
        __typename: 'DeckSettings',
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
    fetchReviewHistory: async (_, { limitReviews }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      await validator.validateInteger(limitReviews);
      const reviewHistory = await cardService.findReviewHistory(limitReviews, currentUser.id);
      if (reviewHistory.length === 0) return graphQlErrors.defaultError(errors.noRecordsFoundError);

      return { 
        __typename: 'Reviews',
        reviews: reviewHistory
      };
    },
    fetchDueCount: async (_, { limitReviews }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      await validator.validateInteger(limitReviews);
      const dueReviews = await cardService.findDueReviewsCount(limitReviews, currentUser.id);
      if (dueReviews.length === 0) return graphQlErrors.defaultError(errors.noDueCardsError);

      return { 
        __typename: 'Reviews',
        reviews: dueReviews
      };
    },
  },
  Mutation: {
    rescheduleCard: async (_, { cardId, reviewResult, newInterval, newEasyFactor, extraReview, timing }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();

      // Confirm that jlpt level and language id are not empty
      if (!cardId || !reviewResult || !newInterval || !newEasyFactor) {
        return { 
          __typename: 'Error',
          errorCodes: [errors.inputValueMissingError]
        };
      }

      // Chack that result is one of the available
      if (!validator.isIn(reviewResult.toLowerCase(), constants.resultTypes)) {
        return { 
          __typename: 'Error',
          errorCodes: [errors.invalidResultIdError]
        };
      }

      // Check that type of integer correct
      if (!Number.isInteger(cardId) || !Number.isInteger(newInterval)) {
        return { 
          __typename: 'Error',
          errorCodes: [errors.inputValueTypeError]
        };
      }

      /*
      // TODO
      // Check that type of float correct if exists, 
      if (!newEasyFactor || !timing) {
        return { 
          __typename: 'Error',
          errorCodes: [errors.inputValueTypeError]
        };
      }
      */

      // Check that integers and floats positive numbers
      if (cardId < 1 || newInterval < 1 || newEasyFactor <= 0.1) {
        return { 
          __typename: 'Error',
          errorCodes: [errors.negativeNumberTypeError]
        };
      }

      let accountCard;
      // Create new (due) date object
      let newDueDate = new Date();
      newDueDate.setDate(newDueDate.getDate() + newInterval);

      try {
        // Check if card exists for the user for that card id
        accountCard = await models.AccountCard.findOne({ where: { accountId: currentUser.id, cardId: cardId } });
      } catch(error) {
        console.log(error.errors);
        return { 
          __typename: 'Error',
          errorCodes: [errors.internalServerError]
        };
      }

      // Create new custom card for the user, if none found the current user id and kanji id
      if (!accountCard) {
        // Check that card actually exists in the database
        try {
          const card = await sequelize.query(rawQueries.findCard, {
            replacements: {
              cardId: cardId,
            },
            model: models.Card,
            type: sequelize.QueryTypes.SELECT,
            raw: true
          });

          if (!card[0]) {
            return { 
              __typename: 'Error',
              errorCodes: [errors.nonExistingId]
            };
          }
          
          // Create new account card if card exists
          accountCard = await models.AccountCard.create({
            accountId: currentUser.id,
            cardId: cardId,
            dueAt: newDueDate,
            easyFactor: constants.defaultEasyFactor,
            reviewCount: constants.defaultReviewCount,
          });
          accountCard.save();

        } catch(error) {
          console.log(error);
          return graphQlErrors.internalServerError();
        }
      } else {
        // Update existing user kanji card and add new row to history
        try {
        // Add one review to the total count
          accountCard.increment('reviewCount');
        
          // Update and save changes, card is set to mature if the interval is higher than set maturing interval
          accountCard.set({
            easyFactor: newEasyFactor,
            dueDate: newDueDate,
            mature: newInterval > constants.matureInterval ? true : false
          });
          accountCard.save();

        } catch(error) {
          console.log(error);
          return graphQlErrors.internalServerError();
        }
      }

      try {
        // Add new row to review history
        const newReviewHistory = await models.AccountReview.create({
          accountId: currentUser.id,
          cardId: cardId,
          result: reviewResult,
          extraReview: extraReview ? true : false,
          timing: timing
        });
        return { 
          __typename: 'Success',
          status: true,
        };
      } catch(error) {
        console.log(error);
        return graphQlErrors.internalServerError();
      }
    },
    changeDeckSettings: async (_, { deckId, favorite, reviewInterval, reviewsPerDay, newCardsPerDay }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();

      // validate input
      try {
        await schema.validateDeckSettings.validate({ deckId, favorite, reviewInterval, reviewsPerDay, newCardsPerDay }, { abortEarly: false });
      } catch (error) {
        return { 
          __typename: 'Error',
          errorCodes: formatYupError(error)
        };
      }

      let foundDeck;
      // Check if deck with an id exists
      try {
        foundDeck = await models.Deck.findOne({ where: { id: deckId } });
      } catch(error) {
        return { 
          __typename: 'Error',
          errorCodes: [errors.internalServerError]
        };
      }
      
      // No deck found with an id
      if (!foundDeck) {
        return { 
          __typename: 'Error',
          errorCodes: [errors.nonExistingDeckError]
        };
      }

      let deckSettings;
      // Find the deck settings, account specific
      try {
        deckSettings = await models.AccountDeckSettings.findOne({ where: {'account_id': currentUser.id, 'deck_id': deckId }, nest: true, });
      } catch(error) {
        return { 
          __typename: 'Error',
          errorCodes: [errors.internalServerError]
        };
      }

      // create new account deck settings row if no existing one
      if (!deckSettings) {
        try {
          //favorite, reviewInterval, reviewsPerDay, newCardsPerDay
          deckSettings = await models.AccountDeckSettings.create({
            accountId: currentUser.id,
            deckId: deckId,
            favorite: favorite ? true : false,
            reviewInterval: reviewInterval ? reviewInterval : constants.defaultInterval,
            reviewsPerDay: reviewsPerDay ? reviewsPerDay : constants.defaultReviewPerDay,
            newCardsPerDay: newCardsPerDay ? newCardsPerDay : constants.defaultNewPerDay
          });
          deckSettings.save();
        } catch(error) {
          console.log('error:', error);
          return {
            __typename: 'Error',
            errorCodes: [errors.internalServerError]
          };
        }
      }

      // Update existing deck settings
      try {
        deckSettings.favorite = favorite ? true : false;
        deckSettings.reviewInterval = reviewInterval ? reviewInterval : deckSettings.reviewInterval,
        deckSettings.reviewsPerDay = reviewsPerDay ? reviewsPerDay : deckSettings.reviewsPerDay,
        deckSettings.newCardsPerDay = newCardsPerDay ? newCardsPerDay : deckSettings.newCardsPerDay,
        await deckSettings.save();

        return {
          __typename: 'DeckSettings',
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
      } catch(error) {
        return { 
          __typename: 'Error',
          errorCodes: [errors.internalServerError]
        };
      }
    },
    pushCards: async (_, { deckId, days }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();
      await validator.validatePushCards(deckId, days);
      if (deckId) {
        await cardService.pushCardsInDeck(deckId, days, currentUser.id);
      } else {
        await cardService.pushAllCards(days, currentUser.id);
      }
      
      return { 
        __typename: 'Success',
        status: true
      };
    },
    editAccountCard: async (_, { cardId, story, hint }, { currentUser }) => {
      if (!currentUser) graphQlErrors.notAuthError();

      // validate input
      try {
        await schema.validateEditAccountCard.validate({ cardId, story, hint }, { abortEarly: false });
      } catch (error) {
        return { 
          __typename: 'Error',
          errorCodes: formatYupError(error)
        };
      }

      let accountCard;
      // Check that account card exist and user is the owner od the card
      try {
        accountCard = await models.AccountCard.findOne({ where: { accountId: currentUser.id, cardId: cardId } });
      } catch(error) {
        return { 
          __typename: 'Error',
          errorCodes: [errors.internalServerError]
        };
      }
      
      // Create new custom card for the user, if none found the current user id and kanji id
      if (!accountCard) {
        // Check that card actually exists in the database
        try {
          const card = await sequelize.query(rawQueries.findCard, {
            replacements: {
              cardId: cardId,
            },
            model: models.Card,
            type: sequelize.QueryTypes.SELECT,
            raw: true
          });

          if (!card[0]) {
            return { 
              __typename: 'Error',
              errorCodes: [errors.nonExistingId]
            };
          }
          
          // Create new account card if card exists
          accountCard = await models.AccountCard.create({
            accountId: currentUser.id,
            cardId: cardId,
            dueAt: sequelize.DataTypes.NOW,
            easyFactor: constants.defaultEasyFactor,
            reviewCount: 0,
            accountStory: story ? story : null,
            accountHint: hint ? hint : null
          });
          accountCard.save();
        } catch(error) {
          console.log(error);
          return graphQlErrors.internalServerError();
        }
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
          console.log(error);
          return graphQlErrors.internalServerError();
        }
      }
      return { 
        __typename: 'AccountCard',
        accountCard
      };
    },
  }
};

module.exports = resolvers;
