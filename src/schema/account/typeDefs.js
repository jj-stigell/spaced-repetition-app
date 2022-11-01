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

type Error {
  errorCodes: [String!]
}

union LoginPayload = AccountToken | Error
union RegisterResult = Account | Error
union ChangePasswordResult = Success | Error
union emailAvailable = Success | Error

type Query {
  emailAvailable(
    email: String!
  ): emailAvailable!
}

type Mutation {
  createAccount(
    email: String!
    password: String!
    passwordConfirmation: String!
    languageId: String
  ): RegisterResult!

  login(
    email: String!
    password: String!
  ): LoginPayload!

  changePassword(
    currentPassword: String!
    newPassword: String!
    newPasswordConfirmation: String!
  ): ChangePasswordResult!
}`;

module.exports = typeDefs;
