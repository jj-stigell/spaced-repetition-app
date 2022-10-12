const { UserInputError } = require('apollo-server');
// eslint-disable-next-line no-unused-vars
const validator = require('validator');
// eslint-disable-next-line no-unused-vars
const { Kanji, AccountKanjiReview, AccountKanjiCard, TranslationKanji } = require('../../models');
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
  }

  type CardSet {
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
    account_kanji_cards: CustomizedCardData
  }

  type Query {
    fetchDueCards(
      type: String
      jlptLevel: Int
      includeLowerLevelCards: Boolean
      limitReviews: Int
      newCards: Boolean
    ): [CardSet]
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
    fetchDueCards: async (_, { type, jlptLevel, includeLowerLevelCards, limitReviews, newCards }) => {
      /**
       * Fetch cards that are due or new cards based on the newCards boolean value, defaults to false. 
       */
      //, { currentUser }

      const userID = 1;
      // eslint-disable-next-line no-unused-vars
      const cards = await Kanji.findAll({
        include: {
          model: AccountKanjiCard,
          attributes: ['reviewCount', 'easyFactor', 'accountStory', 'accountHint'],
          where: {
            account_id: userID
          }
        },
        raw : true,
        nest : true
      });
      


      return cards;
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
