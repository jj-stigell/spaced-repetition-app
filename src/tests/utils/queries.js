const queries = {
  emailAvailableQuery: `query emailAvailable($email: String!) {
    emailAvailable(email: $email) {
      status
    }
  }`,
  fetchDecksQuery: `query FetchDecks {
    fetchDecks {
      Decks {
        id
        deckName
        type
        subscriberOnly
        languageId
        active
        createdAt
        updatedAt
        deck_translations {
          id
          languageId
          title
          description
          active
          createdAt
          updatedAt
        }
      }
    }
  }`,
};

module.exports = queries;
