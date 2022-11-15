const typeDefs = `
type Bug {
  id: ID
  accountId: Int
  cardId: Int
  type: String
  bugMessage: String
  solvedMessage: String
  solved: Boolean
}

type Success {
  status: Boolean!
}

type Query {
  fetchAllBugReports: [Bug!]!

  fetchBugReportById(
    bugId: Int!
  ): Bug!
  
  fetchBugReportsByType(
    type: String!
  ): [Bug!]!
}

type Mutation {
  sendBugReport(
    type: String!
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
  ): Success!
}`;

module.exports = typeDefs;
