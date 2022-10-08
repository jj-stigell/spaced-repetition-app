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
    password: 'ThisIsValid123',
    passwordConfirmation: 'ThisIsValid123'
  };

  // before the tests spin up an Apollo Server
  beforeAll(async () => {
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
    const response = await request(testUrl)
      .post('/')
      .send({query: mutations.registerMutation, variables: account });

    expect(response.errors).toBeUndefined();
    expect(response.body.data.errorCode).toBeUndefined();
    expect(response.body.data?.createAccount.email).toBe(account.email);
  });

  it('Error when email already taken', async () => {
    const newAccount = {...account}; 
    const response = await request(testUrl)
      .post('/')
      .send({query: mutations.registerMutation, variables: newAccount });

    console.log(response.body.data);
    expect(response.errors).toBeUndefined();
    expect(response.body.data.createAccount.email).toBeUndefined();
    expect(response.body.data?.createAccount.errorCode).toBe('emailInUseError');
  });

  it('Error when email already taken, uppercase', async () => {
    const newAccount = {...account, email: account.email.toUpperCase()};
    const response = await request(testUrl)
      .post('/')
      .send({query: mutations.registerMutation, variables: newAccount });

    expect(response.errors).toBeUndefined();
    expect(response.body.data.createAccount.email).toBeUndefined();
    expect(response.body.data?.createAccount.errorCode).toBe('emailInUseError');
  });

  it('Error when username already taken', async () => {
    const newAccount = {...account, email: 'emailnottaken@test.com'};
    const response = await request(testUrl)
      .post('/')
      .send({query: mutations.registerMutation, variables: newAccount });
    
    expect(response.errors).toBeUndefined();
    expect(response.body.data.createAccount.email).toBeUndefined();
    expect(response.body.data?.createAccount.errorCode).toBe('usernameInUseError');
  });

  it('Error when username already taken, uppercase', async () => {
    const newAccount = {...account, email: 'emailnottaken@test.com', username: account.username.toUpperCase()};
    const response = await request(testUrl)
      .post('/')
      .send({query: mutations.registerMutation, variables: newAccount });

    expect(response.errors).toBeUndefined();
    expect(response.body.data.createAccount.email).toBeUndefined();
    expect(response.body.data?.createAccount.errorCode).toBe('usernameInUseError');
  });

  it('Error when missing value, username', async () => {
    const newAccount = {...account, username: ''};
    const response = await request(testUrl)
      .post('/')
      .send({query: mutations.registerMutation, variables: newAccount });

    expect(response.errors).toBeUndefined();
    expect(response.body.data.createAccount.email).toBeUndefined();
    expect(response.body.data?.createAccount.errorCode).toBe('inputValueMissingError');
  });

  it('Error when missing value, email', async () => {
    const newAccount = {...account, email: ''};
    const response = await request(testUrl)
      .post('/')
      .send({query: mutations.registerMutation, variables: newAccount });

    expect(response.errors).toBeUndefined();
    expect(response.body.data.createAccount.email).toBeUndefined();
    expect(response.body.data?.createAccount.errorCode).toBe('inputValueMissingError');
  });

  it('Error when missing value, password', async () => {
    const newAccount = {...account, password: ''};
    const response = await request(testUrl)
      .post('/')
      .send({query: mutations.registerMutation, variables: newAccount });

    expect(response.errors).toBeUndefined();
    expect(response.body.data.createAccount.email).toBeUndefined();
    expect(response.body.data?.createAccount.errorCode).toBe('inputValueMissingError');
  });

  it('Error when missing value, password confirmation', async () => {
    const newAccount = {...account, passwordConfirmation: ''};
    const response = await request(testUrl)
      .post('/')
      .send({query: mutations.registerMutation, variables: newAccount });

    expect(response.errors).toBeUndefined();
    expect(response.body.data.createAccount.email).toBeUndefined();
    expect(response.body.data?.createAccount.errorCode).toBe('inputValueMissingError');
  });

  it('Error when password and password confirmation do not match', async () => {
    const newAccount = {...account, password: 'NotMatching456', passwordConfirmation: 'Matching456'};
    const response = await request(testUrl)
      .post('/')
      .send({query: mutations.registerMutation, variables: newAccount });

    expect(response.errors).toBeUndefined();
    expect(response.body.data.createAccount.email).toBeUndefined();
    expect(response.body.data?.createAccount.errorCode).toBe('passwordMismatchError');
  });

  it('Error when password not long enough', async () => {
    const newAccount = {...account, password: '1234Len', passwordConfirmation: '1234Len'};
    const response = await request(testUrl)
      .post('/')
      .send({query: mutations.registerMutation, variables: newAccount });

    expect(response.errors).toBeUndefined();
    expect(response.body.data.createAccount.email).toBeUndefined();
    expect(response.body.data?.createAccount.errorCode).toBe('passwordValidationError');
  });

  it('Error when password does not contain numbers', async () => {
    const newAccount = {...account, password: 'noNumbersInThisOne', passwordConfirmation: 'noNumbersInThisOne'};
    const response = await request(testUrl)
      .post('/')
      .send({query: mutations.registerMutation, variables: newAccount });

    expect(response.errors).toBeUndefined();
    expect(response.body.data.createAccount.email).toBeUndefined();
    expect(response.body.data?.createAccount.errorCode).toBe('passwordValidationError');
  });

  it('Error when password does not contain uppercase', async () => {
    const newAccount = {...account, password: 'thisisnotvalid123', passwordConfirmation: 'thisisnotvalid123'};
    const response = await request(testUrl)
      .post('/')
      .send({query: mutations.registerMutation, variables: newAccount });

    expect(response.errors).toBeUndefined();
    expect(response.body.data.createAccount.email).toBeUndefined();
    expect(response.body.data?.createAccount.errorCode).toBe('passwordValidationError');
  });

  it('Error when password does not contain lowercase', async () => {
    const newAccount = {...account, password: 'THISISNOTVALID123', passwordConfirmation: 'THISISNOTVALID123'};
    const response = await request(testUrl)
      .post('/')
      .send({query: mutations.registerMutation, variables: newAccount });

    expect(response.errors).toBeUndefined();
    expect(response.body.data.createAccount.email).toBeUndefined();
    expect(response.body.data?.createAccount.errorCode).toBe('passwordValidationError');
  });

  it('Error when email not valid', async () => {
    const newAccount = {...account, email: 'emailgoogle.com'};
    const response = await request(testUrl)
      .post('/')
      .send({query: mutations.registerMutation, variables: newAccount });

    expect(response.errors).toBeUndefined();
    expect(response.body.data.createAccount.email).toBeUndefined();
    expect(response.body.data?.createAccount.errorCode).toBe('notEmailError');
  });

  it('Error when username over char limit', async () => {
    const newAccount = {...account, username: 'LenIsMoreThan14'};
    const response = await request(testUrl)
      .post('/')
      .send({query: mutations.registerMutation, variables: newAccount });

    expect(response.errors).toBeUndefined();
    expect(response.body.data.createAccount.email).toBeUndefined();
    expect(response.body.data?.createAccount.errorCode).toBe('usernameValidationError');
  });

  it('Error when username not alphanumeric', async () => {
    const newAccount = {...account, username: 'Len_Is_;OK'};
    const response = await request(testUrl)
      .post('/')
      .send({query: mutations.registerMutation, variables: newAccount });

    expect(response.errors).toBeUndefined();
    expect(response.body.data.createAccount.email).toBeUndefined();
    expect(response.body.data?.createAccount.errorCode).toBe('usernameValidationError');
  });

});
