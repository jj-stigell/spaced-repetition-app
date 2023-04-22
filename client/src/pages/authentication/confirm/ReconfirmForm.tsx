/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import * as React from 'react'

// Third party imports
import { Button, Box, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import * as yup from 'yup'

// Project imports
import { constants } from '../../../config/constants'

function ReconfirmForm (): JSX.Element {
  const { t } = useTranslation()

  const validationSchema: yup.AnySchema = yup.object({
    email: yup.string()
      .email(t('errors.notValidEmailError') as string)
      .max(constants.account.emailMaxLength, t('errors.emailMaxLengthError', { length: constants.account.emailMaxLength }) as string)
      .required(t('errors.requiredEmailError') as string)
  })

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema,
    onSubmit: (values): void => {
      console.log('Send reconfirmation link for email address:', values)
    }
  })

  return (
    <>
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        {t('confirm.resend.resendConfirmDescription', { redirectTimeout: constants.redirectTimeout })}
      </Box>
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
        <TextField
          sx={{ p: 1 }}
          margin="normal"
          fullWidth
          id="email"
          label={t('misc.email')}
          name="email"
          type="text"
          autoComplete="email"
          autoFocus
          value={formik.values.email}
          onChange={formik.handleChange}
          error={(formik.touched.email === true) && Boolean(formik.errors.email)}
          helperText={(formik.touched.email === true) && formik.errors.email}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          {t('confirm.resend.resendConfirmButton')}
        </Button>
      </Box>
    </>
  )
}

export default ReconfirmForm
