/* eslint-disable @typescript-eslint/no-explicit-any */
import { cardErrors } from '../../configs/errorCodes';
import Card from '../../database/models/card';
import { ApiError } from '../../class';
import { AnswerOption, CardType, HttpCode, ReviewType, StudyCard } from '../../types';

/**
 * Finds a card by its ID.
 * @param {number} id - The ID of the card to be found.
 * @returns {Promise<Card>} - A promise that resolves with the found card model object.
 * @throws {ApiError} - If the card is not found, it throws an error with a message
 * indicating the missing card with the specific ID.
 */
export async function findCardById(id: number): Promise<Card> {
  const card: Card | null = await Card.findByPk(id);
  if (!card) {
    throw new ApiError(cardErrors.ERR_CARD_NOT_FOUND, HttpCode.NotFound);
  }
  return card;
}

export type CardData = {
  deckId: number;
  cardId: number;
  active: boolean;
  learningOrder: number;
  reviewType: ReviewType;
  createdAt: Date;
  updatedAt: Date;
  card: {
    id: number;
    type: CardType;
    languageId: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    answer_options: [
      {
        id: number;
        languageId: string;
        keyword: string;
        options: Array<AnswerOption>;
        createdAt: Date;
        updatedAt: Date;
      }
    ],
    kanji: {
      id: number;
      cardId: number;
      kanji: string;
      jlptLevel: number;
      onyomi: string;
      onyomiRomaji: string;
      kunyomi: string;
      kunyomiRomaji: string;
      strokeCount: number;
      createdAt: Date;
      updatedAt: Date;
    },
    vocabulary: {
      id: number;
      cardId: number;
      word: string;
      furigana: boolean;
      reading: string;
      readingRomaji: string;
      jlptLevel: number;
      createdAt: Date;
      updatedAt: Date;
    },
    kana: {
      id: number;
      cardId: number;
      kana: string;
      romaji: string;
      strokeCount: number;
      createdAt: Date;
      updatedAt: Date;
    }
  }
}

export function cardFormatter(rawCards: Array<CardData>): Array<StudyCard> {
  const formattedCards: Array<StudyCard> = rawCards.map((card: CardData) => {

    const formattedCard: any = {
      id: card.cardId,
      learningOrder: card.learningOrder,
      cardType: card.card.type,
      reviewType: card.reviewType,
      card: null
    };

    switch (card.card.type) {
    case CardType.KANJI:
      formattedCard.card = formatKanji(card.card, card.reviewType);
      break;
    case CardType.KANA:
      formattedCard.card = formatKana(card.card, card.reviewType);
      break;
    case CardType.VOCABULARY:
      formattedCard.card = formatVocab(card.card, card.reviewType);
      break;
    default:
      throw new ApiError('card formatter error', HttpCode.InternalServerError);
    }

    return formattedCard;
  });
  return formattedCards;
}

function formatKanji(card: CardData['card'], reviewType: ReviewType): any {
  let answerOptions: any = null;

  if (reviewType === ReviewType.RECOGNISE) {
    answerOptions = card.answer_options[0].options.map((option: AnswerOption) => {
      return {
        option: option.option,
        correct: option.correct
      };
    });
  } else {
    answerOptions = card.answer_options[0].options.map((option: AnswerOption) => {
      return {
        option: option.japanese,
        correct: option.correct
      };
    });
  }

  return {
    value: card.kanji.kanji,
    keyword: card.answer_options[0].keyword,
    answerOptions
  };
}

function formatKana(card: CardData['card'], reviewType: ReviewType): any {
  let answerOptions: any = null;

  if (reviewType === ReviewType.RECOGNISE) {
    answerOptions = card.answer_options[0].options.map((option: AnswerOption) => {
      return {
        option: option.option,
        correct: option.correct
      };
    });
  } else {
    answerOptions = card.answer_options[0].options.map((option: AnswerOption) => {
      return {
        option: option.japanese,
        correct: option.correct
      };
    });
  }

  return {
    value: card.kana.kana,
    keyword: card.answer_options[0].keyword,
    answerOptions
  };
}


function formatVocab(card: CardData['card'], reviewType: ReviewType): any {
  let answerOptions: any = null;

  if (reviewType === ReviewType.RECOGNISE) {
    answerOptions = card.answer_options[0].options.map((option: AnswerOption) => {
      return {
        option: option.option,
        correct: option.correct
      };
    });
  } else {
    answerOptions = card.answer_options[0].options.map((option: AnswerOption) => {
      return {
        option: option.japanese,
        correct: option.correct
      };
    });
  }

  return {
    value: card.vocabulary.word,
    keyword: card.answer_options[0].keyword,
    answerOptions
  };
}
