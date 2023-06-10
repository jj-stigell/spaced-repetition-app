/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import * as React from 'react'

// Third party imports
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box, FormControl, FormHelperText,
  IconButton, InputAdornment, InputLabel,
  OutlinedInput
} from '@mui/material'
import { useFormik } from 'formik'
import * as yup from 'yup'

// Project imports
import SubmitButton from '../../../components/SubmitButton'
import { constants } from '../../../config/constants'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { login } from '../../../config/path'
import { setNotification } from '../../../features/notificationSlice'
import { useAppDispatch } from '../../../app/hooks'
import { resetPassword } from '../../../config/api'
import axios from '../../../lib/axios'

function Form (): JSX.Element {
  const { t } = useTranslation()
  const { confirmationId } = useParams()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [submitting, setSubmitting] = React.useState<boolean>(false)
  const [showPassword, setShowPassword] = React.useState<boolean>(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = React.useState<boolean>(false)

  const handleClickShowPassword = (): void => { setShowPassword(!showPassword) }
  const handleClickShowPasswordConfirm = (): void => { setShowPasswordConfirm(!showPasswordConfirm) }

  const validationSchema: yup.AnySchema = yup.object({
    password: yup.string()
      .max(constants.account.passwordMaxLength, t('errors.ERR_PASSWORD_TOO_LONG', { length: constants.account.passwordMaxLength }) as string)
      .min(constants.account.passwordMinLength, t('errors.ERR_PASSWORD_TOO_SHORT', { length: constants.account.passwordMinLength }) as string)
      .matches(constants.regex.lowercaseRegex, t('errors.ERR_PASSWORD_LOWERCASE') as string)
      .matches(constants.regex.uppercaseRegex, t('errors.ERR_PASSWORD_UPPERCASE') as string)
      .matches(constants.regex.numberRegex, t('errors.ERR_PASSWORD_NUMBER') as string)
      .required(t('errors.ERR_PASSWORD_REQUIRED') as string),
    passwordConfirmation: yup.string()
      .max(constants.account.passwordMaxLength, t('errors.ERR_PASSWORD_TOO_LONG', { length: constants.account.passwordMaxLength }) as string)
      .min(constants.account.passwordMinLength, t('errors.ERR_PASSWORD_TOO_SHORT', { length: constants.account.passwordMinLength }) as string)
      .matches(constants.regex.lowercaseRegex, t('errors.ERR_PASSWORD_LOWERCASE') as string)
      .matches(constants.regex.uppercaseRegex, t('errors.ERR_PASSWORD_UPPERCASE') as string)
      .matches(constants.regex.numberRegex, t('errors.ERR_PASSWORD_NUMBER') as string)
      .oneOf([yup.ref('password'), null], t('errors.ERR_PASSWORD_MISMATCH') as string)
      .required(t('errors.ERR_PASSWORD_CONFIRMATION_REQUIRED') as string)
  })

  const formik = useFormik({
    initialValues: {
      password: '',
      passwordConfirmation: ''
    },
    validationSchema,
    onSubmit: (values, { resetForm }): void => {
      setSubmitting(true)

      axios.patch(resetPassword, {
        password: values.password,
        confirmationId
      }).then(function () {
        setSubmitting(false)
        resetForm()
        dispatch(setNotification(
          { message: t('pages.password.resetPassword.successTitle', { redirectTimeout: constants.redirectTimeout }), severity: 'success' }
        ))

        setTimeout(() => {
          navigate(login)
        }, constants.redirectTimeout * 1000)
      }).catch(function (error) {
        setSubmitting(false)
        let errorCode: string | null = null

        if (Array.isArray(error?.response?.data?.errors)) {
          errorCode = error?.response?.data?.errors[0].code
        }

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
        {t('pages.password.resetPassword.resetDescription', { redirectTimeout: constants.redirectTimeout })}
      </Box>
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
      <FormControl sx={{ width: '100%' }} variant="outlined">
        <InputLabel sx={{ mt: 2 }} htmlFor="outlined-adornment-password">{t('misc.password')}</InputLabel>
        <OutlinedInput
          sx={{ mt: 2 }}
          id="password"
          label={t('misc.password')}
          name="password"
          autoFocus
          disabled={submitting}
          type={showPassword ? 'text' : 'password'}
          value={formik.values.password}
          onChange={formik.handleChange}
          error={(formik.touched.password === true) && Boolean(formik.errors.password)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        {Boolean(formik.errors.password) && (formik.touched.password === true) && (
          <FormHelperText error id="password-error">
            {formik.errors.password}
          </FormHelperText>
        )}
      </FormControl>
      <FormControl sx={{ width: '100%' }} variant="outlined">
        <InputLabel sx={{ mt: 2 }} htmlFor="outlined-adornment-passwordConfirmation">{t('misc.passwordConfirm')}</InputLabel>
        <OutlinedInput
          sx={{ mt: 2 }}
          id="passwordConfirmation"
          label={t('misc.passwordConfirm')}
          name="passwordConfirmation"
          autoFocus
          disabled={submitting}
          type={showPasswordConfirm ? 'text' : 'password'}
          value={formik.values.passwordConfirmation}
          onChange={formik.handleChange}
          error={(formik.touched.passwordConfirmation === true) && Boolean(formik.errors.passwordConfirmation)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPasswordConfirm}
                edge="end"
              >
                {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        {Boolean(formik.errors.passwordConfirmation) && (formik.touched.passwordConfirmation === true) && (
          <FormHelperText error id="passwordConfirm-error">
            {formik.errors.passwordConfirmation}
          </FormHelperText>
        )}
      </FormControl>
        <SubmitButton buttonText={t('pages.password.resetPassword.resetButton')} />
      </Box>
    </>
  )
}

export default Form
