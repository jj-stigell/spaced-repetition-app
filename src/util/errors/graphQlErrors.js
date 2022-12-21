const { GraphQLError } = require('graphql');
const errors = require('./errors');
const errorLogger = require('./errorLogger');

/**
 * Thrown at situations were authentication needed but not provided.
 * @throws {GraphQLError}
 */
const notAuthError = () => {
  errorLogger('not authenticated');
  throw new GraphQLError(errors.graphQlErrors.unauthenticated, {
    extensions: {
      code: errors.graphQlErrors.unauthenticated,
      http: { status: 401 } // 401 Unauthorized
    },
  });
};

/**
 * Error raised if accessing authorized area without authorization.
 * @param {string} error - message included in the authorization error
 * @throws {GraphQLError}
 */
const notAuthorizedError = (error) => {
  errorLogger('not authorized, error(s)', error);
  throw new GraphQLError(errors.graphQlErrors.unauthorized, {
    extensions: {
      code: error,
      http: { status: 401 } // 401 Unauthorized
    },
  });
};

/**
 * Raised during database calls.
 * @param {object} error - error encountered, not returned to the client
 *  @throws {GraphQLError}
 */
const internalServerError = (error) => {
  errorLogger(error);
  throw new GraphQLError(errors.graphQlErrors.internalServerError, {
    extensions: {
      code: errors.graphQlErrors.internalServerError,
      http: { status: 500 } // 500 Internal Server Error
    },
  });
};

/**
 * Extends the graphql own validation with yup.
 * Return all yup error as string array encountered during validation.
 * @param {Array<string>} validationErrors - array of error code strings
 * @throws {GraphQLError}
 */
const validationError = (validationErrors) => {
  errorLogger(validationErrors);
  throw new GraphQLError(errors.graphQlErrors.validationError, {
    extensions: {
      code: validationErrors,
      http: { status: 400 } // 400 Bad Request
    },
  });
};

/**
 * Error for general cases, like email taken, password mismatch etc.
 * @param {string} error - error message
 * @throws {GraphQLError}
 */
const defaultError = (error) => {
  errorLogger(error);
  throw new GraphQLError(errors.graphQlErrors.defaultError, {
    extensions: {
      code: error,
      http: { status: 400 } // 400 Bad Request
    },
  });
};

module.exports = {
  notAuthError,
  notAuthorizedError,
  internalServerError,
  validationError,
  defaultError
};
