/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import * as React from 'react'

// Third party imports
import { AxiosError } from 'axios'
import { Box, CircularProgress, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import * as yup from 'yup'

// Project imports
import SubmitButton from '../../../components/SubmitButton'
import { constants } from '../../../config/constants'
import { resetPassword } from '../../../config/api'
import axios from '../../../lib/axios'
import { setNotification } from '../../../features/notificationSlice'
import { useAppDispatch } from '../../../app/hooks'

function Form ({ setResetInProcess, setSuccess }: {
  setResetInProcess: React.Dispatch<React.SetStateAction<boolean>>
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>
}): JSX.Element {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false)
  const [apiError, setApiError] = React.useState<null | string>(null)

  const validationSchema: yup.AnySchema = yup.object({
    email: yup.string()
      .email(t('errors.ERR_NOT_VALID_EMAIL') as string)
      .max(constants.account.emailMaxLength, t('errors.ERR_EMAIL_TOO_LONG', { length: constants.account.emailMaxLength }) as string)
      .required(t('errors.ERR_EMAIL_REQUIRED') as string)
  })

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema,
    onSubmit: (values): void => {
      setIsSubmitted(true)
      setResetInProcess(true)

      axios.post(resetPassword, {
        email: values.email
      }).then(function () {
        setIsSubmitted(false)
        setResetInProcess(false)
        setSuccess(true)
      }).catch(function (error) {
        setIsSubmitted(false)
        setResetInProcess(false)
        setSuccess(false)
        console.log('error encountered', error)
        const errorCode: string | null = error?.response?.data?.errors[0].code

        if (errorCode != null) {
          if (errorCode.startsWith('ERR_EMAIL')) {
            setApiError(t(`errors.${errorCode}`))
          } else {
            // TODO: what if there are multiple errors.
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            dispatch(setNotification({ message: t(`errors.${errorCode}`), severity: 'error' }))
          }
        } else if (error instanceof AxiosError) {
          dispatch(setNotification({ message: error.message, severity: 'error' }))
        } else {
          dispatch(setNotification({ message: t('errors.ERR_CHECK_CONNECTION'), severity: 'error' }))
        }
      })
    }
  })

  return (
    <>
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        {t('pages.password.forgotPassword.resetDescription', { redirectTimeout: constants.redirectTimeout })}
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
        { isSubmitted &&
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress color='inherit' />
          </Box>
        }
        <SubmitButton buttonText={t('pages.password.forgotPassword.resetButton')} disabled={isSubmitted} />
      </Box>
    </>
  )
}

export default Form
