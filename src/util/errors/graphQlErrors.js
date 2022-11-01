const { GraphQLError } = require('graphql');
const errors = require('./errors');

const notAuthError = () => {
  throw new GraphQLError('NOT AUTHENTICATED', {
    extensions: {
      errorCode: errors.notAuthError,
      http: { status: 401 },
    },
  });
};

const internalServerError = () => {
  throw new GraphQLError('INTERNAL SERVER ERROR', {
    extensions: {
      errorCode: errors.internalServerError,
      http: { status: 500 },
    },
  });
};

module.exports = {
  notAuthError,
  internalServerError
};
