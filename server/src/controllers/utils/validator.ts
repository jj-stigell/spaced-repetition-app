import * as yup from 'yup';

import { validationErrors } from '../../configs/errorCodes';

export const idSchema: yup.AnyObject = yup.object().shape({
  id: yup.number()
    .min(1, validationErrors.ERR_ZERO_OR_NEGATIVE_NUMBER)
    .integer(validationErrors.ERR_INPUT_TYPE)
    .typeError(validationErrors.ERR_INPUT_TYPE)
    .required(validationErrors.ERR_INPUT_VALUE_MISSING)
});
