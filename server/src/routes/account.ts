import { Router } from 'express';

import {
  confirmEmail, resendConfirmEmail, requestResetPassword, resetPassword
} from '../controllers/account';
import { requestWrap } from '../util/requestWrap.ts';

export const router: Router = Router();

router.post(
  '/confirmation',
  requestWrap(confirmEmail)
);

router.post(
  '/confirmation/resend',
  requestWrap(resendConfirmEmail)
);

router.post(
  '/password/reset',
  requestWrap(requestResetPassword)
);

router.patch(
  '/password/reset',
  requestWrap(resetPassword)
);
