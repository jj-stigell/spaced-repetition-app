const { ApolloServer } = require('apollo-server');
const { InMemoryLRUCache } = require('@apollo/utils.keyvaluecache');
const { JWT_SECRET, ENVIRONMENT, PORT } = require('./util/config');
const { connectToDatabase } = require('./util/database');
const schema = require('./schema');
const jwt = require('jsonwebtoken');
const { Account } = require('./models');

const server = new ApolloServer({
  cache: new InMemoryLRUCache(),
  schema,
  introspection: ENVIRONMENT.DEVELOPMENT,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      try {
        const decodedToken = jwt.verify(
          auth.substring(7), JWT_SECRET
        );
        const currentUser = await Account.findByPk(decodedToken.id);
        return { currentUser };
      } catch(error) {
        console.log(error);
      } 
    }
  }
});

const start = async () => {
  try {
    await connectToDatabase();
    server.listen({ port: PORT }).then(({ url }) => {
      console.log(`Server ready at ${url}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
