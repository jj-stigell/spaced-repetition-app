const { UserInputError } = require('apollo-server');
const { Op } = require('sequelize');
// eslint-disable-next-line no-unused-vars
const validator = require('validator');
// eslint-disable-next-line no-unused-vars
const { Kanji, AccountKanjiReview, AccountKanjiCard, TranslationKanji, Radical, TranslationRadical } = require('../../models');
const matureInterval = 21;
const errors = require('../../util/errors');
// eslint-disable-next-line no-unused-vars
const constants = require('../../util/constants');

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
  }

  type Mutation {
    rescheduleCard(
      kanjiId: Int!
      reviewResult: String!
      newInterval: Int!
      newEasyFactor: Float!
      extraReview: Boolean
    ): RescheduleResult!

  }
`;

const resolvers = {
  Query: {
    // eslint-disable-next-line no-unused-vars
    fetchDueKanjiCards: async (_, { jlptLevel, includeLowerLevelCards, limitReviews, langId }, { currentUser }) => {
      /**
       * Fetch cards that are due or new cards based on the newCards boolean value, defaults to false. 
       */

      console.log(errors);

      //validation and errors here

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



      //errors
      /*
const errors = {
  inputValueMissingError: 'inputValueMissingError',
  passwordMismatchError: 'passwordMismatchError',
  passwordValidationError: 'passwordValidationError',
  notEmailError: 'notEmailError',
  usernameValidationError: 'usernameValidationError',
  emailInUseError: 'emailInUseError',
  usernameInUseError: 'usernameInUseError',
  connectionError: 'connectionError',
  userOrPassIncorrectError: 'userOrPassIncorrectError',
  notAuthError: 'notAuthError',
  changePasswordValueMissingError: 'changePasswordValueMissingError',
  currAndNewPassEqualError: 'currAndNewPassEqualError',
  currentPasswordIncorrect: 'currentPasswordIncorrect',
};
      */








      let selectLevel = { [Op.eq]: jlptLevel };

      // Set where filter to JLPT level >= jlptLevel, idf lower level cards included
      if (includeLowerLevelCards) {
        selectLevel = { [Op.gte]: jlptLevel };
      }

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
              model: TranslationRadical,
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
