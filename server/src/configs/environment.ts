import * as dotenv from 'dotenv';
dotenv.config();

/** Server Configuration:
 * - PORT: Parses the server's port number from the environment variables.
 *   Falls back to 3000 if not specified or if the provided value is not a valid number.
 * - HOST: Sets the server host with a default of 'http://localhost'.
 * - NODE_ENV: Sets the environment mode (e.g., test, production) with default of 'development'.
 */
const parsedPort: number = Number(process.env.PORT);
export const PORT: number = isNaN(parsedPort) ? 3000 : parsedPort;
export const HOST: string = process.env.HOST ?? 'http://localhost';
export const NODE_ENV: string = process.env.NODE_ENV ?? 'development';

/** JWT (JSON Web Token) Configuration:
 * Sets the JWT secret key. Uses a different setup for the testing environment
 * to ensure security keys are not exposed or hardcoded in production.
 */
export const JWT_SECRET: string =
NODE_ENV === 'test' ? NODE_ENV : process.env.JWT_SECRET ?? 'development';

/** PEPPER for Hashing:
 * Configures a pepper string for password hashing. Similar to JWT_SECRET,
 * a different setup is used for the testing environment.
 */
export const PEPPER: string = NODE_ENV === 'test' ? NODE_ENV : process.env.PEPPER ?? 'development';

/** Frontend Configuration:
* Defines the base URL for the frontend application.
*/
export const FRONTEND_URL: string = process.env.FRONTEND_URL ?? 'http://localhost:3000';

/** Email Service Configuration:
 * Configures the email service settings including origin and SMTP server details.
 * Ensures that all necessary variables are set for the production environment.
 */
export const EMAIL_ORIGIN: string = process.env.EMAIL_ORIGIN ?? '';
export const STMP_HOST: string | undefined = process.env.STMP_HOST;
export const STMP_PORT: number = parseInt(process.env.STMP_PORT ?? '587', 10);
export const STMP_USER: string | undefined = process.env.STMP_USER;
export const STMP_PASSWORD: string | undefined = process.env.STMP_PASSWORD;

/** Production Environment Check:
 * Validates the presence of essential email environment variables in production.
 * Throws an error if any of these variables are missing.
 */
if (
  (EMAIL_ORIGIN === '' || !STMP_HOST || !STMP_PORT || !STMP_USER || !STMP_PASSWORD)
  && NODE_ENV === 'production'
) {
  throw new Error('Production required env(s) missing!');
}
