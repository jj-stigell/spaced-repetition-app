import { Register } from '../../src/type/request';

export const REGISTER_URI: string = '/api/v1/auth/register';
export const LOGIN_URI: string = '/api/v1/auth/login';
export const LOGOUT_URI: string = '/api/v1/auth/logout';
export const EMAIL_CONFIRMATION_URI: string = '/api/v1/account/confirmation';
export const RESEND_EMAIL_CONFIRMATION_URI: string = '/api/v1/account/confirmation/resend';
export const REQUEST_RESET_PASSWORD_URI: string = '/api/v1/account/password/reset';
export const RESET_PASSWORD_URI: string = '/api/v1/account/password/reset';
export const CHANGE_PASSWORD_URI: string = '/api/v1/account/password';
export const BUGREPORT_URI: string = '/api/v1/bug';

export const user: Register = {
  email: 'userAccount@test.com',
  username: 'useraccount',
  password: 'TestPassword123',
  acceptTos: true,
  allowNewsLetter: true,
  language: 'EN'
};

export const adminRead: Register = {
  email: 'adminReadAccountt@test.com',
  username: 'adminReader',
  password: 'TestPassword123',
  acceptTos: true,
  allowNewsLetter: true,
  language: 'EN'
};

export const adminWrite: Register = {
  email: 'adminWriteAccountt@test.com',
  username: 'adminWriter',
  password: 'TestPassword123',
  acceptTos: true,
  allowNewsLetter: true,
  language: 'EN'
};

export const superuser: Register = {
  email: 'superUserAccount@test.com',
  username: 'superuser',
  password: 'TestPassword123',
  acceptTos: true,
  allowNewsLetter: true,
  language: 'EN'
};

export const newAccount: Register = {
  email: 'newaccount@test.com',
  username: 'testNewUser',
  password: 'TestPassword123',
  acceptTos: true,
  allowNewsLetter: true,
  language: 'EN'
};
