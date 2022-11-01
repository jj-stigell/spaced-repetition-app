const { GraphQLError } = require('graphql');
const errors = require('./errors');

const notAuthError = () => {
  throw new GraphQLError('UNAUTHENTICATED', {
    extensions: {
      errorCodes: [errors.notAuthError],
      http: { status: 401 }, // 401 Unauthorized
      code: 'UNAUTHENTICATED'
    },
  });
};

const internalServerError = () => {
  throw new GraphQLError('INTERNAL_SERVER_ERROR', {
    extensions: {
      errorCodes: [errors.internalServerError],
      http: { status: 500 }, // 500 Internal Server Error
      code: 'INTERNAL_SERVER_ERROR'
    },
  });
};

const validationError = (validationErrors) => {
  throw new GraphQLError('VALIDATION_ERROR', {
    extensions: {
      errorCodes: validationErrors,
      http: { status: 400 }, // 400 Bad Request
      code: 'VALIDATION_ERROR'
    },
  });
};

const defaultError = (error) => {
  throw new GraphQLError('DEFAULT_ERROR', {
    extensions: {
      errorCodes: error,
      http: { status: 400 }, // 400 Bad Request
      code: 'DEFAULT_ERROR'
    },
  });
};

module.exports = {
  notAuthError,
  internalServerError,
  validationError,
  defaultError
};
