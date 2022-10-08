const request = require('supertest');
const { expect, describe, beforeAll, afterAll, it } = require('@jest/globals');
const { JWT_SECRET, ENVIRONMENT} = require('../util/config');
const { connectToDatabase } = require('../util/database');

const { ApolloServer } = require('apollo-server');
const schema = require('../schema');
const jwt = require('jsonwebtoken');
const { Account } = require('../models');

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

const mutations = {
  registerMutation: `mutation createAccount($username: String!, $email: String!, $password: String!, $passwordConfirmation: String!) {
    createAccount(username: $username, email: $email, password: $password, passwordConfirmation: $passwordConfirmation) {
      ... on Error {
        errorCode
      }
      ... on Account {
        email
      }
    }
  }`,
};

describe('Account tests', () => {
  let testServer, testUrl;

  const account = {
    username: 'testing123',
    email: 'testing@test.com',
    password: 'Qwerty1234',
    passwordConfirmation: 'Qwerty1234'
  };

  // before the tests spin up an Apollo Server
  beforeAll(async () => {
    //await rollbackMigration();
    await connectToDatabase();
    const serverInfo = await server.listen({ port: 4000 });
    testServer = serverInfo.server;
    testUrl = serverInfo.url;
  });

  // after the tests stop the server
  afterAll(async () => {
    await testServer?.close();
  });
  
  it('New account created succesfully', async () => {
    // send our request to the url of the test server
    const response = await request(testUrl)
      .post('/')
      .send({query: mutations.registerMutation, variables: account });

    expect(response.errors).toBeUndefined();
    expect(response.body.data.errorCode).toBeUndefined();
    expect(response.body.data?.createAccount.email).toBe(account.email);
    //{ errorCode: 'emailInUseError' }

  });
  
});
