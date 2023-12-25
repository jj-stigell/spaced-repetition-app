import { Router } from 'express';
import passport from 'passport';

import { requestWrap } from '../util/requestWrap';
import { authorizationMiddleware } from '../middleware/authorizationMiddleware';
import { Role } from '../type';
import { cardsFromDeck, decks } from '../controllers/admin';

export const router: Router = Router();

/**
 * @swagger
 * /api/v1/admin/decks:
 *   get:
 *     tags: [Deck]
 *     description: >
 *       Get all decks, filter by category and JLPT level.
 *       If user role is 'MEMBER' or higher, includes deck level learning statistics.
 *     parameters:
 *       - name: category
 *         in: query
 *         description: Category name.
 *         required: true
 *         schema:
 *           type: string
 *           enum: [KANJI, KANA, VOCABULARY, GRAMMAR]
 *       - name: level
 *         in: query
 *         description: JLPT level.
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *           enum: [1, 2, 3, 4, 5]
 *     responses:
 *       200:
 *         description: Decks found and returned in body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/definitions/Deck'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: The account email is not confirmed.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Failure'
 *       404:
 *         description: No decks found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Failure'
 *     security:
 *       - cookieAuth: []
 */
router.get(
  '/decks',
  passport.authenticate('jwt', { session: false }),
  authorizationMiddleware([Role.SUPERUSER, Role.WRITE_RIGHT, Role.READ_RIGHT]),
  requestWrap(decks)
);

/**
 * @swagger
 * /api/v1/admin/deck/{deckId}/cards:
 *   get:
 *     tags: [Deck]
 *     description: Get cards from deck based on its id (PK).
 *     parameters:
 *       - name: deckId
 *         in: path
 *         description: Id of the deck, of which cards are requested.
 *         required: true
 *         schema:
 *           type: integer
 *       - name: language
 *         in: query
 *         description: Language code in ISO 639-1, if language not available, defaults to EN.
 *         required: false
 *         schema:
 *           type: string
 *           default: EN
 *     responses:
 *       200:
 *         description: Deck found, cards returned in body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/definitions/Card'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: >
 *           The account email is not confirmed or deck is limited
 *           to certain access level (member, non-member, etc.).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Failure'
 *       404:
 *         description: The deck or account not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Failure'
 *     security:
 *       - cookieAuth: []
 */
router.get(
  'decks/:deckId/cards',
  passport.authenticate('jwt', { session: false }),
  requestWrap(cardsFromDeck)
);
