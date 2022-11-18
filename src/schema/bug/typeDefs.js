const typeDefs = `
enum BugType {
  TRANSLATION
  UI
  FUNCTIONALITY
  OTHER
}

type Bug {
  id: ID
  accountId: Int
  cardId: Int
  type: BugType
  bugMessage: String
  solvedMessage: String
  solved: Boolean
  createdAt: Date
  updatedAt: Date
}

type Query {
  fetchAllBugReports: [Bug!]!

  fetchBugReportById(
    bugId: Int!
  ): Bug!

  fetchBugReportsByType(
    type: BugType! = OTHER
  ): [Bug!]!
}

type Mutation {
  sendBugReport(
    type: BugType! = OTHER
    bugMessage: String!
    cardId: Int
  ): Bug!

  solveBugReport(
    bugId: Int!
    solvedMessage: String
    solved: Boolean
  ): Bug!

  deleteBugReport(
    bugId: Int!
  ): Int!
}`;

module.exports = typeDefs;
