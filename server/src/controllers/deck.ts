import { Request, Response } from 'express';
import * as yup from 'yup';
import { HttpCode } from '../type';

import { idSchema } from './utils/validator';

/**
 * Get all cards belonging to a deck.
 * @param {Request} req - Express request.
 * @param {Response} res - Express response.
 * @throws {Yup.ValidationError} - If id validation fails.
 * @throws {ApiError} - If deck not found or user not authorixed to access deck.
 */
export async function cardsFromDeck(req: Request, res: Response): Promise<void> {
  const requestSchema: yup.AnyObject = yup.object({
    languageid: yup.string()
      .transform((value: string, originalValue: string) => {
        return originalValue ? originalValue.toUpperCase() : value;
      })
      .oneOf(['EN', 'FI', 'VN'])
      .notRequired()
  });

  const languageid: string | undefined = await requestSchema.validate(
    req.query.languageid, { abortEarly: false }
  );

  const deckId: number = Number(req.params.bugId);
  await idSchema.validate({ id: deckId });

  // Check user is allowed to access deck

  // Check redis cache for cached cards, deckId+langId

  // Check deck exists

  // Check translation available

  // Server correct translation if available to the user

  // Format cards to match client layout

  res.status(HttpCode.Ok).json({
    data: {}
  });
}

// SELECT category, decks FROM study_category WHERE jlpt_level = 1 ORDER BY category ASC;

/*
count finished decks for the user to display progress

{
  category: 'KANJI',
  decks: 10,
  progress: 5
}



decks 10


count deck where category = KANJI and level

SELECT COUNT(*) FROM deck
JOIN account_deck_settings
ON deck.id = account_deck_settings.deck_id deck.category = KANJI AND deck.jlpt_level = 1
AND account_deck_settings.mastered = TRUE;

*/

/**
 * Get all decks based on category and JLPT level.
 * @param {Request} req - Express request.
 * @param {Response} res - Express response.
 * @throws {Yup.ValidationError} - If id validation fails.
 * @throws {ApiError} - If deck not found or user not authorixed to access deck.
 */
export async function decks(req: Request, res: Response): Promise<void> {
  const requestSchema: yup.AnyObject = yup.object({
    languageid: yup.string()
      .transform((value: string, originalValue: string) => {
        return originalValue ? originalValue.toUpperCase() : value;
      })
      .oneOf(['EN', 'FI', 'VN'])
      .notRequired()
  });

  const languageid: string | undefined = await requestSchema.validate(
    req.query.languageid, { abortEarly: false }
  );

  const deckId: number = Number(req.params.bugId);
  await idSchema.validate({ id: deckId });

  // Check user is member, if not provide basic deck info

  // Check redis cache for cached decks, langId

  // Check translation available

  // Server correct translation if available to the user

  // Format cards to match client layout

  res.status(HttpCode.Ok).json({
    data: {}
  });
}