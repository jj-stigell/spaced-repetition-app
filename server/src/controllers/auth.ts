import argon from 'argon2';
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as JWTStrategy, VerifiedCallback } from 'passport-jwt';
import { IVerifyOptions, Strategy as LocalStrategy } from 'passport-local';
import { QueryTypes, Transaction } from 'sequelize';
import * as yup from 'yup';

import { account as accountConstants, regex } from '../configs/constants';
import { JWT_SECRET, NODE_ENV } from '../configs/environment';
import { sequelize } from '../database';
import models from '../database/models';
import Account from '../database/models/account';
import UserAction from '../database/models/accountAction';
import { accountErrors, validationErrors } from '../configs/errorCodes';
import { ApiError, InvalidCredentials } from '../class';
import { sendEmailConfirmation } from './utils/mailer';
import UAParser, { IResult } from 'ua-parser-js';
import Session from '../database/models/session';
import { findAccountByEmail } from './utils/account';
import { RegisterData, HttpCode, Role, LoginResult } from '../type';

/**
 * Registers a new user account with the provided email, username, password, and other fields.
 * The function validates the request body, checks if the user has accepted the terms of service.
 * Verifies that the email and username are not already taken before creating a new entry in the db.
 * If the registration is successful, an email confirmation is sent to the provided email.
 * @param {Request} req - Express request.
 * @param {Response} res - Express response.
 * @throws {ApiError} - If there is an error during the registration process,
 * the function throws an ApiError with the corresponding HTTP status code.
*/
export async function register(req: Request, res: Response): Promise<void> {
  const requestSchema: yup.ObjectSchema<RegisterData> = yup.object({
    email: yup.string()
      .email(validationErrors.ERR_NOT_VALID_EMAIL)
      .max(accountConstants.EMAIL_MAX_LENGTH, validationErrors.ERR_EMAIL_TOO_LONG)
      .typeError(validationErrors.ERR_INPUT_TYPE)
      .required(validationErrors.ERR_EMAIL_REQUIRED),
    username: yup.string()
      .max(accountConstants.USERNAME_MAX_LENGTH, validationErrors.ERR_USERNAME_TOO_LONG)
      .min(accountConstants.USERNAME_MIN_LENGTH, validationErrors.ERR_USERNAME_TOO_SHORT)
      .typeError(validationErrors.ERR_INPUT_TYPE)
      .required(validationErrors.ERR_USERNAME_REQUIRED),
    password: yup.string()
      .max(accountConstants.PASSWORD_MAX_LENGTH, validationErrors.ERR_PASSWORD_TOO_LONG)
      .min(accountConstants.PASSWORD_MIN_LENGTH, validationErrors.ERR_PASSWORD_TOO_SHORT)
      .matches(regex.LOWERCASE_REGEX, validationErrors.ERR_PASSWORD_LOWERCASE)
      .matches(regex.UPPERCASE_REGEX, validationErrors.ERR_PASSWORD_UPPERCASE)
      .matches(regex.NUMBER_REGEX, validationErrors.ERR_PASSWORD_NUMBER)
      .typeError(validationErrors.ERR_INPUT_TYPE)
      .required(validationErrors.ERR_PASSWORD_REQUIRED),
    acceptTos: yup.boolean()
      .typeError(validationErrors.ERR_INPUT_TYPE)
      .required(validationErrors.ERR_ACCEPT_TOS_REQUIRED),
    allowNewsLetter: yup.boolean()
      .typeError(validationErrors.ERR_INPUT_TYPE)
      .notRequired(),
    language: yup.string()
      .oneOf(['EN', 'FI'])
      .typeError(validationErrors.ERR_INPUT_TYPE)
      .required()
  });

  // DELETE WHEN MVP READY
  if (NODE_ENV === 'production') {
    throw new ApiError('reg not allowed for now', HttpCode.Forbidden);
  }

  await requestSchema.validate(req.body, { abortEarly: false });
  const {
    email, username, password, acceptTos, allowNewsLetter, language
  }: RegisterData = req.body;

  if (!acceptTos) {
    throw new ApiError(validationErrors.ERR_TOS_NOT_ACCEPTED, HttpCode.BadRequest);
  }

  const takenAccount: Array<Account> = await sequelize.query(
    'SELECT * FROM account WHERE email = :email OR username = :username',
    {
      replacements: {
        email,
        username
      },
      type: QueryTypes.SELECT
    }
  ) as Array<object> as Array<Account>;

  if (takenAccount.length > 0) {
    if (takenAccount[0].email === email) {
      throw new ApiError(accountErrors.ERR_EMAIL_IN_USE, HttpCode.Conflict);
    } else {
      throw new ApiError(accountErrors.ERR_USERNAME_IN_USE, HttpCode.Conflict);
    }
  }

  await sequelize.transaction(async (t: Transaction) => {
    const newAccount: Account = await models.Account.create({
      email,
      username,
      password: await argon.hash(password.trim()),
      allowNewsLetter: allowNewsLetter ?? false,
      tosAccepted: acceptTos,
      languageId: language.toUpperCase(),
      role: Role.MEMBER
    }, { transaction: t });

    const confirmation: UserAction = await models.AccountAction.create({
      accountId: newAccount.id,
      type: 'CONFIRM_EMAIL',
      expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    }, { transaction: t });

    if (NODE_ENV !== 'test') {
      await sendEmailConfirmation(
        language, newAccount.username, newAccount.email, confirmation.id
      );
    }
  });

  res.status(HttpCode.Ok).json();
}

