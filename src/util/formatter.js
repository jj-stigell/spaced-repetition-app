/** Various functions for formatting data in the resolvers */

/**
 * Reformat radical object
 * @param {object} radicals - all radicals connected to a kanji card 
 * @returns {object} of reformatted radicals
 */
const formatRadicals = (radicals) => {
  const formattedRadicals = [];

  radicals.forEach(radical => {
    const formatted = {
      radical: radical.radical,
      reading: radical.reading,
      readingRomaji: radical.readingRomaji,
      strokeCount: radical.strokeCount,
      createdAt: radical.createdAt,
      updatedAt: radical.updatedAt,
      translation: {
        translation: radical.radical_translations[0].translation,
        description: radical.radical_translations[0].description,
        createdAt: radical.radical_translations[0].createdAt,
        updatedAt: radical.radical_translations[0].updatedAt
      }
    };
    formattedRadicals.push(formatted);
  });
  return formattedRadicals;
};

/**
 * Reformat word card
 * @param {Object} word - word object
 * @returns {object} of reformatted word card
 */
const formWordCard = (word, reviewType, includeCustomData) => {
  return {
    id: word.id,
    cardType: word.type,
    reviewType: reviewType,
    createdAt: word.createdAt,
    updatedAt: word.updatedAt,
    accountCard: (word?.account_cards && word?.account_cards[0]) ? {
      id: word.account_cards[0].id,
      reviewCount: word.account_cards[0].reviewCount,
      easyFactor: word.account_cards[0].easyFactor,
      accountStory: includeCustomData ? word.account_cards[0].accountStory : null,
      accountHint: includeCustomData ? word.account_cards[0].accountHint : null,
      dueAt: word.account_cards[0].dueAt,
      mature: word.account_cards[0].mature,
      createdAt: word.account_cards[0].createdAt,
      updatedAt: word.account_cards[0].updatedAt
    } : null,
    word: {
      id: word.word.id,
      word: word.word.word,
      jlptLevel: word.word.jlptLevel,
      furigana: word.word.furigana,
      reading: word.word.reading,
      readingRomaji: word.word.readingRomaji,
      createdAt: word.word.createdAt,
      updatedAt: word.word.updatedAt,
      translation: {
        translation: word.word.word_translations[0].translation,
        hint: word.word.word_translations[0].hint,
        description: word.word.word_translations[0].description,
        createdAt: word.word.word_translations[0].createdAt,
        updatedAt: word.word.word_translations[0].updatedAt
      }
    }
  };
};

/**
 * Reformat kanji card
 * @param {Object} kanji - kanji object
 * @returns {object} of reformatted kanji card
 */
const formKanjiCard = (kanji, reviewType, includeCustomData) => {
  return {
    id: kanji.id,
    cardType: kanji.type,
    reviewType: reviewType,
    createdAt: kanji.createdAt,
    updatedAt: kanji.updatedAt,
    accountCard: (kanji?.account_cards && kanji?.account_cards[0]) ? {
      id: kanji.account_cards[0].id,
      reviewCount: kanji.account_cards[0].reviewCount,
      easyFactor: kanji.account_cards[0].easyFactor,
      accountStory: includeCustomData ? kanji.account_cards[0].accountStory : null,
      accountHint: includeCustomData ? kanji.account_cards[0].accountHint : null,
      dueAt: kanji.account_cards[0].dueAt,
      mature: kanji.account_cards[0].mature,
      createdAt: kanji.account_cards[0].createdAt,
      updatedAt: kanji.account_cards[0].updatedAt
    } : null,
    radicals: formatRadicals(kanji.kanji.radicals),
    kanji: {
      id: kanji.kanji.id,
      kanji: kanji.kanji.kanji,
      jlptLevel: kanji.kanji.jlptLevel,
      onyomi: kanji.kanji.onyomi,
      onyomiRomaji: kanji.kanji.onyomiRomaji,
      kunyomi: kanji.kanji.kunyomi,
      kunyomiRomaji: kanji.kanji.kunyomiRomaji,
      strokeCount: kanji.kanji.strokeCount,
      createdAt: kanji.kanji.createdAt,
      updatedAt: kanji.kanji.updatedAt,
      translation: {
        keyword: kanji.kanji.kanji_translations[0].keyword,
        story: kanji.kanji.kanji_translations[0].story,
        hint: kanji.kanji.kanji_translations[0].hint,
        otherMeanings: kanji.kanji.kanji_translations[0].story.otherMeanings,
        description: kanji.kanji.kanji_translations[0].description,
        createdAt: kanji.kanji.kanji_translations[0].createdAt,
        updatedAt: kanji.kanji.kanji_translations[0].updatedAt
      }
    }
  };
};

/**
 * Restructure card structure to match the model
 * @param {object} cards - set of cards
 * @returns set of reformatted cards
 */
const cardFormatter = (cards, byType = false, includeCustomData = false) => {
  const formedCards = [];
  let formattedCard;

  if (byType) {
    cards.forEach(card => {
      switch (card.type) {
      case 'WORD':
        formattedCard = formWordCard(card, null, includeCustomData);
        break;
      case 'KANJI':
        formattedCard = formKanjiCard(card, null, includeCustomData);
        break;
      default:
        formattedCard = null;
        break;
      }
      formedCards.push(formattedCard);
    });
  } else {
    cards.forEach(card => {
      switch (card.card.type) {
      case 'WORD':
        formattedCard = formWordCard(card.card, card.reviewType, includeCustomData);
        break;
      case 'KANJI':
        formattedCard = formKanjiCard(card.card, card.reviewType, includeCustomData);
        break;
      default:
        formattedCard = null;
        break;
      }
      formedCards.push(formattedCard);
    });
  }
  return formedCards;
};

/**
 * Restructure statistics from database
 * @param {Object} stats - statistics from database
 * @returns {Object} set of reformatted statistics
 */
const formStatistics = async (stats) => {

  const statistics = {
    matured: 0,
    learning: 0,
    new: 0
  };

  stats.forEach(value => {
    switch (value.status) {
    case 'matured':
      statistics.matured = value.count;
      break;
    case 'learning':
      statistics.learning = value.count;
      break;
    case 'new':
      statistics.new = value.count;
      break;
    }
  });
  return statistics;
};

module.exports = {
  cardFormatter,
  formStatistics
};
