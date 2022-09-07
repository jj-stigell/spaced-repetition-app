import { ApolloServer } from 'apollo-server-express';
//import { ENVIRONMENT } from '../util/config';

const apolloServer = new ApolloServer({
  // Schema pending...
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  //playground: DEVELOPMENT,
});

export default apolloServer;