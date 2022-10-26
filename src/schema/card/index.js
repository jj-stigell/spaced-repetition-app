/* eslint-disable no-unused-vars */
const validator = require('validator');
const { Op } = require('sequelize');
const {
  Deck,
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
const { sequelize } = require('../../util/database');
const constants = require('../../util/constants');
const errors = require('../../util/errors');
const { selectNewCardIds, selectDueCardIds, findCard } = require('./rawQueries');
const { fetchCardsSchema } = require('../../util/validation');
const formatYupError = require('../../util/errorFormatter');

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

  type CustomizedCardData {
    reviewCount: Int
    easyFactor: Float
    accountStory: String
    accountHint: String
    dueDate: String
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
    account_cards: [CustomizedCardData]
    kanji: Kanji
    word: Word
  }

  type Cardset {
    Cards: [Card]
  }

  union CardPayload = Cardset | Error
  union RescheduleResult = Success | Error

  type Query {
    fetchCards(
      deckId: Int!
      languageId: String
      newCards: Boolean
    ): CardPayload!
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
          errorCodes: [errors.nonExistingDeck]
        };
      }

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
        cardIds = await sequelize.query(selectNewCardIds, {
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
        cardIds = await sequelize.query(selectDueCardIds, {
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
          const card = await sequelize.query(findCard, {
            replacements: {
              cardId: cardId,
            },
            model: Kanji,
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
  }
};

module.exports = {
  typeDef,
  resolvers
};
