const { UserInputError } = require('apollo-server');
const { Op } = require('sequelize');
// eslint-disable-next-line no-unused-vars
const validator = require('validator');
// eslint-disable-next-line no-unused-vars
const { Kanji, AccountKanjiReview, AccountKanjiCard, TranslationKanji, Radical, TranslationRadical } = require('../../models');
const matureInterval = 21;

const typeDef = `
  type Account {
    id: ID!
    email: String
    username: String
    password: String
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

  type Query {
    fetchDueCards(
      type: String
      jlptLevel: Int
      includeLowerLevelCards: Boolean
      limitReviews: Int
      newCards: Boolean
    ): [Card]
  }

  type Mutation {
    rescheduleCard(
      kanjiId: Int!
      reviewResult: String!
      newInterval: Int!
      newEasyFactor: Float!
      extraReview: Boolean
    ): Boolean!

  }
`;

const resolvers = {
  Query: {
    // eslint-disable-next-line no-unused-vars
    fetchDueCards: async (_, { type, jlptLevel, includeLowerLevelCards, limitReviews, langId }) => {
      /**
       * Fetch cards that are due or new cards based on the newCards boolean value, defaults to false. 
       */

      const typee = 'kanji';
      const jplevel = 1;
      const lowerLevel = true;
      const userID = 1;
      const lang = 'en';
      const limitter = 378;

      const cards = await Kanji.findAll({
        where: {
          'jlptLevel': {
            [Op.eq]: jplevel
          }
          
        },
        include: [
          {
            model: AccountKanjiCard,
            attributes: ['reviewCount', 'easyFactor', 'accountStory', 'accountHint', 'dueDate'],
            //order: [['account_kanji_cards', 'dueDate', 'ASC']],
            where: {
              account_id: userID
            }
          },
          {
            model: TranslationKanji,
            attributes: ['keyword', 'story', 'hint', 'otherMeanings'],
            where: {
              language_id: lang
            }
          },
          {
            model: Radical,
            attributes: ['id', 'radical', 'reading', 'readingRomaji', 'strokeCount', 'createdAt', 'updatedAt'],
            include: {
              model: TranslationRadical,
              where: {
                language_id: lang
              }
            },
          },
        ],
        order: [
          [AccountKanjiCard, 'dueDate', 'ASC']
        ]
      });

      console.log(cards.length);
      return cards.slice(0, limitter);
    },
  },
  Mutation: {
    rescheduleCard: async (_, { kanjiId, reviewResult, newInterval, newEasyFactor, extraReview }, { currentUser }) => {

      // Check that user is logged in
      if (!currentUser) {
        throw new UserInputError('Not authenticated');
      }

      // Find account custom kanji card
      const kanjiCardInfo = await AccountKanjiCard.findOne({ where: { accountId: currentUser.id, kanjiId: kanjiId } });

      if (!kanjiCardInfo) {
        throw new UserInputError('Card not found, you have not previously reviewed this card');
      }

      try {
      // Add one review to the total count
        kanjiCardInfo.increment('reviewCount');
        
        // Update and save changes
        kanjiCardInfo.set({
          easyFactor: newEasyFactor,
          dueDate: '2022-12-01',
          mature: newInterval > matureInterval ? true : false
        });
        kanjiCardInfo.save();


        // Add new row to review history
        await AccountKanjiReview.create({
          accountId: currentUser.id,
          kanjiId: kanjiId,
          reviewResult: reviewResult,
          extraReview: extraReview ? true : false
        });
        return true;
      } catch(error) {
        console.log(error.errors);
        throw new UserInputError('Something went wrong, pleasy try again');
      }
    },
  }
};

module.exports = {
  typeDef,
  resolvers
};
