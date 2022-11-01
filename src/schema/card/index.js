/* eslint-disable no-unused-vars */
const validator = require('validator');
const { Op } = require('sequelize');
const {
  Deck,
  DeckTranslation,
  AccountDeckSettings,
  Kanji,
  Radical,
  RadicalTranslation,
  Card,
  CardList,
  KanjiTranslation,
  AccountCard,
  AccountReview,
  Word,
  WordTranslation
} = require('../../models');
const { sequelize } = require('../../database');
const constants = require('../../util/constants');
const errors = require('../../util/errors/errors');
const rawQueries = require('../../database/rawQueries');
//const { selectNewCardIds, selectDueCardIds, findCard, pushAllCardsNDays, pushCardsInDeckIdNDays, fetchDailyReviewHistoryNDays, fetchDueReviewsNDays } = require('../../database/rawQueries');
const { fetchCardsSchema, validateDeckId, validateDeckSettings, validatePushCards, validateEditAccountCard, validateInteger } = require('../../util/validation/schema');
const formatYupError = require('../../util/errors/errorFormatter');

const typeDef = `
  scalar Date

  type Account {
    id: ID!
    email: String
    username: String
    password: String
  }

  type Error {
    errorCodes: [String!]
  }

  type Success {
    status: Boolean!
  }

  type AccountCard {
    id: Int
    reviewCount: Int
    easyFactor: Float
    accountStory: String
    accountHint: String
    dueAt: Date
  }

  type KanjiTranslation {
    keyword: String
    story: String
    hint: String
    otherMeanings: String
    description: String
    createdAt: Date
    updatedAt: Date
  }

  type WordTranslation {
    translation: String
    hint: String
    description: String
    createdAt: Date
    updatedAt: Date
  }

  type RadicalTranslation {
    translation: String
    description: String
    createdAt: Date
    updatedAt: Date
  }

  type Radical {
    radical: String
    reading: String
    readingRomaji: String
    strokeCount: Int
    createdAt: Date
    updatedAt: Date
    radical_translations: [RadicalTranslation]
  }

  type Kanji {
    id: Int
    kanji: String
    jlptLevel: Int
    onyomi: String
    onyomiRomaji: String
    kunyomi: String
    kunyomiRomaji: String
    strokeCount: Int
    createdAt: Date
    updatedAt: Date
    kanji_translations: [KanjiTranslation]
    radicals: [Radical]
  }

  type Word {
    id: Int
    word: String
    jlptLevel: Int
    furigana: Boolean
    reading: String
    readingRomaji: String
    createdAt: Date
    updatedAt: Date
    word_translations: [WordTranslation]
  }

  type Card {
    id: Int
    type: String
    createdAt: Date
    updatedAt: Date
    account_cards: [AccountCard]
    kanji: Kanji
    word: Word
  }

  type DeckTranslation {
    id: Int
    languageId: String
    title: String
    description: String
    active: Boolean
    createdAt: Date
    updatedAt: Date
  }

  type Deck {
    id: Int
    deckName: String
    type: String
    subscriberOnly: Boolean
    languageId: String
    active: Boolean
    createdAt: Date
    updatedAt: Date
    deck_translations: [DeckTranslation]
  }

  type DeckSettings {
    id: Int
    accountId: Int
    deckId: Int
    favorite: Boolean
    reviewInterval: Int
    reviewsPerDay: Int
    newCardsPerDay: Int
    createdAt: Date
    updatedAt: Date
  }

  type Day {
    date: Date
    reviews: Int
  }

  type Reviews {
    reviews: [Day]
  }

  type Cardset {
    Cards: [Card]
  }

  type DeckList {
    Decks: [Deck]
  }

  union CardPayload = Cardset | Error
  union DeckPayload = DeckList | Error
  union RescheduleResult = Success | Error
  union SettingsPayload = DeckSettings | Error
  union Result = Success | Error
  union EditResult = AccountCard | Error
  union ReviewCountPayload = Reviews | Error

  type Query {
    fetchCards(
      deckId: Int!
      languageId: String
      newCards: Boolean
    ): CardPayload!

    fetchDecks(
      filter: String
    ): DeckPayload!

    fecthDeckSettings(
      deckId: Int!
    ): SettingsPayload!

    fetchReviewHistory(
      limitReviews: Int!
    ): ReviewCountPayload!

    fetchDueCount(
      limitReviews: Int!
    ): ReviewCountPayload!
  }

  type Mutation {
    rescheduleCard(
      cardId: Int!
      reviewResult: String!
      newInterval: Int!
      newEasyFactor: Float!
      extraReview: Boolean
      timing: Float
    ): RescheduleResult!

    changeDeckSettings(
      deckId: Int!
      favorite: Boolean
      reviewInterval: Int
      reviewsPerDay: Int
      newCardsPerDay: Int
    ): SettingsPayload!

    pushCards(
      deckId: Int
      days: Int
    ): Result!

    editAccountCard(
      cardId: Int!
      story: String
      hint: String
    ): EditResult!
  }
`;

