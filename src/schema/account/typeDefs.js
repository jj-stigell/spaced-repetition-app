const typeDefs = `
type Account {
  id: ID!
  email: String
}

type Token {
  value: String!
}

type AccountToken {
  token: Token!
  user: Account!
}

type Success {
  status: Boolean!
}

type Session {
  id: String
  browser: String
  os: String
  device: String
  createdAt: Date
  expireAt: Date
}

type Query {
  emailAvailable(
    email: String!
  ): Success!

  fetchSessions: [Session!]!
}

type Mutation {
  createAccount(
    email: String!
    password: String!
    passwordConfirmation: String!
    languageId: String
  ): Account!

  login(
    email: String!
    password: String!
  ): AccountToken!

  logout: Success!

  deleteSession(
    sessionId: String!
  ): Success!

  changePassword(
    currentPassword: String!
    newPassword: String!
    newPasswordConfirmation: String!
  ): Success!
}`;

module.exports = typeDefs;
