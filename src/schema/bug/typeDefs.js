const typeDefs = `
enum BugType {
  TRANSLATION
  UI
  FUNCTIONALITY
  OTHER
}

type Bug {
  id: Int
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
  bugReports: [Bug!]!

  bugReportById(
    bugId: Int!
  ): Bug!

  bugReportsByType(
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
