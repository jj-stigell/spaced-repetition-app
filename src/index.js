const { connectToDatabase } = require('./database');
const { PORT, NODE_ENV } = require('./util/config');
const server = require('./util/server');

const start = async () => {
  try {
    await connectToDatabase();
    server.listen({ port: PORT }).then(({ url }) => {
      console.log(`Server ready at ${url}, running on ${NODE_ENV}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
