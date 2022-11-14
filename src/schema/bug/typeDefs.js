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
    cardId: Int
  ): Bug!

  solveBugMessage(
    bugId: Int!
    solvedMessage: String
    solved: Boolean
  ): Bug!
}`;

module.exports = typeDefs;
