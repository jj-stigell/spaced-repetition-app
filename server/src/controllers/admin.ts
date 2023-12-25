import { Request, Response } from 'express';

import models from '../database/models';
import { HttpCode } from '../type';
import { idSchema } from './utils/validator';
import { findDeckById } from './utils/deck';
import Card from '../database/models/card';
import Kanji from '../database/models/kanji';
import Vocabulary from '../database/models/vocabulary';
import Kana from '../database/models/kana';

/**
 * Get all cards belonging to a deck.
 * @param {Request} req - Express request.
 * @param {Response} res - Express response.
 * @throws {Yup.ValidationError} - If id validation fails.
 * @throws {ApiError} - If deck not found or user not authorixed to access deck.
 */
export async function cardsFromDeck(req: Request, res: Response): Promise<void> {
  const deckId: number = Number(req.params.deckId);
  await idSchema.validate({ id: deckId });

  // Check deck exists and is active.
  await findDeckById(deckId);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cardList: Array<any> = await models.CardList.findAll({
    where: {
      deckId
    },
    include: {
      model: Card,
      required: true,
      include: [
        { model: Kanji },
        { model: Vocabulary },
        { model: Kana }
      ]
    },
    order: [['learningOrder', 'ASC']]
  });

  res.status(HttpCode.Ok).json({
    data: cardList
  });
}

/**
 * Get all decks with all data.
 * @param {Request} req - Express request.
 * @param {Response} res - Express response.
 * @throws {Yup.ValidationError} - If id validation fails.
 * @throws {ApiError} - If deck not found or user not authorixed to access deck.
 */
export async function decks(req: Request, res: Response): Promise<void> {
  res.status(HttpCode.Ok).json({
    data: await models.Deck.findAll()
  });
}
