import { Router } from 'express';
import passport from 'passport';

import { decks, cardsFromDeck } from '../controllers/deck';
import { requestWrap } from '../util/requestWrap';

export const router: Router = Router();
/**
 * @swagger
 * definitions:
 *   Deck:
 *     type: object
 *     description: >
 *       Deck and personalized information (based on role).
 *     properties:
 *       id:
 *         type: integer
 *         example: 136
 *         description: Deck id.
 *       memberOnly:
 *         type: boolean
 *         example: true
 *         description: Is the deck available only to members.
 *       name:
 *         type: string
 *         example: Kanji Deck 1
 *         description: Deck name, localized.
 *       description:
 *         type: string
 *         example: First 20 Kanji for JLPT N5
 *         description: Deck description, localized.
 *       cards:
 *         type: integer
 *         example: 21
 *         description: Total amount of cards in deck.
 *       favorite:
 *         type: boolean
 *         example: true
 *         description: Is the deck marked as favorite by the user.
 *       progress:
 *         type: object
 *         description: >
 *           User specific progress on the deck. How many new, study and matured cards the deck has.
 *           Total value equals to the sum of cards in the deck.
 *           Available for roles equal or higher than 'MEMBER'.
 *         properties:
 *           new:
 *             type: integer
 *             example: 5
 *             description: New, not yet studied cards in the deck.
 *           learning:
 *             type: integer
 *             example: 7
 *             description: Learning in progress, studied at least once.
 *           mature:
 *             type: integer
 *             example: 9
 *             description: Cards studied enough become mature after certain review interval.
 *   Card:
 *     type: object
 *     description: >
 *       Card data.
 *     properties:
 *       id:
 *         type: integer
 *         example: 136
 *         description: Card id.
 *       learningOrder:
 *         type: integer
 *         example: 1
 *         description: Order of learning for the card, deck specific.
 *       reviewType:
 *         type: string
 *         enum: [RECOGNISE, RECALL]
 *         example: RECALL
 *         description: What way the card is studied.
 *       cardType:
 *         type: string
 *         enum: [KANJI, KANA, VOCABULARY, SENTENCE, GRAMMAR]
 *         example: KANJI
 *         description: Type of the card.
 */

/**
 * @swagger
 * /api/v1/deck:
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
  '/',
  passport.authenticate('jwt', { session: false }),
  requestWrap(decks)
);

/**
 * @swagger
 * /api/v1/deck/{deckId}/cards:
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
  '/:deckId/cards',
  passport.authenticate('jwt', { session: false }),
  requestWrap(cardsFromDeck)
);