/**
 * Login to an existing account.
 * @param {Request} req - Express request.
 * @param {Response} res - Express response.
 * @throws {ApiError} - If email or password are incorrect, email is not verified,
 * or validation fails, function throws an error with a relevant error code.
 */
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  passport.authenticate(
    'login',
    async (err: unknown, loginResult: LoginResult | boolean) => {
      if (err) {
        return next(err);
      }
      if (typeof loginResult === 'boolean') {
        return res.status(HttpCode.Unauthorized).json({
          errors: [
            {
              code: accountErrors.ERR_EMAIL_OR_PASSWORD_INCORRECT
            }
          ]
        });
      }

      req.login(
        loginResult,
        { session: false },
        async (error: unknown) => {
          if (error) {
            return next(error);
          }

          const payload: JwtPayload = {
            id: loginResult.id,
            sessionId: loginResult.sessionId
          };
          const token: string = jwt.sign(payload, JWT_SECRET, {
            expiresIn: accountConstants.JWT_EXPIRY_TIME,
          });
          res.cookie('jwt', token, {
            httpOnly: true,
            secure: NODE_ENV !== 'test',
            sameSite: 'none',
            maxAge: accountConstants.JWT_EXPIRY_TIME,
          });
          return res.status(HttpCode.Ok).json({
            data: {
              username: loginResult.username,
              email: loginResult.email,
              role: loginResult.role,
              allowNewsLetter: loginResult.allowNewsLetter,
              language: loginResult.language,
              jlptLevel: loginResult.jlptLevel
            }
          });
        }
      );
    }
  )(req, res, next);
}

/**
 * Logout from existing session by removing jwt from cookies and deactivating session.
 * @param {Request} _req - Express request.
 * @param {Response} res - Express response.
 * @param {NextFunction} next - Express next function.
 */
export async function logout(_req: Request, res: Response, next: NextFunction): Promise<void> {
  const userData: JwtPayload = _req.user as JwtPayload;

  Session.update(
    { active: false },
    { where: { id: userData.sessionId }
    }).then(function () {
    res.clearCookie('jwt', {
      httpOnly: true,
    });
    res.status(HttpCode.Ok).json();

  }).catch(function (error: unknown) {
    next(error);
  });
}

passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (
      req: Request,
      email: string,
      password: string,
      done: (error: unknown | null, user?: LoginResult | false, options?: IVerifyOptions) => void
    ) => {
      try {
        const account: Account = await findAccountByEmail(email);

        if (!account.emailVerified) {
          throw new ApiError(accountErrors.ERR_EMAIL_NOT_CONFIRMED, HttpCode.Forbidden);
        }

        const userAgent: string = req?.headers['user-agent'] ?? '';
        const parsedUserAgent: IResult | undefined = UAParser(userAgent);

        const session: Session = await Session.create({
          accountId: account.id,
          expireAt: new Date(Date.now() + accountConstants.JWT_EXPIRY_TIME),
          browser: parsedUserAgent?.browser.name ?? '-',
          os: parsedUserAgent?.os.name ?? '-',
          device: parsedUserAgent?.device.type ?? '-'
        });

        const match: boolean = await argon.verify(account.password.trim(), password);
        if (!match) {
          throw new InvalidCredentials();
        }

        const role: LoginResult = {
          id: account.id,
          role: account.role as Role,
          username: account.username,
          email: account.email,
          allowNewsLetter: account.allowNewsLetter,
          language: account.languageId,
          jlptLevel: account.selectedJlptLevel,
          sessionId: session.id
        };
        return done(null, role, { message: 'success' });
      } catch (error) {
        if (error instanceof InvalidCredentials) {
          return done(null, false, { message: 'invalid credentials' });
        }
        return done(error);
      }
    }
  ),
);

passport.use('jwt', new JWTStrategy(
  {
    secretOrKey: JWT_SECRET,
    jwtFromRequest: (req: Request): string | null => {
      return (req && req.cookies) ? req.cookies['jwt'] : null;
    }
  },
  async (jwt_payload: JwtPayload, done: VerifiedCallback): Promise<void> => {
    try {
      return done(null, jwt_payload);
    } catch(e) {
      return done(e, false);
    }
  }
)
);
