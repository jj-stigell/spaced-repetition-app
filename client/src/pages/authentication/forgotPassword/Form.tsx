/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import * as React from 'react'

// Third party imports
import { Box, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import * as yup from 'yup'

// Project imports
import SubmitButton from '../../../components/SubmitButton'
import { constants } from '../../../config/constants'

interface FormProps {
  setResetInProcess: React.Dispatch<React.SetStateAction<boolean>>
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>
}

function Form ({ setResetInProcess, setSuccess }: FormProps): JSX.Element {
  const { t } = useTranslation()
  const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false)
  const [apiError, setApiError] = React.useState<null | string>(null)

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
      console.log('Reset password for email address:', values.email)
      setIsSubmitted(true)
      setResetInProcess(true)

      // SUCCESSS
      setTimeout(() => {
        // dispatch(setNotification({ message: 'change password link send to email address', severity: 'success' }))
        setIsSubmitted(false)
        setResetInProcess(false)
        setSuccess(true)
      }, 2000)

      // FAILURE
      /*
      setTimeout(() => {
        setIsSubmitted(false)
        setResetInProcess(false)
        setSuccess(false)
        setApiError(t('errors.emailNotFound'))
      }, 2000)
      */
    }
  })

  return (
    <>
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        {t('password.forgotPassword.resetDescription', { redirectTimeout: constants.redirectTimeout })}
      </Box>
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
        <TextField
          disabled={isSubmitted}
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
          onChange={(e) => {
            formik.handleChange(e)
            setApiError(null)
          }}
          error={(formik.touched.email === true) && (Boolean(formik.errors.email) || Boolean(apiError))}
          helperText={(formik.touched.email === true) && (formik.errors.email ?? apiError)}
        />
        <SubmitButton buttonText={t('password.forgotPassword.resetButton')} disabled={isSubmitted} />
      </Box>
    </>
  )
}

export default Form
