// Modules
import cookieParser from 'cookie-parser';
import { Router } from 'express';
import swaggerJsdoc, { OAS3Options } from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';

// Project imports
import { definition } from '../configs/swagger';
import { NODE_ENV } from '../configs/environment';

// Routes
import { router as authRouter } from './auth';
import { router as accountRouter } from './account';
import { router as bugReportRouter } from './bugReport';

const options: OAS3Options = {
  definition,
  apis: ['./src/routes/*.ts'],
};

const openapiSpecification: object = swaggerJsdoc(options);

export const router: Router = Router();

router.use(cookieParser());
router.use('/auth/', authRouter);
router.use('/account/', accountRouter);
router.use('/bug/', bugReportRouter);

if (NODE_ENV !== 'production') {
  router.use('/api-docs', swaggerUI.serve);
  router.get('/api-docs', swaggerUI.setup(openapiSpecification));
}

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     jwtCookie:
 *       type: apiKey
 *       in: cookie
 *       name: jwt
 *   responses:
 *     UnauthorizedError:
 *       description: Authentication credentials were missing or jwt expired.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Failure'
 *     ForbiddenError:
 *       description: >
 *         Insufficient rights (non-admin or not logged in depending on path)
 *         to a resource or operation.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Failure'
 *     ValidationError:
 *       description: Validation of query, url, or request body params failed.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Failure'
 *     CardNotFound:
 *       description: The specified card does not exist.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Failure'
 * definitions:
 *   Failure:
 *     type: object
 *     description: A reason for the failure, with a error code.
 *     properties:
 *       success:
 *         type: boolean
 *         description: '`false` to indicate failure.'
 *         example: false
 *       errors:
 *         type: array
 *         description: Array of error codes explaining error reason.
 *         items:
 *           type: string
 *   GenericResponse:
 *     type: object
 *     properties:
 *       success:
 *         type: boolean
 *         description: Success of the request.
 *       data:
 *         type: object
 */