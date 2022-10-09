const { expect, describe, beforeAll, afterAll, it } = require('@jest/globals');
const { ApolloServer } = require('apollo-server');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, ENVIRONMENT} = require('../util/config');
const { connectToDatabase } = require('../util/database');
const { Account } = require('../models');
const mutations = require('./mutations');
const schema = require('../schema');

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

describe('Account tests', () => {
  let testServer, testUrl;

  const account = {
    username: 'Testing123',
    email: 'testing@test.com',
    password: 'ThisIsValid123',
    passwordConfirmation: 'ThisIsValid123'
  };

  const passwordData = {
    currentPassword: account.password,
    newPassword: 'ThisIsNewPass123',
    newPasswordConfirmation: 'ThisIsNewPass123'
  };

  const availableEmail = 'emailnottaken@test.com';
  const noNumbersPass = 'noNumbersInThisOne';
  const notLongEnoughPass = '1234Len';
  const tooLongPassword = 'LenIsMoreThan50WhichIsTheCurrentLimitDidUUnderstand';
  const noUpperCasePass = 'thisisnotvalid123';
  const noLowerCasePass = 'THISISNOTVALID123';
  const nonValidEmail = 'emailgoogle.com';
  const nonAlphaNumeric = 'Len_Is_;OK';
  const tooLongUsername = 'LenIsMoreThan14';

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
  

  describe('Registering an account', () => {

    it('New account created succesfully', async () => {
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: account });

      expect(response.errors).toBeUndefined();
      expect(response.body.data.createAccount.errorCode).toBeUndefined();
      expect(response.body.data.createAccount.email).toBeDefined();
      expect(response.body.data.createAccount.email).toBe(account.email);
    });

    it('Error when email already taken', async () => {
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: account });

      expect(response.errors).toBeUndefined();
      expect(response.body.data.createAccount.email).toBeUndefined();
      expect(response.body.data.createAccount.errorCode).toBe('emailInUseError');
    });

    it('Error when email already taken, uppercase', async () => {
      const newAccount = { ...account, email: account.email.toUpperCase() };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.errors).toBeUndefined();
      expect(response.body.data.createAccount.email).toBeUndefined();
      expect(response.body.data.createAccount.errorCode).toBe('emailInUseError');
    });

    it('Error when username already taken', async () => {
      const newAccount = { ...account, email: 'emailnottaken@test.com' };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });
    
      expect(response.errors).toBeUndefined();
      expect(response.body.data.createAccount.email).toBeUndefined();
      expect(response.body.data.createAccount.errorCode).toBe('usernameInUseError');
    });

    it('Error when username already taken, uppercase', async () => {
      const newAccount = {
        ...account,
        email: availableEmail,
        username: account.username.toUpperCase()
      };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.errors).toBeUndefined();
      expect(response.body.data.createAccount.email).toBeUndefined();
      expect(response.body.data.createAccount.errorCode).toBe('usernameInUseError');
    });

    it('Error when username already taken, lowercase', async () => {
      const newAccount = {
        ...account,
        email: availableEmail,
        username: account.username.toLowerCase()
      };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.errors).toBeUndefined();
      expect(response.body.data.createAccount.email).toBeUndefined();
      expect(response.body.data.createAccount.errorCode).toBe('usernameInUseError');
    });

    it('Error when missing value, username', async () => {
      const newAccount = { ...account, username: '' };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.errors).toBeUndefined();
      expect(response.body.data.createAccount.email).toBeUndefined();
      expect(response.body.data.createAccount.errorCode).toBe('inputValueMissingError');
    });

    it('Error when missing value, email', async () => {
      const newAccount = { ...account, email: '' };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.errors).toBeUndefined();
      expect(response.body.data.createAccount.email).toBeUndefined();
      expect(response.body.data.createAccount.errorCode).toBe('inputValueMissingError');
    });

    it('Error when missing value, password', async () => {
      const newAccount = { ...account, password: '' };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.errors).toBeUndefined();
      expect(response.body.data.createAccount.email).toBeUndefined();
      expect(response.body.data.createAccount.errorCode).toBe('inputValueMissingError');
    });

    it('Error when missing value, password confirmation', async () => {
      const newAccount = { ...account, passwordConfirmation: '' };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.errors).toBeUndefined();
      expect(response.body.data.createAccount.email).toBeUndefined();
      expect(response.body.data.createAccount.errorCode).toBe('inputValueMissingError');
    });

    it('Error when password and password confirmation do not match', async () => {
      const newAccount = {
        ...account,
        password: 'NotMatching456',
        passwordConfirmation: 'Matching456'
      };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.errors).toBeUndefined();
      expect(response.body.data.createAccount.email).toBeUndefined();
      expect(response.body.data.createAccount.errorCode).toBe('passwordMismatchError');
    });

    it('Error when password not long enough', async () => {
      const newAccount = {
        ...account,
        password: notLongEnoughPass,
        passwordConfirmation: notLongEnoughPass
      };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.errors).toBeUndefined();
      expect(response.body.data.createAccount.email).toBeUndefined();
      expect(response.body.data.createAccount.errorCode).toBe('passwordValidationError');
    });

    it('Error when password too long', async () => {
      const newAccount = {
        ...account,
        password: tooLongPassword,
        passwordConfirmation: tooLongPassword
      };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.errors).toBeUndefined();
      expect(response.body.data.createAccount.email).toBeUndefined();
      expect(response.body.data.createAccount.errorCode).toBe('passwordValidationError');
    });

    it('Error when password does not contain numbers', async () => {
      const newAccount = {
        ...account,
        password: noNumbersPass,
        passwordConfirmation: noNumbersPass
      };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.errors).toBeUndefined();
      expect(response.body.data.createAccount.email).toBeUndefined();
      expect(response.body.data.createAccount.errorCode).toBe('passwordValidationError');
    });

    it('Error when password does not contain uppercase', async () => {
      const newAccount = {
        ...account,
        password: noUpperCasePass,
        passwordConfirmation: noUpperCasePass
      };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.errors).toBeUndefined();
      expect(response.body.data.createAccount.email).toBeUndefined();
      expect(response.body.data.createAccount.errorCode).toBe('passwordValidationError');
    });

    it('Error when password does not contain lowercase', async () => {
      const newAccount = {
        ...account,
        password: noLowerCasePass,
        passwordConfirmation: noLowerCasePass
      };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.errors).toBeUndefined();
      expect(response.body.data.createAccount.email).toBeUndefined();
      expect(response.body.data.createAccount.errorCode).toBe('passwordValidationError');
    });

    it('Error when email not valid', async () => {
      const newAccount = { ...account, email: nonValidEmail };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.errors).toBeUndefined();
      expect(response.body.data.createAccount.email).toBeUndefined();
      expect(response.body.data.createAccount.errorCode).toBe('notEmailError');
    });

    it('Error when username over char limit', async () => {
      const newAccount = { ...account, username: tooLongUsername };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.errors).toBeUndefined();
      expect(response.body.data.createAccount.email).toBeUndefined();
      expect(response.body.data.createAccount.errorCode).toBe('usernameValidationError');
    });

    it('Error when username not alphanumeric', async () => {
      const newAccount = { ...account, username: nonAlphaNumeric };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.errors).toBeUndefined();
      expect(response.body.data.createAccount.email).toBeUndefined();
      expect(response.body.data.createAccount.errorCode).toBe('usernameValidationError');
    });
  });

  describe('Login to an account', () => {

    it('Login succesfully to an existing account', async () => {
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.loginMutation, variables: account });

      expect(response.errors).toBeUndefined();
      expect(response.body.data.login.errorCode).toBeUndefined();
      expect(response.body.data.login.token).toBeDefined();
      expect(response.body.data.login.user).toBeDefined();
      expect(response.body.data.login.user.email).toBe(account.email);
      expect(response.body.data.login.user.username).toBe(account.username);
    });

    it('Error when missing value, email', async () => {
      const newAccount = { ...account, email: '' };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.loginMutation, variables: newAccount });

      expect(response.errors).toBeUndefined();
      expect(response.body.data.login.errorCode).toBeDefined();
      expect(response.body.data.login.token).toBeUndefined();
      expect(response.body.data.login.user).toBeUndefined();
      expect(response.body.data.login.errorCode).toBe('inputValueMissingError');
    });

    it('Error when missing value, password', async () => {
      const newAccount = { ...account, password: '' };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.loginMutation, variables: newAccount });

      expect(response.errors).toBeUndefined();
      expect(response.body.data.login.errorCode).toBeDefined();
      expect(response.body.data.login.token).toBeUndefined();
      expect(response.body.data.login.user).toBeUndefined();
      expect(response.body.data.login.errorCode).toBe('inputValueMissingError');
    });

    it('Error when email not valid', async () => {
      const newAccount = { ...account, email: 'emailgoogle.com' };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.loginMutation, variables: newAccount });

      expect(response.errors).toBeUndefined();
      expect(response.body.data.login.errorCode).toBeDefined();
      expect(response.body.data.login.token).toBeUndefined();
      expect(response.body.data.login.user).toBeUndefined();
      expect(response.body.data.login.errorCode).toBe('notEmailError');
    });

    it('Error when account not found', async () => {
      const newAccount = { ...account, email: 'nonExistingEmail@test.com' };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.loginMutation, variables: newAccount });

      expect(response.errors).toBeUndefined();
      expect(response.body.data.login.errorCode).toBeDefined();
      expect(response.body.data.login.token).toBeUndefined();
      expect(response.body.data.login.user).toBeUndefined();
      expect(response.body.data.login.errorCode).toBe('userOrPassIncorrectError');
    });

    it('Error when password incorrect', async () => {
      const newAccount = { ...account, password: 'ThisIsNotCorrect' };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.loginMutation, variables: newAccount });

      expect(response.errors).toBeUndefined();
      expect(response.body.data.login.errorCode).toBeDefined();
      expect(response.body.data.login.token).toBeUndefined();
      expect(response.body.data.login.user).toBeUndefined();
      expect(response.body.data.login.errorCode).toBe('userOrPassIncorrectError');
    });
  });

  describe('Changing password', () => {
    let authToken;

    it('Login and change password succesfully', async () => {
      //login and receive token
      let response = await request(testUrl)
        .post('/')
        .send({ query: mutations.loginMutation, variables: account });
      
      expect(response.errors).toBeUndefined();
      expect(response.body.data.login.errorCode).toBeUndefined();
      expect(response.body.data.login.token).toBeDefined();
      expect(response.body.data.login.user).toBeDefined();
      expect(response.body.data.login.user.email).toBe(account.email);
      expect(response.body.data.login.user.username).toBe(account.username);

      authToken = response.body.data.login.token.value;
      //set token as auth header and change password
      response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: mutations.changePasswordMutation, variables: passwordData });

      expect(response.errors).toBeUndefined();
      expect(response.body.data.changePassword.errorCode).toBeUndefined();
      expect(response.body.data.changePassword.status).toBeTruthy();

      //login with new password
      response = await request(testUrl)
        .post('/')
        .send({ query: mutations.loginMutation, variables: {...account, password: passwordData.newPassword} });

      authToken = response.body.data.login.token.value;
      expect(response.errors).toBeUndefined();
      expect(response.body.data.login.errorCode).toBeUndefined();
      expect(response.body.data.login.token).toBeDefined();
      expect(response.body.data.login.user).toBeDefined();
      expect(response.body.data.login.user.email).toBe(account.email);
      expect(response.body.data.login.user.username).toBe(account.username);
    });

    it('Error when no token, not authenticated', async () => {
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.changePasswordMutation, variables: passwordData });

      expect(response.errors).toBeUndefined();
      expect(response.body.data.changePassword.errorCode).toBeDefined();
      expect(response.body.data.changePassword.status).toBeUndefined();
      expect(response.body.data.changePassword.errorCode).toBe('notAuthError');
    });
    
    it('Error when missing value, current password', async () => {
      const data = { ...passwordData, currentPassword: '' };
      const response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: mutations.changePasswordMutation, variables: data });

      expect(response.errors).toBeUndefined();
      expect(response.body.data.changePassword.errorCode).toBeDefined();
      expect(response.body.data.changePassword.status).toBeUndefined();
      expect(response.body.data.changePassword.errorCode).toBe('changePasswordValueMissingError');
    });

    it('Error when missing value, new password', async () => {
      const data = { ...passwordData, newPassword: '' };
      const response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: mutations.changePasswordMutation, variables: data });
      
      expect(response.errors).toBeUndefined();
      expect(response.body.data.changePassword.errorCode).toBeDefined();
      expect(response.body.data.changePassword.status).toBeUndefined();
      expect(response.body.data.changePassword.errorCode).toBe('changePasswordValueMissingError');
    });

    it('Error when missing value, new password confirmation', async () => {
      const data = { ...passwordData, newPasswordConfirmation: '' };
      const response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: mutations.changePasswordMutation, variables: data });

      expect(response.errors).toBeUndefined();
      expect(response.body.data.changePassword.errorCode).toBeDefined();
      expect(response.body.data.changePassword.status).toBeUndefined();
      expect(response.body.data.changePassword.errorCode).toBe('changePasswordValueMissingError');
    });

    it('Error when password and password confirmation do not match', async () => {
      const data = { ...passwordData, newPassword: 'DoesNotMatchWithConfirmation123' };
      const response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: mutations.changePasswordMutation, variables: data });

      expect(response.errors).toBeUndefined();
      expect(response.body.data.changePassword.errorCode).toBeDefined();
      expect(response.body.data.changePassword.status).toBeUndefined();
      expect(response.body.data.changePassword.errorCode).toBe('passwordMismatchError');
    });

    it('Error when new password is same as the old one', async () => {
      const data = {
        ...passwordData,
        newPassword: passwordData.currentPassword,
        newPasswordConfirmation: passwordData.currentPassword
      };
      const response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: mutations.changePasswordMutation, variables: data });

      expect(response.errors).toBeUndefined();
      expect(response.body.data.changePassword.errorCode).toBeDefined();
      expect(response.body.data.changePassword.status).toBeUndefined();
      expect(response.body.data.changePassword.errorCode).toBe('currAndNewPassEqualError');
    });

    it('Error when authorized but current password does not match with DB hash', async () => {
      const response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: mutations.changePasswordMutation, variables: passwordData });

      expect(response.errors).toBeUndefined();
      expect(response.body.data.changePassword.errorCode).toBeDefined();
      expect(response.body.data.changePassword.status).toBeUndefined();
      expect(response.body.data.changePassword.errorCode).toBe('currentPasswordIncorrect');
    });

    it('Error when new password not long enough', async () => {
      const data = {
        ...passwordData,
        newPassword: notLongEnoughPass,
        newPasswordConfirmation: notLongEnoughPass
      };
      const response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: mutations.changePasswordMutation, variables: data });

      expect(response.errors).toBeUndefined();
      expect(response.body.data.changePassword.errorCode).toBeDefined();
      expect(response.body.data.changePassword.status).toBeUndefined();
      expect(response.body.data.changePassword.errorCode).toBe('passwordValidationError');
    });

    it('Error when new password is too long', async () => {
      const data = {
        ...passwordData,
        newPassword: tooLongPassword,
        newPasswordConfirmation: tooLongPassword
      };
      const response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: mutations.changePasswordMutation, variables: data });

      expect(response.errors).toBeUndefined();
      expect(response.body.data.changePassword.errorCode).toBeDefined();
      expect(response.body.data.changePassword.status).toBeUndefined();
      expect(response.body.data.changePassword.errorCode).toBe('passwordValidationError');
    });

    it('Error when new password does not contain numbers', async () => {
      const data = {
        ...passwordData,
        newPassword: noNumbersPass,
        newPasswordConfirmation: noNumbersPass
      };
      const response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: mutations.changePasswordMutation, variables: data });

      expect(response.errors).toBeUndefined();
      expect(response.body.data.changePassword.errorCode).toBeDefined();
      expect(response.body.data.changePassword.status).toBeUndefined();
      expect(response.body.data.changePassword.errorCode).toBe('passwordValidationError');
    });

    it('Error when new password does not contain uppercase', async () => {
      const data = {
        ...passwordData,
        newPassword: noUpperCasePass,
        newPasswordConfirmation: noUpperCasePass
      };
      const response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: mutations.changePasswordMutation, variables: data });

      expect(response.errors).toBeUndefined();
      expect(response.body.data.changePassword.errorCode).toBeDefined();
      expect(response.body.data.changePassword.status).toBeUndefined();
      expect(response.body.data.changePassword.errorCode).toBe('passwordValidationError');
    });

    it('Error when new password does not contain lowercase', async () => {
      const data = {
        ...passwordData,
        newPassword: noLowerCasePass,
        newPasswordConfirmation: noLowerCasePass
      };
      const response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: mutations.changePasswordMutation, variables: data });

      expect(response.errors).toBeUndefined();
      expect(response.body.data.changePassword.errorCode).toBeDefined();
      expect(response.body.data.changePassword.status).toBeUndefined();
      expect(response.body.data.changePassword.errorCode).toBe('passwordValidationError');
    });
  });

});
