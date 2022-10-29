const queries = {
  emailAvailableQuery: `query emailAvailable($email: String!) {
    emailAvailable(email: $email) {
      ... on Error {
        errorCodes
      }
      ... on Success {
        status
      }
    }
  }`,
};

module.exports = queries;
