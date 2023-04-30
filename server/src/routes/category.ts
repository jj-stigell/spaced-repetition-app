import { Router } from 'express';
import passport from 'passport';

import { categories } from '../controllers/category';
import { requestWrap } from '../util/requestWrap.ts';

export const router: Router = Router();
/**
 * @swagger
 * definitions:
 *   Categories:
 *     type: object
 *     description: >
 *       All available category information.
 *       Includes deck and personalized information (based on role).
 *     properties:
 *       category:
 *         type: string
 *         example: KANJI
 *         description: Category name.
 *         enum: [KANJI, KANA, VOCABULARY, GRAMMAR]
 *       decks:
 *         type: boolean
 *         example: 20
 *         description: Decks available in the category.
 *       progress:
 *         type: object
 *         description: >
 *           User specific progress on the category.
 *           How many new, study and matured decks the category has.
 *           Total value equals to the sum of decks in the category.
 *           Available for roles equal or higher than 'MEMBER'.
 *         properties:
 *           new:
 *             type: integer
 *             example: 5
 *             description: New, not yet studied decks in the category.
 *           learning:
 *             type: integer
 *             example: 5
 *             description: Learning in progress, deck studied at least once.
 *           mature:
 *             type: integer
 *             example: 10
 *             description: Deck studied enough becomes mature after certain review interval.
 */

/**
 * @swagger
 * /api/v1/category:
 *   get:
 *     tags: [Category]
 *     description: >
 *       Get all categories, filter by JLPT level.
 *       If user role is 'MEMBER' or higher, includes category level learning statistics.
 *     parameters:
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
 *         description: Categories found and returned in body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/definitions/Categories'
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
 *         description: No categories found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Failure'
 *     security:
 *       - cookieAuth: []
 */
router.get(
  '/',
  //passport.authenticate('jwt', { session: false }),
  requestWrap(categories)
);
