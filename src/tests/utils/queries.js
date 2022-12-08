const queries = {
  emailAvailableQuery: `query emailAvailable($email: String!) {
    emailAvailable(email: $email)
  }`,
  usernameAvailableQuery: `query usernameAvailable($username: String!) {
    usernameAvailable(username: $username)
  }`,
  decks: `query Decks {
    decks {
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
  }`,
  deckSettings: `query DeckSettings($deckId: Int!) {
    deckSettings(deckId: $deckId) {
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
  fetchAllBugReports: `query FetchAllBugReports {
    fetchAllBugReports {
      id
      accountId
      cardId
      type
      bugMessage
      solvedMessage
      solved
      createdAt
      updatedAt
    }
  }`,
  fetchBugReportById: `query FetchAllBugReports($bugId: Int!) {
    fetchBugReportById(bugId: $bugId) {
      id
      accountId
      cardId
      type
      bugMessage
      solvedMessage
      solved
      createdAt
      updatedAt
    }
  }`,
  fetchBugReportsByType: `query FetchBugReportsByType($type: BugType!) {
    fetchBugReportsByType(type: $type) {
      id
      accountId
      cardId
      type
      bugMessage
      solvedMessage
      solved
      createdAt
      updatedAt
    }
  }`,
};

module.exports = queries;
