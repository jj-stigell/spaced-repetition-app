import { Router } from 'express';
import passport from 'passport';

import {
  createBugReport, deleteBugReport, getBugReportById, getBugReports, updateBugReport
} from '../controllers/bugReport';
import { authorizationMiddleware } from '../middleware/authorizationMiddleware';
import { Role } from '../type/general';
import { requestWrap } from '../util/requestWrap.ts';

export const router: Router = Router();

/**
 * @swagger
 * components:
 *   responses:
 *     BugNotFound:
 *       description: The specified bug report does not exist.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Failure'
 * definitions:
 *   BugReport:
 *     type: object
 *     description: >
 *       Bug report with information describing the encountered bug,
 *       report submitter, adn other metadata.
 *     properties:
 *       id:
 *         type: integer
 *         description: id of the bug report.
 *       accountId:
 *         type: integer
 *         description: id of the bug report submitter.
 *       cardId:
 *         type: integer
 *         description: id of the card that the bug is related.
 *       type:
 *         type: string
 *         description: Bug report type.
 *       bugMessage:
 *         type: string
 *         description: Brief message describing the bug.
 *       solvedMessage:
 *         type: string
 *         description: Brief message describing the actions made to fix the bug.
 *       solved:
 *         type: boolean
 *         description: Is bug report checked by admin and solved.
 *       createdAt:
 *         type: string
 *         description: Submitting date of the bug report.
 *       updatedAt:
 *         type: string
 *         description: Last modified date of the bug report.
 *   CreateBugReport:
 *     type: object
 *     description: >
 *       New bug report with information related to the encountered bug.
 *     properties:
 *       cardId:
 *         type: integer
 *         description: id of the card that the bug is related.
 *         required: false
 *       type:
 *         type: string
 *         description: Bug report type.
 *         required: true
 *       bugMessage:
 *         type: string
 *         description: Brief message describing the bug.
 *         required: true
 *   EditBugReport:
 *     type: object
 *     description: >
 *       Properties to be updated in an existing bug report.
 *     properties:
 *       cardId:
 *         type: integer
 *         description: id of the card that the bug is related.
 *         required: false
 *       type:
 *         type: string
 *         description: Bug report type.
 *         required: false
 *       bugMessage:
 *         type: string
 *         description: Brief message describing the bug.
 *         required: false
 *       solvedMessage:
 *         type: string
 *         description: Brief message describing the actions made to fix the bug.
 *         required: false
 *       solved:
 *         type: boolean
 *         description: Is bug report checked by admin and solved.
 *         required: false
 */

/**
 * @swagger
 * /api/v1/bug:
 *   get:
 *     tags: [Bug]
 *     description: >
 *       Get all bug reports submitted by users. Optional parameters can be used to
 *       filter and limit returned bug reports. Accessible to only administrators and superusers.
 *     parameters:
 *       - name: type
 *         in: query
 *         description: Filter bug reports by type (optional), return all if not defined
 *         required: false
 *         schema:
 *           type: string
 *           enum: [TRANSLATION, UI, FUNCTIONALITY, OTHER]
 *       - name: page
 *         in: query
 *         description: Page number of the results (optional)
 *         required: false
 *         schema:
 *           type: integer
 *           default: 0
 *       - name: limit
 *         in: query
 *         description: Maximum number of results per page (optional)
 *         required: false
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: All bug reports in an array, filter based on type (if provided).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/definitions/BugReport'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *     security:
 *       - cookieAuth: []
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  authorizationMiddleware([Role.SUPERUSER, Role.WRITE_RIGHT, Role.READ_RIGHT]),
  requestWrap(getBugReports)
);

/**
 * @swagger
 * /api/v1/bug/{bugId}:
 *   get:
 *     tags: [Bug]
 *     description: >
 *       Get a single bug report by id. Accessible only to administrators and superusers.
 *     parameters:
 *       - name: bugId
 *         in: path
 *         description: id of the bug report to retrieve.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The requested bug report.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/definitions/BugReport'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/BugNotFound'
 *     security:
 *       - cookieAuth: []
 */
router.get(
  '/:bugId',
  passport.authenticate('jwt', { session: false }),
  authorizationMiddleware([Role.SUPERUSER, Role.WRITE_RIGHT, Role.READ_RIGHT]),
  requestWrap(getBugReportById)
);

/**
 * @swagger
 * /api/v1/bug:
 *   post:
 *     tags: [Bug]
 *     description: >
 *       Create a new bug report. Accessible only to authenticated users.
 *     requestBody:
 *       description: Bug report information.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/CreateBugReport'
 *     responses:
 *       200:
 *         description: The bug report has been created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: Newly created bug report database id.
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/CardNotFound'
 *     security:
 *       - cookieAuth: []
 */
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  requestWrap(createBugReport)
);

/**
 * @swagger
 * /api/v1/bug/{bugId}:
 *   delete:
 *     tags: [Bug]
 *     description: >
 *       Delete bug report with the specified id.
 *       Accessible to only administrators with write rights and superusers.
 *     parameters:
 *       - name: bugId
 *         in: path
 *         required: true
 *         description: id of the bug report to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The bug report with an id has been deleted successfully.
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/BugNotFound'
 *     security:
 *       - cookieAuth: []
 */
router.delete(
  '/:bugId',
  passport.authenticate('jwt', { session: false }),
  authorizationMiddleware([Role.SUPERUSER, Role.WRITE_RIGHT]),
  requestWrap(deleteBugReport)
);

/**
 * @swagger
 * /api/v1/bug/{bugId}:
 *   patch:
 *     tags: [Bug]
 *     description: Edit existing bug report data. For administrator to solve and update bug status.
 *     requestBody:
 *       description: Information to be updated, all optional.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/EditBugReport'
 *     responses:
 *       200:
 *         description: The bug report with an id has been updated succesfully.
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: The specified bug report or card id does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Failure'
 *     security:
 *       - cookieAuth: []
 */
router.patch(
  '/:bugId',
  passport.authenticate('jwt', { session: false }),
  authorizationMiddleware([Role.SUPERUSER, Role.WRITE_RIGHT]),
  requestWrap(updateBugReport)
);
