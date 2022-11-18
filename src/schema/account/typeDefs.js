const typeDefs = `
enum Language {
  EN
  FI
  JP
  VN
}

type Account {
  id: ID
  email: String
  emailVerified: Boolean
  username: String
  languageId: Language
  lastLogin: Date
  createdAt: Date
  updatedAt: Date
}

type Token {
  value: ID!
}

type AccountToken {
  token: Token!
  account: Account!
}

type Session {
  id: ID
  browser: String
  os: String
  device: String
  createdAt: Date
  expireAt: Date
}

type Query {
  emailAvailable(
    email: String!
  ): Boolean!

  usernameAvailable(
    username: String!
  ): Boolean!

  fetchSessions: [Session!]!
}

type Mutation {
  createAccount(
    email: String!
    username: String!
    password: String!
    passwordConfirmation: String!
    languageId: Language! = EN
  ): Account!

  login(
    email: String!
    password: String!
  ): AccountToken!

  logout: String!

  deleteSession(
    sessionId: String!
  ): String!

  changePassword(
    currentPassword: String!
    newPassword: String!
    newPasswordConfirmation: String!
  ): Account!
}`;

module.exports = typeDefs;
