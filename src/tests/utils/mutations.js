const mutations = {
  createAccount: `mutation CreateAccount($email: String!, $username: String!, $password: String!, $passwordConfirmation: String!, $languageId: Language!) {
    createAccount(email: $email, username: $username, password: $password, passwordConfirmation: $passwordConfirmation, languageId: $languageId) {
      id
      email
      emailVerified
      username
      languageId
      lastLogin
      createdAt
      updatedAt
    }
  }`,
  login: `mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      session
      account {
        id
        email
        emailVerified
        username
        languageId
        lastLogin
        createdAt
        updatedAt
      }
    }
  }`,
  logout: `mutation Mutation {
    logout
  }`,
  changePassword: `mutation ChangePassword($currentPassword: String!, $newPassword: String!, $newPasswordConfirmation: String!) {
    changePassword(currentPassword: $currentPassword, newPassword: $newPassword, newPasswordConfirmation: $newPasswordConfirmation) {
      id
      email
      emailVerified
      username
      languageId
      lastLogin
      createdAt
      updatedAt
    }
  }`,
  sendBugReport: `mutation SendBugReport($bugMessage: String!, $type: BugType!, $cardId: Int) {
    sendBugReport(bugMessage: $bugMessage, type: $type, cardId: $cardId) {
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
  solveBugReport: `mutation SolveBugReport($bugId: Int!, $solved: Boolean, $solvedMessage: String) {
    solveBugReport(bugId: $bugId, solved: $solved, solvedMessage: $solvedMessage) {
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
  deleteBugReport: `mutation DeleteBugReport($bugId: Int!) {
    deleteBugReport(bugId: $bugId)
  }`,
  changeDeckSettings: `mutation ChangeDeckSettings($deckId: Int!, $newCardsPerDay: Int, $reviewsPerDay: Int, $reviewInterval: Int, $favorite: Boolean) {
    changeDeckSettings(deckId: $deckId, newCardsPerDay: $newCardsPerDay, reviewsPerDay: $reviewsPerDay, reviewInterval: $reviewInterval, favorite: $favorite) {
      id
      accountId
      deckId
      favorite
      dueCards
      reviewInterval
      reviewsPerDay
      newCardsPerDay
      createdAt
      updatedAt
    }
  }`,
  editAccountCard: `mutation EditAccountCard($cardId: Int!, $story: String, $hint: String) {
    editAccountCard(cardId: $cardId, story: $story, hint: $hint) {
      id
      reviewCount
      easyFactor
      accountStory
      accountHint
      dueAt
      mature
      createdAt
      updatedAt
    }
  }`,
  rescheduleCard: `mutation EditAccountCard(
    $cardId: Int!,
    $reviewResult: String!,
    $newInterval: Int!,
    $newEasyFactor: Float!,
    $timing: Int,
    $extraReview: Boolean,
    $date: Date!,
    $reviewType: ReviewType!
    ) {
    rescheduleCard(
      cardId: $cardId,
      reviewResult: $reviewResult,
      newInterval: $newInterval,
      newEasyFactor: $newEasyFactor,
      timing: $timing,
      extraReview: $extraReview,
      date: $date,
      reviewType: $reviewType
      ) {
      id
      reviewCount
      easyFactor
      accountStory
      accountHint
      dueAt
      mature
      createdAt
      updatedAt
    }
  }`,
};

module.exports = mutations;
