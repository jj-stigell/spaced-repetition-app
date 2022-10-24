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
  AccountCard
} = require('../../models');
const { sequelize } = require('../../util/database');
const constants = require('../../util/constants');
const errors = require('../../util/errors');
const { selectNewCardIds, selectDueCardIds } = require('./rawQueries');

const typeDef = `
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
    createdAt: String
    updatedAt: String
  }

  type RadicalTranslation {
    translation: String
    description: String
    createdAt: String
    updatedAt: String
  }

  type Radical {
    radical: String
    reading: String
    readingRomaji: String
    strokeCount: Int
    createdAt: String
    updatedAt: String
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
    createdAt: String
    updatedAt: String
    kanji_translations: [KanjiTranslation]
    account_kanji_cards: [CustomizedCardData]
    radicals: [Radical]
  }

  type Card {
    id: Int
    type: String
    createdAt: String
    updatedAt: String
    kanji: Kanji
  }

  type CardSet {
    Cards: [Card]
  }

  union CardPayload = CardSet | Error
  union RescheduleResult = Success | Error

  type Query {
    fetchCards(
      deckId: Int!
      languageId: String
      newCards: Boolean
    ): CardPayload!

    fetchNewKanjiCards(
      jlptLevel: Int
      includeLowerLevelCards: Boolean
      limitReviews: Int
      languageId: String
    ): CardPayload!
  }

  type Mutation {
    rescheduleCard(
      kanjiId: Int!
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
          errorCodess: [errors.notAuthError]
        };
      }

      // Confirm that deck id is not empty
      if (!deckId) {
        return { 
          __typename: 'Error',
          errorCodess: [errors.inputValueMissingError]
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
          errorCodes: [errors.connectionError]
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
          errorCodes: [errors.connectionError]
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
            errorCodes: [errors.connectionError]
          };
        }
      }


      console.log(accountDeckSettings.reviewsPerDay);
      


      let cards = [];


      if (newCards) {
        // Fetch new cards
        const cardIds = await sequelize.query(selectNewCardIds, {
          replacements: {
            deckId: deckId,
            accountId: currentUser.id,
            limitReviews: accountDeckSettings.newCardsPerDay,
          },
          model: CardList,
          type: sequelize.QueryTypes.SELECT,
          raw: true
        });
  
        const idInLearningOrder = cardIds.map(listItem => listItem.card_id);
        cards = await Card.findAll({
          where: {
            'id': { [Op.in]: idInLearningOrder },
            'active': true
          },
          subQuery: false,
          nest: true,
          include: {
            model: Kanji,
            include: [
              {
                model: KanjiTranslation,
                where: {
                  language_id: languageId
                },
              },
              {
                model: Radical,
                attributes: ['id', 'radical', 'reading', 'readingRomaji', 'strokeCount', 'createdAt', 'updatedAt'],
                include: {
                  model: RadicalTranslation,
                  where: {
                    language_id: languageId
                  }
                },
              }
            ]
          }
        });
  
        cards.sort(function (a, b) {
          return idInLearningOrder.indexOf(a.id) - idInLearningOrder.indexOf(b.id);
        });
      } else {




        // Fetch due cards
        const cardIds = await sequelize.query(selectDueCardIds, {
          replacements: {
            deckId: deckId,
            accountId: currentUser.id,
            limitReviews: accountDeckSettings.reviewsPerDay,
          },
          model: CardList,
          type: sequelize.QueryTypes.SELECT,
          raw: true
        });
  
        const fetchCardIds = cardIds.map(listItem => listItem.card_id);
        console.log(fetchCardIds);
        cards = await Card.findAll({
          where: {
            'id': { [Op.in]: fetchCardIds },
            'active': true
          },
          subQuery: false,
          nest: true,
          include: {
            model: Kanji,
            include: [
              {
                model: KanjiTranslation,
                where: {
                  language_id: languageId
                },
              },
              {
                model: Radical,
                attributes: ['id', 'radical', 'reading', 'readingRomaji', 'strokeCount', 'createdAt', 'updatedAt'],
                include: {
                  model: RadicalTranslation,
                  where: {
                    language_id: languageId
                  }
                },
              }
            ]
          }
        });
  
        cards.sort(function (a, b) {
          return fetchCardIds.indexOf(a.id) - fetchCardIds.indexOf(b.id);
        });





































      }




      // If no cards found, return error
      if (cards.length === 0) {
        return { 
          __typename: 'Error',
          errorCodes: [errors.noDueCardsError]
        };
      }

      return {
        __typename: 'CardSet',
        Cards: cards
      };
    },
    // Fetch cards that are due or new cards based on the newCards boolean value, defaults to false.
    fetchNewKanjiCards: async (_, { jlptLevel, includeLowerLevelCards, limitReviews, languageId }, { currentUser }) => {

      // Check that user is logged in
      if (!currentUser) {
        return { 
          __typename: 'Error',
          errorCodes: errors.notAuthError
        };
      }

      // Confirm that jlpt level and language id are not empty
      if (!jlptLevel || !languageId) {
        return { 
          __typename: 'Error',
          errorCodes: errors.inputValueMissingError
        };
      }

      // Chack that language id is one of the available
      if (!validator.isIn(languageId.toLowerCase(), constants.availableLanguages)) {
        return { 
          __typename: 'Error',
          errorCodes: errors.invalidLanguageIdError
        };
      }

      // Check that type of integer correct
      if (!Number.isInteger(jlptLevel) || (limitReviews && !Number.isInteger(limitReviews))) {
        return { 
          __typename: 'Error',
          errorCodes: errors.inputValueTypeError
        };
      }

      // Check that jlpt level between 1 - 5
      if (!constants.jltpLevels.includes(jlptLevel)) {
        return { 
          __typename: 'Error',
          errorCodes: errors.invalidJlptLevelError
        };
      }

      // Check that limitReviews in correct range (1 - 9999)
      if (limitReviews > constants.maxLimitReviews || limitReviews < constants.availableLanguages.minLimitReviews) {
        return { 
          __typename: 'Error',
          errorCodes: errors.limitReviewsRangeError
        };
      }

      let selectLevel = '=';
      // Set where filter to JLPT level >= jlptLevel, lower level cards included
      if (includeLowerLevelCards) {
        selectLevel = '>=';
      }

      // Fetch id of new cards (cards not existing in user cards)
      const rawQuery = `SELECT id FROM kanji WHERE jlpt_level ${selectLevel} :jlptLevel AND NOT EXISTS (
        SELECT NULL 
        FROM account_kanji_card 
        WHERE account_kanji_card.account_id = :accountId AND kanji.id = account_kanji_card.kanji_id
      ) 
      ORDER BY learning_order ASC LIMIT :limitReviews`;

      const cardIds = await sequelize.query(rawQuery, {
        replacements: {
          jlptLevel: jlptLevel,
          accountId: currentUser.id,
          limitReviews: limitReviews,
        },
        model: Kanji,
        type: sequelize.QueryTypes.SELECT,
        raw: true
      });

      const idArray = cardIds.map(card => card.id);

      // If no cards found, return error
      if (idArray.length === 0) {
        return { 
          __typename: 'Error',
          errorCodes: errors.noNewCardsError
        };
      }

      // Fetch cards based on previously found ids, order according the learning order
      const cards = await Kanji.findAll({
        where: {
          'id': {
            [Op.in]: idArray
          }
        },
        include: [
          /*
          {
            model: TranslationKanji,
            attributes: ['keyword', 'story', 'hint', 'otherMeanings'],
            where: {
              language_id: languageId
            }
          },
          */
          {
            model: Radical,
            attributes: ['id', 'radical', 'reading', 'readingRomaji', 'strokeCount', 'createdAt', 'updatedAt'],
            include: {
              model: RadicalTranslation,
              where: {
                language_id: languageId
              }
            },
          },
        ],
        order: [
          ['learningOrder', 'ASC']
        ]
      });

      return {
        __typename: 'CardSet',
        Cards: cards,
      };
    },
  },
  Mutation: {
    // eslint-disable-next-line no-unused-vars
    rescheduleCard: async (_, { kanjiId, reviewResult, newInterval, newEasyFactor, extraReview, timing }, { currentUser }) => {

      // Check that user is logged in
      if (!currentUser) {
        return { 
          __typename: 'Error',
          errorCodes: errors.notAuthError
        };
      }

      // Confirm that jlpt level and language id are not empty
      if (!kanjiId || !reviewResult || !newInterval || !newEasyFactor) {
        return { 
          __typename: 'Error',
          errorCodes: errors.inputValueMissingError
        };
      }

      // Chack that result is one of the available
      if (!validator.isIn(reviewResult.toLowerCase(), constants.availableResults)) {
        return { 
          __typename: 'Error',
          errorCodes: errors.invalidResultIdError
        };
      }

      // Check that type of integer correct
      if (!Number.isInteger(kanjiId) || !Number.isInteger(newInterval)) {
        return { 
          __typename: 'Error',
          errorCodes: errors.inputValueTypeError
        };
      }

      // TODO
      // Check that type of float correct
      if (!newEasyFactor || !timing) {
        return { 
          __typename: 'Error',
          errorCodes: errors.inputValueTypeError
        };
      }

      // Check that integers and floats positive numbers
      if (kanjiId < 1 || newInterval < 1 || newEasyFactor <= 0.0) {
        return { 
          __typename: 'Error',
          errorCodes: errors.negativeNumberTypeError
        };
      }

      let accountKanjiCard;
      // Create new (due) date object
      let newDueDate = new Date();
      newDueDate.setDate(newDueDate.getDate() + newInterval);

      try {
        // Check if card exists for the user for that kanji
        //accountKanjiCard = await AccountKanjiCard.findOne({ where: { accountId: currentUser.id, kanjiId: kanjiId } });
      } catch(error) {
        return { 
          __typename: 'Error',
          errorCodes: errors.connectionError
        };
      }

      // Create new custom card for the user, if none found the current user id and kanji id
      if (!accountKanjiCard) {
        // Check that kanji actually exists in the database
        const rawQuery = 'SELECT 1 FROM kanji WHERE id = :kanjiId';
        try {
          const kanji = await sequelize.query(rawQuery, {
            replacements: {
              kanjiId: kanjiId,
            },
            model: Kanji,
            type: sequelize.QueryTypes.SELECT,
            raw: true
          });

          if (!kanji[0]) {
            return { 
              __typename: 'Error',
              errorCodes: errors.nonExistingId
            };
          }
          
          /*
          // Create new account kanji card if kanji exists
          accountKanjiCard = await AccountKanjiCard.create({
            accountId: currentUser.id,
            kanjiId: kanjiId,
            dueDate: newDueDate,
            easyFactor: 2.5,
            reviewCount: 1,
          });
          accountKanjiCard.save();

          // Add new row to review history
          // eslint-disable-next-line no-unused-vars
          const newReviewHistory = await AccountKanjiReview.create({
            accountId: currentUser.id,
            kanjiId: kanjiId,
            reviewResult: reviewResult,
            extraReview: extraReview ? true : false,
            timing: timing
          });

          */
          return { 
            __typename: 'Success',
            status: true
          };

        } catch(error) {
          console.log(error.errors);
          return { 
            __typename: 'Error',
            errorCodes: errors.connectionError
          };
        }
      }

      // Update existing user kanji card and add new row to history
      try {
        // Add one review to the total count
        accountKanjiCard.increment('reviewCount');
        
        // Update and save changes, card is set to mature if the interval is higher than set maturing interval
        accountKanjiCard.set({
          easyFactor: newEasyFactor,
          dueDate: newDueDate,
          mature: newInterval > constants.matureInterval ? true : false
        });
        accountKanjiCard.save();

        /*
        // Add new row to review history
        await AccountKanjiReview.create({
          accountId: currentUser.id,
          kanjiId: kanjiId,
          reviewResult: reviewResult,
          extraReview: extraReview ? true : false,
          timing: timing
        });
        */

        return { 
          __typename: 'Success',
          status: true,
        };
      } catch(error) {
        console.log(error.errors);
        return { 
          __typename: 'Error',
          errorCodes: errors.connectionError
        };
      }
    },
  }
};

module.exports = {
  typeDef,
  resolvers
};
