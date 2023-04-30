import * as dotenv from 'dotenv';
dotenv.config();

// Server environment variables.
const parsedPort: number = Number(process.env.PORT);
export const PORT: number = isNaN(parsedPort) ? 3000 : parsedPort;
export const HOST: string = process.env.HOST ?? 'http://localhost';
export const NODE_ENV: string = process.env.NODE_ENV ?? 'development';

// JWT
export const JWT_SECRET: string = process.env.JWT_SECRET ?? '';

// Email environment variables.
export const EMAIL_ORIGIN: string | undefined = process.env.EMAIL_ORIGIN;
export const STMP_HOST: string | undefined = process.env.STMP_HOST;
export const STMP_PORT: number = parseInt(process.env.STMP_PORT ?? '587', 10);
export const STMP_USER: string | undefined = process.env.STMP_USER;
export const STMP_PASSWORD: string | undefined = process.env.STMP_PASSWORD;

// Frontend
export const FRONTEND_URL: string = process.env.FRONTEND_URL ?? 'http://localhost:3000';

// DEV
export const DEV_EMAIL: string = process.env.DEV_EMAIL ?? '';

if (
  (!EMAIL_ORIGIN || !STMP_HOST || !STMP_PORT || !STMP_USER || !STMP_PASSWORD)
  && NODE_ENV === 'production'
) {
  throw new Error('Production required env(s) missing!');
}
