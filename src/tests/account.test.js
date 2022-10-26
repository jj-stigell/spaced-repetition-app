const { expect, describe, beforeAll, afterAll, it } = require('@jest/globals');
const { ApolloServer } = require('apollo-server');
const { InMemoryLRUCache } = require('@apollo/utils.keyvaluecache');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, ENVIRONMENT, PORT } = require('../util/config');
const { connectToDatabase } = require('../util/database');
const { account, passwordData, stringData } = require('./constants'); 
const { Account } = require('../models');
const mutations = require('./mutations');
const errors = require('../util/errors');
const schema = require('../schema');

/*
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
*/


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

describe('Account tests', () => {
  let testServer, testUrl;
  // before the tests spin up an Apollo Server
  beforeAll(async () => {
    await connectToDatabase();
    const serverInfo = await server.listen({ port: PORT });
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

      expect(response.body.data.createAccount.errorCodes).toBeUndefined();
      expect(response.body.data.createAccount.email).toBeDefined();
      expect(response.body.data.createAccount.email).toBe(account.email);
    });

    it('Error when email already taken', async () => {
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: account });

      expect(response.body.data.createAccount.email).toBeUndefined();
      expect(response.body.data.createAccount.errorCodes).toContain(errors.emailInUseError);
    });

    it('Error when email already taken, uppercase', async () => {
      const newAccount = { ...account, email: account.email.toUpperCase() };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.body.data.createAccount.email).toBeUndefined();
      expect(response.body.data.createAccount.errorCodes).toContain(errors.emailInUseError);
    });

    it('Error when email not valid', async () => {
      const newAccount = { ...account, email: stringData.nonValidEmail };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.body.data.createAccount.email).toBeUndefined();
      expect(response.body.data.createAccount.errorCodes).toContain(errors.notEmailError);
    });

    it('Error when missing value, email', async () => {
      const newAccount = { ...account, email: '' };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.body.data.createAccount.email).toBeUndefined();
      expect(response.body.data.createAccount.errorCodes).toContain(errors.requiredEmailError);
    });

    it('Error when missing value, password', async () => {
      const newAccount = { ...account, password: '' };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.body.data.createAccount.email).toBeUndefined();
      expect(response.body.data.createAccount.errorCodes).toContain(errors.passwordMismatchError);
      expect(response.body.data.createAccount.errorCodes).toContain(errors.passwordMinLengthError);
      expect(response.body.data.createAccount.errorCodes).toContain(errors.requiredPasswordError);
    });

    it('Error when missing value, password confirmation', async () => {
      const newAccount = { ...account, passwordConfirmation: '' };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.body.data.createAccount.email).toBeUndefined();
      expect(response.body.data.createAccount.errorCodes).toContain(errors.requiredPasswordConfirmError);
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

      expect(response.body.data.createAccount.email).toBeUndefined();
      expect(response.body.data.createAccount.errorCodes).toContain(errors.passwordMismatchError);
    });

    it('Error when password not long enough', async () => {
      const newAccount = {
        ...account,
        password: stringData.notLongEnoughPass,
        passwordConfirmation: stringData.notLongEnoughPass
      };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.body.data.createAccount.email).toBeUndefined();
      expect(response.body.data.createAccount.errorCodes).toContain(errors.passwordMinLengthError);
    });

    it('Error when password too long', async () => {
      const newAccount = {
        ...account,
        password: stringData.tooLongPassword,
        passwordConfirmation: stringData.tooLongPassword
      };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.body.data.createAccount.email).toBeUndefined();
      expect(response.body.data.createAccount.errorCodes).toContain(errors.passwordMaxLengthError);
    });

    it('Error when password does not contain numbers', async () => {
      const newAccount = {
        ...account,
        password: stringData.noNumbersPass,
        passwordConfirmation: stringData.noNumbersPass
      };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.body.data.createAccount.email).toBeUndefined();
      expect(response.body.data.createAccount.errorCodes).toContain(errors.passwordNumberError);
    });

    it('Error when password does not contain uppercase', async () => {
      const newAccount = {
        ...account,
        password: stringData.noUpperCasePass,
        passwordConfirmation: stringData.noUpperCasePass
      };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.body.data.createAccount.email).toBeUndefined();
      expect(response.body.data.createAccount.errorCodes).toContain(errors.passwordUppercaseError);
    });

    it('Error when password does not contain lowercase', async () => {
      const newAccount = {
        ...account,
        password: stringData.noLowerCasePass,
        passwordConfirmation: stringData.noLowerCasePass
      };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.body.data.createAccount.email).toBeUndefined();
      expect(response.body.data.createAccount.errorCodes).toContain(errors.passwordLowercaseError);
    });

    it('Error when language id invalid', async () => {
      const newAccount = {
        ...account,
        languageId: stringData.notAvailableLanguage
      };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.registerMutation, variables: newAccount });

      expect(response.body.data.createAccount.email).toBeUndefined();
      expect(response.body.data.createAccount.errorCodes).toContain(errors.invalidLanguageIdError);
    });
  });

  describe('Login to an account', () => {

    it('Login succesfully to an existing account', async () => {
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.loginMutation, variables: account });

      expect(response.body.data.login.errorCodes).toBeUndefined();
      expect(response.body.data.login.token).toBeDefined();
      expect(response.body.data.login.user).toBeDefined();
      expect(response.body.data.login.user.email).toBe(account.email);
    });

    it('Error when missing value, email', async () => {
      const newAccount = { ...account, email: '' };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.loginMutation, variables: newAccount });

      expect(response.body.data.login.token).toBeUndefined();
      expect(response.body.data.login.user).toBeUndefined();
      expect(response.body.data.login.errorCodes).toContain(errors.requiredEmailError);
    });

    it('Error when missing value, password', async () => {
      const newAccount = { ...account, password: '' };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.loginMutation, variables: newAccount });

      expect(response.body.data.login.token).toBeUndefined();
      expect(response.body.data.login.user).toBeUndefined();
      expect(response.body.data.login.errorCodes).toContain(errors.requiredPasswordError);
    });

    it('Error when email not valid', async () => {
      const newAccount = { ...account, email: stringData.nonValidEmail };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.loginMutation, variables: newAccount });

      expect(response.body.data.login.token).toBeUndefined();
      expect(response.body.data.login.user).toBeUndefined();
      expect(response.body.data.login.errorCodes).toContain(errors.notEmailError);
    });

    it('Error when account not found', async () => {
      const newAccount = { ...account, email: stringData.nonExistingEmail };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.loginMutation, variables: newAccount });

      expect(response.body.data.login.token).toBeUndefined();
      expect(response.body.data.login.user).toBeUndefined();
      expect(response.body.data.login.errorCodes).toContain(errors.userOrPassIncorrectError);
    });

    it('Error when password incorrect', async () => {
      const newAccount = { ...account, password: stringData.incorrectPassword };
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.loginMutation, variables: newAccount });

      expect(response.body.data.login.token).toBeUndefined();
      expect(response.body.data.login.user).toBeUndefined();
      expect(response.body.data.login.errorCodes).toContain(errors.userOrPassIncorrectError);
    });
  });

  describe('Changing password', () => {
    let authToken;

    it('Change password and login with new password succesfully', async () => {
      //login and receive token
      let response = await request(testUrl)
        .post('/')
        .send({ query: mutations.loginMutation, variables: account });
      
      expect(response.body.data.login.errorCodes).toBeUndefined();
      expect(response.body.data.login.token).toBeDefined();
      expect(response.body.data.login.user).toBeDefined();
      expect(response.body.data.login.user.email).toBe(account.email);

      authToken = response.body.data.login.token.value;
      //set token as auth header and change password
      response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: mutations.changePasswordMutation, variables: passwordData });

      expect(response.body.data.changePassword.errorCodes).toBeUndefined();
      expect(response.body.data.changePassword.status).toBeTruthy();

      //login with new password
      response = await request(testUrl)
        .post('/')
        .send({ query: mutations.loginMutation, variables: {...account, password: passwordData.newPassword} });

      authToken = response.body.data.login.token.value;
      expect(response.body.data.login.errorCode).toBeUndefined();
      expect(response.body.data.login.token).toBeDefined();
      expect(response.body.data.login.user).toBeDefined();
      expect(response.body.data.login.user.email).toBe(account.email);
    });

    it('Error when no token, not authenticated', async () => {
      const response = await request(testUrl)
        .post('/')
        .send({ query: mutations.changePasswordMutation, variables: passwordData });

      expect(response.body.data.changePassword.status).toBeUndefined();
      expect(response.body.data.changePassword.errorCodes).toContain(errors.notAuthError);
    });
    
    it('Error when missing value, current password', async () => {
      const data = { ...passwordData, currentPassword: '' };
      const response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: mutations.changePasswordMutation, variables: data });

      expect(response.body.data.changePassword.status).toBeUndefined();
      expect(response.body.data.changePassword.errorCodes).toContain(errors.requiredPasswordError);
    });

    it('Error when missing value, new password', async () => {
      const data = { ...passwordData, newPassword: '' };
      const response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: mutations.changePasswordMutation, variables: data });
      
      expect(response.body.data.changePassword.status).toBeUndefined();
      expect(response.body.data.changePassword.errorCodes).toContain(errors.requiredPasswordError);
    });

    it('Error when missing value, new password confirmation', async () => {
      const data = { ...passwordData, newPasswordConfirmation: '' };
      const response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: mutations.changePasswordMutation, variables: data });

      expect(response.body.data.changePassword.status).toBeUndefined();
      expect(response.body.data.changePassword.errorCodes).toContain(errors.requiredPasswordConfirmError);
    });

    it('Error when password and password confirmation do not match', async () => {
      const data = { ...passwordData, newPassword: stringData.incorrectPassword };
      const response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: mutations.changePasswordMutation, variables: data });

      expect(response.body.data.changePassword.status).toBeUndefined();
      expect(response.body.data.changePassword.errorCodes).toContain(errors.passwordMismatchError);
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

      expect(response.body.data.changePassword.status).toBeUndefined();
      expect(response.body.data.changePassword.errorCodes).toContain(errors.currAndNewPassEqualError);
    });

    it('Error when authorized but current password does not match with DB hash', async () => {
      const response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: mutations.changePasswordMutation, variables: passwordData });

      expect(response.body.data.changePassword.status).toBeUndefined();
      expect(response.body.data.changePassword.errorCodes).toContain(errors.currentPasswordIncorrect);
    });

    it('Error when new password not long enough', async () => {
      const data = {
        ...passwordData,
        newPassword: stringData.notLongEnoughPass,
        newPasswordConfirmation: stringData.notLongEnoughPass
      };
      const response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: mutations.changePasswordMutation, variables: data });

      expect(response.body.data.changePassword.status).toBeUndefined();
      expect(response.body.data.changePassword.errorCodes).toContain(errors.passwordMinLengthError);
    });

    it('Error when new password is too long', async () => {
      const data = {
        ...passwordData,
        newPassword: stringData.tooLongPassword,
        newPasswordConfirmation: stringData.tooLongPassword
      };
      const response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: mutations.changePasswordMutation, variables: data });

      expect(response.body.data.changePassword.status).toBeUndefined();
      expect(response.body.data.changePassword.errorCodes).toContain(errors.passwordMaxLengthError);
    });

    it('Error when new password does not contain numbers', async () => {
      const data = {
        ...passwordData,
        newPassword: stringData.noNumbersPass,
        newPasswordConfirmation: stringData.noNumbersPass
      };
      const response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: mutations.changePasswordMutation, variables: data });

      expect(response.body.data.changePassword.status).toBeUndefined();
      expect(response.body.data.changePassword.errorCodes).toContain(errors.passwordNumberError);
    });

    it('Error when new password does not contain uppercase', async () => {
      const data = {
        ...passwordData,
        newPassword: stringData.noUpperCasePass,
        newPasswordConfirmation: stringData.noUpperCasePass
      };
      const response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: mutations.changePasswordMutation, variables: data });

      expect(response.body.data.changePassword.status).toBeUndefined();
      expect(response.body.data.changePassword.errorCodes).toContain(errors.passwordUppercaseError);
    });

    it('Error when new password does not contain lowercase', async () => {
      const data = {
        ...passwordData,
        newPassword: stringData.noLowerCasePass,
        newPasswordConfirmation: stringData.noLowerCasePass
      };
      const response = await request(testUrl)
        .post('/')
        .set('Authorization', `bearer ${authToken}`)
        .send({ query: mutations.changePasswordMutation, variables: data });

      expect(response.body.data.changePassword.status).toBeUndefined();
      expect(response.body.data.changePassword.errorCodes).toContain(errors.passwordLowercaseError);
    });
  });
});
