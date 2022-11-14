const typeDefs = `
type Bug {
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
  fetchAllBugs: [Bug!]!

  fetchBugById(
    bugId: Int!
  ): Bug!
  
  fetchBugsByType(
    type: String!
  ): [Bug!]!
}

type Mutation {
  sendBugMessage(
    type: String!
    bugMessage: String!
  ): Success!

  solveBugMessage(
    bugId: Int!
    solvedMessage: String
    solved: Boolean
  ): Bug!
}`;

module.exports = typeDefs;
