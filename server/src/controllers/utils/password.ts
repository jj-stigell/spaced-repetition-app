import argon from 'argon2';
import { PEPPER } from '../../configs/environment';

export async function hashPassword(plaintextPassword: string): Promise<string> {
  return await argon.hash(plaintextPassword + PEPPER);
}

export async function comparePassword(pwdHash: string, plaintextPwd: string): Promise<boolean> {
  return await argon.verify(pwdHash.trim(), plaintextPwd + PEPPER);
}
