/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import * as React from 'react'

// Third party imports
import { AxiosError } from 'axios'
import { useFormik } from 'formik'
import { Box, TextField, CircularProgress } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'

// Project imports
import { constants } from '../../../config/constants'
import { resendConfirmation } from '../../../config/api'
import axios from '../../../lib/axios'
import { useAppDispatch } from '../../../app/hooks'
import { setNotification } from '../../../features/notificationSlice'
import { login } from '../../../config/path'
import SubmitButton from '../../../components/SubmitButton'

function ReconfirmForm (): JSX.Element {
  const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

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
      axios.post(resendConfirmation, {
        email: values.email
      })
        .then(function () {
          setIsSubmitted(false)
          dispatch(setNotification(
            { message: t('confirm.resend.resendSuccess', { email: values.email, redirectTimeout: constants.redirectTimeout }), severity: 'success' }
          ))

          setTimeout(() => {
            navigate(login)
          }, constants.redirectTimeout * 1000)
        })
        .catch(function (error) {
          setIsSubmitted(false)
          console.log('error encountered', error)
          const errorCode: string | null = error?.response?.data?.errors[0].code

          if (errorCode != null) {
            // TODO: what if there are multiple errors.
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            dispatch(setNotification({ message: t(`errors.${errorCode}`), severity: 'error' }))
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
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        {t('confirm.resend.resendConfirmDescription', { redirectTimeout: constants.redirectTimeout })}
      </Box>
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
        <TextField
          sx={{ p: 1 }}
          disabled={isSubmitted}
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
        { isSubmitted &&
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress color='inherit' />
          </Box>
        }
        <SubmitButton buttonText={t('confirm.resend.resendConfirmButton')} disabled={isSubmitted} />
      </Box>
    </>
  )
}

export default ReconfirmForm
