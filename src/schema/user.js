const typeDef = `
  type User {
    id: ID!
    email: String
    username: String
    password: String
  }

  type Query {
    userEmail(username: String!): String!
  }

  type Mutation {
    createUser(
      username: String!
      password: String!
    ): User
  }
`;

const resolvers = {
  Query: {
    userEmail: async (root, { username }) => {
      console.log('userEmail, email is: test@google.fi, username is:', username);
      return 'test@google.fi';
    },
  },
  Mutation: {
    createUser: async (root, { username, password }) => {

      console.log('username for create user is:', username);
      console.log('password for create user is:', password);

      const user = {
        id: 12345,
        email: 'test@google.com',
        username: username,
        password: password
      };

      return user;
    },
  }
};

module.exports = {
  typeDef,
  resolvers
};
