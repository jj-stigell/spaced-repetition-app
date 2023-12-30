// Modules
import path from 'path';

// Project imports
import { FRONTEND_URL } from '../../../configs/environment';
import { sendMail } from './emailClient';
import confirmAccountTranslations from './locales/confirmAccount.json';
import resetPasswordTranslations from './locales/resetPassword.json';
import deleteAccount from './locales/deleteAccount.json';
import { ConfirmEmailPayload, DeleteAccountPayload } from '../../../types';

export async function sendEmailConfirmation(
  language: string, username: string, email: string, confirmationId: string
): Promise<void> {
  let translation: object;
  let subject: string;

  switch (language) {
  case 'FI':
    translation = confirmAccountTranslations['FI'];
    subject = confirmAccountTranslations['FI'].subject;
    break;
  case 'VN':
    translation = confirmAccountTranslations['VN'];
    subject = confirmAccountTranslations['VN'].subject;
    break;
  default:
    translation = confirmAccountTranslations['EN'];
    subject = confirmAccountTranslations['EN'].subject;
    break;
  }

  const templateData: ConfirmEmailPayload = {
    translation,
    email,
    username,
    url: `${FRONTEND_URL}/auth/confirm-email/${confirmationId}`,
  };

  await sendMail<ConfirmEmailPayload>({
    subject,
    templateData,
    templatePath: path.join(__dirname, './templates/confirmAccount.html'),
    to: email
  });
}

export async function sendPasswordResetLink(
  language: string, username: string, email: string, confirmationId: string
): Promise<void> {
  let translation: object;
  let subject: string;

  switch (language) {
  case 'FI':
    translation = resetPasswordTranslations['FI'];
    subject = resetPasswordTranslations['FI'].subject;
    break;
  case 'VN':
    translation = resetPasswordTranslations['VN'];
    subject = resetPasswordTranslations['VN'].subject;
    break;
  default:
    translation = resetPasswordTranslations['EN'];
    subject = resetPasswordTranslations['EN'].subject;
    break;
  }

  const templateData: ConfirmEmailPayload = {
    translation,
    email,
    username: username,
    url: `${FRONTEND_URL}/auth/forgot-password/reset/${confirmationId}`,
  };

  await sendMail<ConfirmEmailPayload>({
    subject,
    templateData,
    templatePath: path.join(__dirname, './templates/resetPassword.html'),
    to: email
  });
}

export async function sendDeletionNotice(
  language: string, username: string, email: string, date: string
): Promise<void> {
  let translation: object;
  let subject: string;

  switch (language) {
  case 'FI':
    translation = deleteAccount['FI'];
    subject = deleteAccount['FI'].subject;
    break;
  case 'VN':
    translation = confirmAccountTranslations['VN'];
    subject = confirmAccountTranslations['VN'].subject;
    break;
  default:
    translation = confirmAccountTranslations['EN'];
    subject = confirmAccountTranslations['EN'].subject;
    break;
  }

  const templateData: DeleteAccountPayload = {
    translation,
    email,
    username,
    date,
    url: `${FRONTEND_URL}/auth/login`,
  };

  await sendMail<DeleteAccountPayload>({
    subject,
    templateData,
    templatePath: path.join(__dirname, './templates/deleteAccount.html'),
    to: email
  });
}
