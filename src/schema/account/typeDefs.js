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

type Query {
  emailAvailable(
    email: String!
  ): Success!
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

  changePassword(
    currentPassword: String!
    newPassword: String!
    newPasswordConfirmation: String!
  ): Success!
}`;

module.exports = typeDefs;
