import { RegisterData } from '../../src/type';

export const REGISTER_URI: string = '/api/v1/auth/register';
export const LOGIN_URI: string = '/api/v1/auth/login';
export const LOGOUT_URI: string = '/api/v1/auth/logout';
export const EMAIL_CONFIRMATION_URI: string = '/api/v1/account/confirmation';
export const RESEND_EMAIL_CONFIRMATION_URI: string = '/api/v1/account/confirmation/resend';
export const REQUEST_RESET_PASSWORD_URI: string = '/api/v1/account/password/reset';
export const RESET_PASSWORD_URI: string = '/api/v1/account/password/reset';
export const CHANGE_PASSWORD_URI: string = '/api/v1/account/password';
export const CHANGE_JLPT_LEVEL_URI: string = '/api/v1/account/jlpt-level';
export const BUGREPORT_URI: string = '/api/v1/bug';
export const CATEGORIES_URI: string = '/api/v1/category';

export const user: RegisterData = {
  email: 'userAccount@test.com',
  username: 'useraccount',
  password: 'TestPassword123',
  acceptTos: true,
  allowNewsLetter: true,
  language: 'EN'
};

export const nonMember: RegisterData = {
  email: 'notMember@test.com',
  username: 'notMemberAcc',
  password: 'TestPassword123',
  acceptTos: true,
  allowNewsLetter: true,
  language: 'EN'
};

export const adminRead: RegisterData = {
  email: 'adminReadAccountt@test.com',
  username: 'adminReader',
  password: 'TestPassword123',
  acceptTos: true,
  allowNewsLetter: true,
  language: 'EN'
};

export const adminWrite: RegisterData = {
  email: 'adminWriteAccountt@test.com',
  username: 'adminWriter',
  password: 'TestPassword123',
  acceptTos: true,
  allowNewsLetter: true,
  language: 'EN'
};

export const superuser: RegisterData = {
  email: 'superUserAccount@test.com',
  username: 'superuser',
  password: 'TestPassword123',
  acceptTos: true,
  allowNewsLetter: true,
  language: 'EN'
};

export const newAccount: RegisterData = {
  email: 'newaccount@test.com',
  username: 'testNewUser',
  password: 'TestPassword123',
  acceptTos: true,
  allowNewsLetter: true,
  language: 'EN'
};
