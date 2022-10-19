const validator = require('validator');
const { Op } = require('sequelize');
const { Kanji, AccountKanjiReview, AccountKanjiCard, TranslationKanji, Radical, RadicalTranslation } = require('../../models');
const { sequelize } = require('../../util/database');
const constants = require('../../util/constants');
const errors = require('../../util/errors');

const typeDef = `
  type Account {
    id: ID!
    email: String
    username: String
    password: String
  }

  type Error {
    errorCode: String!
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

  type TranslationKanjiData {
    keyword: String
    story: String
    hint: String
    otherMeanings: String
  }

  type TranslationRadical {
    id: Int
    languageId: String
    translation: String
    description: String
    createdAt: String
    updatedAt: String
  }

  type RadicalData {
    id: Int
    radical: String
    reading: String
    readingRomaji: String
    strokeCount: Int
    createdAt: String
    updatedAt: String
    translation_radicals: [TranslationRadical]
  }

  type Card {
    id: Int
    kanji: String
    learningOrder: Int
    jlptLevel: Int
    onyomi: String
    onyomiRomaji: String
    kunyomi: String
    kunyomiRomaji: String
    strokeCount: Int
    createdAt: String
    updatedAt: String
    translation_kanjis: [TranslationKanjiData]
    account_kanji_cards: [CustomizedCardData]
    radicals: [RadicalData]
  }

  type CardSet {
    Cards: [Card]
  }

  union CardPayload = CardSet | Error
  union RescheduleResult = Success | Error

  type Query {
    fetchDueKanjiCards(
      jlptLevel: Int
      includeLowerLevelCards: Boolean
      limitReviews: Int
      langId: String
    ): CardPayload!

    fetchNewKanjiCards(
      jlptLevel: Int
      includeLowerLevelCards: Boolean
      limitReviews: Int
      langId: String
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
    fetchDueKanjiCards: async (_, { jlptLevel, includeLowerLevelCards, limitReviews, langId }, { currentUser }) => {

      // Check that user is logged in
      if (!currentUser) {
        return { 
          __typename: 'Error',
          errorCode: errors.notAuthError
        };
      }

      // Confirm that jlpt level and language id are not empty
      if (!jlptLevel || !langId) {
        return { 
          __typename: 'Error',
          errorCode: errors.inputValueMissingError
        };
      }

      // Chack that language id is one of the available
      if (!validator.isIn(langId.toLowerCase(), constants.availableLanguages)) {
        return { 
          __typename: 'Error',
          errorCode: errors.invalidLanguageIdError
        };
      }

      // Check that type of integer correct
      if (!Number.isInteger(jlptLevel) || (limitReviews && !Number.isInteger(limitReviews))) {
        return { 
          __typename: 'Error',
          errorCode: errors.inputValueTypeError
        };
      }

      // Check that jlpt level between 1 - 5
      if (!constants.jltpLevels.includes(jlptLevel)) {
        return { 
          __typename: 'Error',
          errorCode: errors.invalidJlptLevelError
        };
      }

      // Check that limitReviews in correct range
      if (limitReviews > constants.maxLimitReviews || limitReviews < constants.minLimitReviews) {
        return { 
          __typename: 'Error',
          errorCode: errors.limitReviewsRangeError
        };
      }

      let selectLevel = { [Op.eq]: jlptLevel };
      // Set where filter to JLPT level >= jlptLevel, lower level cards included
      if (includeLowerLevelCards) {
        selectLevel = { [Op.gte]: jlptLevel };
      }

      // Find due cards, order by due date
      const cards = await Kanji.findAll({
        where: {
          'jlptLevel': selectLevel
        },
        include: [
          {
            model: AccountKanjiCard,
            attributes: ['reviewCount', 'easyFactor', 'accountStory', 'accountHint', 'dueDate'],
            where: {
              account_id: currentUser.id
            }
          },
          {
            model: TranslationKanji,
            attributes: ['keyword', 'story', 'hint', 'otherMeanings'],
            where: {
              language_id: langId
            }
          },
          {
            model: Radical,
            attributes: ['id', 'radical', 'reading', 'readingRomaji', 'strokeCount', 'createdAt', 'updatedAt'],
            include: {
              model: RadicalTranslation,
              where: {
                language_id: langId
              }
            },
          },
        ],
        order: [
          [AccountKanjiCard, 'dueDate', 'ASC']
        ]
      });

      // If no cards found, return error
      if (cards.length === 0) {
        return { 
          __typename: 'Error',
          errorCode: errors.noDueCardsError
        };
      }

      // Slice if review count limited
      if (limitReviews) {
        return {
          __typename: 'CardSet',
          Cards: cards.slice(0, limitReviews),
        };
      }

      return {
        __typename: 'CardSet',
        Cards: cards,
      };
    },
    // Fetch cards that are due or new cards based on the newCards boolean value, defaults to false.
    fetchNewKanjiCards: async (_, { jlptLevel, includeLowerLevelCards, limitReviews, langId }, { currentUser }) => {

      // Check that user is logged in
      if (!currentUser) {
        return { 
          __typename: 'Error',
          errorCode: errors.notAuthError
        };
      }

      // Confirm that jlpt level and language id are not empty
      if (!jlptLevel || !langId) {
        return { 
          __typename: 'Error',
          errorCode: errors.inputValueMissingError
        };
      }

      // Chack that language id is one of the available
      if (!validator.isIn(langId.toLowerCase(), constants.availableLanguages)) {
        return { 
          __typename: 'Error',
          errorCode: errors.invalidLanguageIdError
        };
      }

      // Check that type of integer correct
      if (!Number.isInteger(jlptLevel) || (limitReviews && !Number.isInteger(limitReviews))) {
        return { 
          __typename: 'Error',
          errorCode: errors.inputValueTypeError
        };
      }

      // Check that jlpt level between 1 - 5
      if (!constants.jltpLevels.includes(jlptLevel)) {
        return { 
          __typename: 'Error',
          errorCode: errors.invalidJlptLevelError
        };
      }

      // Check that limitReviews in correct range (1 - 9999)
      if (limitReviews > constants.maxLimitReviews || limitReviews < constants.availableLanguages.minLimitReviews) {
        return { 
          __typename: 'Error',
          errorCode: errors.limitReviewsRangeError
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
          errorCode: errors.noNewCardsError
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
          {
            model: TranslationKanji,
            attributes: ['keyword', 'story', 'hint', 'otherMeanings'],
            where: {
              language_id: langId
            }
          },
          {
            model: Radical,
            attributes: ['id', 'radical', 'reading', 'readingRomaji', 'strokeCount', 'createdAt', 'updatedAt'],
            include: {
              model: RadicalTranslation,
              where: {
                language_id: langId
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
          errorCode: errors.notAuthError
        };
      }

      // Confirm that jlpt level and language id are not empty
      if (!kanjiId || !reviewResult || !newInterval || !newEasyFactor) {
        return { 
          __typename: 'Error',
          errorCode: errors.inputValueMissingError
        };
      }

      // Chack that result is one of the available
      if (!validator.isIn(reviewResult.toLowerCase(), constants.availableResults)) {
        return { 
          __typename: 'Error',
          errorCode: errors.invalidResultIdError
        };
      }

      // Check that type of integer correct
      if (!Number.isInteger(kanjiId) || !Number.isInteger(newInterval)) {
        return { 
          __typename: 'Error',
          errorCode: errors.inputValueTypeError
        };
      }

      // TODO
      // Check that type of float correct
      if (!newEasyFactor || !timing) {
        return { 
          __typename: 'Error',
          errorCode: errors.inputValueTypeError
        };
      }

      // Check that integers and floats positive numbers
      if (kanjiId < 1 || newInterval < 1 || newEasyFactor <= 0.0) {
        return { 
          __typename: 'Error',
          errorCode: errors.negativeNumberTypeError
        };
      }

      let accountKanjiCard;
      // Create new (due) date object
      let newDueDate = new Date();
      newDueDate.setDate(newDueDate.getDate() + newInterval);

      try {
        // Check if card exists for the user for that kanji
        accountKanjiCard = await AccountKanjiCard.findOne({ where: { accountId: currentUser.id, kanjiId: kanjiId } });
      } catch(error) {
        return { 
          __typename: 'Error',
          errorCode: errors.connectionError
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
              errorCode: errors.nonExistingId
            };
          }
          
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

          return { 
            __typename: 'Success',
            status: true
          };

        } catch(error) {
          console.log(error.errors);
          return { 
            __typename: 'Error',
            errorCode: errors.connectionError
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

        // Add new row to review history
        await AccountKanjiReview.create({
          accountId: currentUser.id,
          kanjiId: kanjiId,
          reviewResult: reviewResult,
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
          errorCode: errors.connectionError
        };
      }
    },
  }
};

module.exports = {
  typeDef,
  resolvers
};
