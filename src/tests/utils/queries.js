const queries = {
  emailAvailableQuery: `query emailAvailable($email: String!) {
    emailAvailable(email: $email)
  }`,
  usernameAvailableQuery: `query usernameAvailable($username: String!) {
    usernameAvailable(username: $username)
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
  fetchDeckSettings: `query FecthDeckSettings($deckId: Int!) {
    fecthDeckSettings(deckId: $deckId) {
      id
      accountId
      deckId
      favorite
      reviewInterval
      reviewsPerDay
      newCardsPerDay
      createdAt
      updatedAt
    }
  }`,
};

module.exports = queries;