const resolvers = {
  Query: {
    // Fetch cards that are due or new cards based on the newCards boolean value, defaults to false.
    fetchCards: async (_, { deckId, languageId, newCards }, { currentUser }) => {

      // Check that user is logged in
      if (!currentUser) {
        return { 
          __typename: 'Error',
          errorCodes: [errors.notAuthError]
        };
      }

      // validate input
      try {
        await fetchCardsSchema.validate({ deckId, languageId, newCards }, { abortEarly: false });
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
        deck = await Deck.findOne({ where: { id: deckId } });
      } catch(error) {
        return { 
          __typename: 'Error',
          errorCodes: [errors.internalServerError]
        };
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
        accountDeckSettings = await AccountDeckSettings.findOne({ where: { accountId: currentUser.id, deckId: deckId }});
      } catch(error) {
        return {
          __typename: 'Error',
          errorCodes: [errors.internalServerError]
        };
      }

      //create new accoung deck settings if no existing one
      if (!accountDeckSettings) {
        try {
          accountDeckSettings = await AccountDeckSettings.create({
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
          model: CardList,
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
          model: CardList,
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
        cards = await Card.findAll({
          where: {
            'id': { [Op.in]: idInLearningOrder },
            'active': true
          },
          subQuery: false,
          nest: true,
          include: [
            {
              model: Kanji,
              include: [
                {
                  model: KanjiTranslation,
                  where: {
                    language_id: selectedLanguage
                  },
                },
                {
                  model: Radical,
                  attributes: ['id', 'radical', 'reading', 'readingRomaji', 'strokeCount', 'createdAt', 'updatedAt'],
                  include: {
                    model: RadicalTranslation,
                    where: {
                      language_id: selectedLanguage
                    }
                  },
                }
              ]
            },
            {
              model: Word,
              include: {
                model: WordTranslation,
                where: {
                  language_id: selectedLanguage
                },
              }
            }
          ]
        });
      } else {
        cards = await Card.findAll({
          where: {
            'id': { [Op.in]: idInLearningOrder },
            'active': true
          },
          subQuery: false,
          nest: true,
          include: [
            {
              model: Kanji,
              include: [
                {
                  model: KanjiTranslation,
                  where: {
                    language_id: selectedLanguage
                  },
                },
                {
                  model: Radical,
                  attributes: ['id', 'radical', 'reading', 'readingRomaji', 'strokeCount', 'createdAt', 'updatedAt'],
                  include: {
                    model: RadicalTranslation,
                    where: {
                      language_id: selectedLanguage
                    }
                  },
                }
              ]
            },
            {
              model: AccountCard,
              where: {
                accountId: currentUser.id
              }
            },
            {
              model: Word,
              include: {
                model: WordTranslation,
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
    // Fetch cards that are due or new cards based on the newCards boolean value, defaults to false.
    fetchDecks: async (_, { filter }, { currentUser }) => {

      // Check that user is logged in
      if (!currentUser) {
        return { 
          __typename: 'Error',
          errorCodes: [errors.notAuthError]
        };
      }

      const decks = await Deck.findAll({
        where: {
          'active': true
        },
        subQuery: false,
        //raw: true,
        nest: true,
        include: {
          model: DeckTranslation,
          where: {
            'active': true
          }
        }
      });

      return {
        __typename: 'DeckList',
        Decks: decks
      };
    },
    fecthDeckSettings: async (_, { deckId }, { currentUser }) => {

      // Check that user is logged in
      if (!currentUser) {
        return { 
          __typename: 'Error',
          errorCodes: [errors.notAuthError]
        };
      }

      // validate input
      try {
        await validateDeckId.validate({ deckId }, { abortEarly: false });
      } catch (error) {
        return { 
          __typename: 'Error',
          errorCodes: formatYupError(error)
        };
      }

      let foundDeck;
      // Check if deck with an id exists
      try {
        foundDeck = await Deck.findOne({ where: { id: deckId } });
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
        deckSettings = await AccountDeckSettings.findOne({ where: {'account_id': currentUser.id, 'deck_id': deckId }, nest: true, });
      } catch(error) {
        return { 
          __typename: 'Error',
          errorCodes: [errors.internalServerError]
        };
      }

      //create new accoung deck settings if no existing one
      if (!deckSettings) {
        try {
          deckSettings = await AccountDeckSettings.create({
            accountId: currentUser.id,
            deckId: deckId
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

      // Check that user is logged in
      if (!currentUser) {
        return { 
          __typename: 'Error',
          errorCodes: [errors.notAuthError]
        };
      }

      // validate input
      try {
        await validateInteger.validate({ limitReviews }, { abortEarly: false });
      } catch (error) {
        return { 
          __typename: 'Error',
          errorCodes: formatYupError(error)
        };
      }

      try {
        const reviewHistory = await sequelize.query(rawQueries.fetchDailyReviewHistoryNDays, {
          replacements: {
            limitReviews: limitReviews,
            accountId: currentUser.id
          },
          model: AccountReview,
          type: sequelize.QueryTypes.SELECT,
          raw: true
        });

        if (reviewHistory.length === 0) {
          return { 
            __typename: 'Error',
            errorCodes: [errors.nonExistingId]  // switch to proper
          };
        }
        return { 
          __typename: 'Reviews',
          reviews: reviewHistory
        };
      } catch(error) {
        console.log(error);
        return { 
          __typename: 'Error',
          errorCodes: [errors.internalServerError]
        };
      }
    },
    fetchDueCount: async (_, { limitReviews }, { currentUser }) => {

      // Check that user is logged in
      if (!currentUser) {
        return { 
          __typename: 'Error',
          errorCodes: [errors.notAuthError]
        };
      }

      // validate input
      try {
        await validateInteger.validate({ limitReviews }, { abortEarly: false });
      } catch (error) {
        return { 
          __typename: 'Error',
          errorCodes: formatYupError(error)
        };
      }

      try {
        const dueReviews = await sequelize.query(rawQueries.fetchDueReviewsNDays, {
          replacements: {
            limitReviews: limitReviews,
            accountId: currentUser.id
          },
          model: AccountCard,
          type: sequelize.QueryTypes.SELECT,
          raw: true
        });

        if (dueReviews.length === 0) {
          return { 
            __typename: 'Error',
            errorCodes: [errors.nonExistingId]  // switch to proper
          };
        }
        return { 
          __typename: 'Reviews',
          reviews: dueReviews
        };
      } catch(error) {
        console.log(error);
        return { 
          __typename: 'Error',
          errorCodes: [errors.internalServerError]
        };
      }
    },
  },
  Mutation: {
    // eslint-disable-next-line no-unused-vars
    rescheduleCard: async (_, { cardId, reviewResult, newInterval, newEasyFactor, extraReview, timing }, { currentUser }) => {

      // Check that user is logged in
      if (!currentUser) {
        return { 
          __typename: 'Error',
          errorCodes: [errors.notAuthError]
        };
      }

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
        accountCard = await AccountCard.findOne({ where: { accountId: currentUser.id, cardId: cardId } });
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
            model: Card,
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
          accountCard = await AccountCard.create({
            accountId: currentUser.id,
            cardId: cardId,
            dueAt: newDueDate,
            easyFactor: constants.defaultEasyFactor,
            reviewCount: constants.defaultReviewCount,
          });
          accountCard.save();

        } catch(error) {
          console.log(error.errors);
          return { 
            __typename: 'Error',
            errorCodes: [errors.internalServerError]
          };
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
          console.log(error.errors);
          return { 
            __typename: 'Error',
            errorCodes: [errors.internalServerError]
          };
        }
      }

      try {
        // Add new row to review history
        const newReviewHistory = await AccountReview.create({
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
        console.log(error.errors);
        return { 
          __typename: 'Error',
          errorCodes: [errors.internalServerError]
        };
      }
    },
    changeDeckSettings: async (_, { deckId, favorite, reviewInterval, reviewsPerDay, newCardsPerDay }, { currentUser }) => {

      // Check that user is logged in
      if (!currentUser) {
        return { 
          __typename: 'Error',
          errorCodes: [errors.notAuthError]
        };
      }

      // validate input
      try {
        await validateDeckSettings.validate({ deckId, favorite, reviewInterval, reviewsPerDay, newCardsPerDay }, { abortEarly: false });
      } catch (error) {
        return { 
          __typename: 'Error',
          errorCodes: formatYupError(error)
        };
      }

      let foundDeck;
      // Check if deck with an id exists
      try {
        foundDeck = await Deck.findOne({ where: { id: deckId } });
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
        deckSettings = await AccountDeckSettings.findOne({ where: {'account_id': currentUser.id, 'deck_id': deckId }, nest: true, });
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
          deckSettings = await AccountDeckSettings.create({
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

      // Check that user is logged in
      if (!currentUser) {
        return { 
          __typename: 'Error',
          errorCodes: [errors.notAuthError]
        };
      }

      // validate input
      try {
        await validatePushCards.validate({ deckId, days }, { abortEarly: false });
      } catch (error) {
        return { 
          __typename: 'Error',
          errorCodes: formatYupError(error)
        };
      }

      // Push all users cards forward n days
      if (!deckId) {
        try {
          const result = await sequelize.query(rawQueries.pushAllCardsNDays, {
            replacements: {
              days: days,
              accountId: currentUser.id
            },
            model: AccountCard,
            type: sequelize.QueryTypes.UPDATE,
            raw: true
          });
          console.log(result);
          return { 
            __typename: 'Success',
            status: true
          };
        } catch(error) {
          console.log('error:', error);
          return {
            __typename: 'Error',
            errorCodes: [errors.internalServerError]
          };
        }
      }

      // Else push cards in deck x for n days
      try {
        const result = await sequelize.query(rawQueries.pushCardsInDeckIdNDays, {
          replacements: {
            days: days,
            deckId: deckId,
            accountId: currentUser.id
          },
          model: AccountCard,
          type: sequelize.QueryTypes.UPDATE,
          raw: true
        });
        console.log(result);
        return { 
          __typename: 'Success',
          status: true
        };
      } catch(error) {
        console.log('error:', error);
        return {
          __typename: 'Error',
          errorCodes: [errors.internalServerError]
        };
      }
    },
    editAccountCard: async (_, { cardId, story, hint }, { currentUser }) => {

      // Check that user is logged in
      if (!currentUser) {
        return { 
          __typename: 'Error',
          errorCodes: [errors.notAuthError]
        };
      }

      // validate input
      try {
        await validateEditAccountCard.validate({ cardId, story, hint }, { abortEarly: false });
      } catch (error) {
        return { 
          __typename: 'Error',
          errorCodes: formatYupError(error)
        };
      }

      let accountCard;
      // Check that account card exist and user is the owner od the card
      try {
        accountCard = await AccountCard.findOne({ where: { accountId: currentUser.id, cardId: cardId } });
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
            model: Card,
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
          accountCard = await AccountCard.create({
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
          console.log(error.errors);
          return { 
            __typename: 'Error',
            errorCodes: [errors.internalServerError]
          };
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
          console.log(error.errors);
          return { 
            __typename: 'Error',
            errorCodes: [errors.internalServerError]
          };
        }
      }
      return { 
        __typename: 'AccountCard',
        accountCard
      };
    },
  }
};

module.exports = {
  typeDef,
  resolvers
};
