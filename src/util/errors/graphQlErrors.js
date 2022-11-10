const { GraphQLError } = require('graphql');
const errors = require('./errors');
const errorLogger = require('./errorLogger');

const notAuthError = () => {
  errorLogger('not authenticated');
  throw new GraphQLError(errors.graphQlErrors.unauthenticated, {
    extensions: {
      code: errors.graphQlErrors.unauthenticated,
      http: { status: 401 } // 401 Unauthorized
    },
  });
};

const internalServerError = (error) => {
  errorLogger(error);
  throw new GraphQLError(errors.graphQlErrors.internalServerError, {
    extensions: {
      code: errors.graphQlErrors.internalServerError,
      http: { status: 500 } // 500 Internal Server Error
    },
  });
};

const validationError = (validationErrors) => {
  errorLogger(validationErrors);
  throw new GraphQLError(errors.graphQlErrors.validationError, {
    extensions: {
      code: validationErrors,
      http: { status: 400 } // 400 Bad Request
    },
  });
};

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
  internalServerError,
  validationError,
  defaultError
};
