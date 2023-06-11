/* eslint-disable @typescript-eslint/no-explicit-any */
import { cardErrors } from '../../configs/errorCodes';
import Card from '../../database/models/card';
import { ApiError } from '../../class';
import { AnswerOption, CardType, HttpCode, ReviewType, StudyCard } from '../../type';

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
    }
  }
}

export function cardFormatter(rawCards: Array<CardData>): Array<StudyCard> {

  /*
        {
            deckId: 1,
            cardId: 1,
            active: true,
            learningOrder: 1,
            reviewType: RECALL,
            createdAt: Date,
            updatedAt: Date,
            DeckId: 1,
            card: {
                id: 1,
                type: KANJI,
                languageId: JP,
                active: true,
                createdAt: Date,
                updatedAt: Date,
                answer_options: [
                    {
                        id: 1,
                        cardId: 1,
                        languageId: EN,
                        keyword: Mouth,
                        options: [
                            {
                                option: mouth,
                                correct: true,
                                japanese: 口
                            },
                            {
                                option: teeth,
                                correct: false,
                                japanese: 歯
                            },
                            {
                                option: nose,
                                correct: false,
                                japanese: 鼻
                            },
                            {
                                option: eye,
                                correct: false,
                                japanese: 目
                            }
                        ],
                        createdAt: Date,
                        updatedAt: Date,
                        LanguageId: EN
                    }
                ],
                kanji: {
                    id: 1,
                    cardId: 1,
                    kanji: 口,
                    jlptLevel: 5,
                    onyomi: コウ、 ク,
                    onyomiRomaji: kou, ku,
                    kunyomi: くち,
                    kunyomiRomaji: kuchi,
                    strokeCount: 3,
                    createdAt: Date,
                    updatedAt: Date
                },
                vocabulary: null,
                kana: null
            }
        },
  */

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formattedCards: Array<any> = rawCards.map((card: CardData) => {

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
      break;
    case CardType.VOCABULARY:
      break;
    default:
      break;
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

/*
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
    }
  }
*/



/*
export type StudyCard = {
  id: number;
  learningOrder: number;
  cardType: CardType;
  reviewType: ReviewType;
  card: {
    value: string;
    keyword: string;
    answerOptions: Array<AnswerOption>;
  }
}





        {
            deckId: 1,
            cardId: 1,
            active: true,
            learningOrder: 1,
            reviewType: RECALL,
            createdAt: Date,
            updatedAt: Date,
            DeckId: 1,
            card: {
                id: 1,
                type: KANJI,
                languageId: JP,
                active: true,
                createdAt: Date,
                updatedAt: Date,
                answer_options: [
                    {
                        id: 1,
                        cardId: 1,
                        languageId: EN,
                        keyword: Mouth,
                        options: [
                            {
                                option: mouth,
                                correct: true,
                                japanese: 口
                            },
                            {
                                option: teeth,
                                correct: false,
                                japanese: 歯
                            },
                            {
                                option: nose,
                                correct: false,
                                japanese: 鼻
                            },
                            {
                                option: eye,
                                correct: false,
                                japanese: 目
                            }
                        ],
                        createdAt: Date,
                        updatedAt: Date,
                        LanguageId: EN
                    }
                ],
                kanji: {
                    id: 1,
                    cardId: 1,
                    kanji: 口,
                    jlptLevel: 5,
                    onyomi: コウ、 ク,
                    onyomiRomaji: kou, ku,
                    kunyomi: くち,
                    kunyomiRomaji: kuchi,
                    strokeCount: 3,
                    createdAt: Date,
                    updatedAt: Date
                },
                vocabulary: null,
                kana: null
            }
        },
*/
















