const queries = {
  emailAvailableQuery: `query emailAvailable($email: String!) {
    emailAvailable(email: $email) {
      status
    }
  }`,
};

module.exports = queries;
