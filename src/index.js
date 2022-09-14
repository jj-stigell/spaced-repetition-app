
const { ApolloServer } = require('apollo-server');
const { JWT_SECRET, ENVIRONMENT } = require('./util/config');
const { connectToDatabase } = require('./util/database');
const schema = require('./schema');
const jwt = require('jsonwebtoken');
const { Account } = require('./models');

const server = new ApolloServer({
  schema,
  introspection: ENVIRONMENT.DEVELOPMENT,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      );
      const currentUser = await Account.findByPk(decodedToken.id);
      return { currentUser };
    }
  }
});

const start = async () => {
  await connectToDatabase();
  server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
  });
};

start();
