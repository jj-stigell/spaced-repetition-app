/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import * as React from 'react'

// Third party imports
import { AxiosError } from 'axios'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import {
  Box, Grid, Checkbox, TextField,
  FormControlLabel, FormControl, InputLabel,
  OutlinedInput, FormHelperText, InputAdornment,
  IconButton
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { Link } from 'react-router-dom'

// Project imports
import axios from '../../../lib/axios'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { RootState } from '../../../app/store'
import { setLogin } from '../../../features/account/accountSlice'
import { RememberMe, setRememberMe as SetRememberMe, resetRememberMe } from '../../../features/account/rememberMeSlice'
import { setNotification } from '../../../features/notification/notificationSlice'
import { LoginData } from '../../../types'
import SubmitButton from '../../../components/SubmitButton'
import { constants } from '../../../config/constants'
import { register, requestResetPassword } from '../../../config/path'
import { login } from '../../../config/api'

function LoginForm (): JSX.Element {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { rememberMeEmail, rememberMePassword }: RememberMe = useAppSelector((state: RootState) => state.remember)
  const [rememberMe, setRememberMe] = React.useState<boolean>(rememberMeEmail != null && rememberMePassword != null)
  const [showPassword, setShowPassword] = React.useState<boolean>(false)
  const [loggingIn, setLoggingIn] = React.useState<boolean>(false)

  const validationSchema: yup.AnySchema = yup.object({
    email: yup.string()
      .email(t('errors.ERR_NOT_VALID_EMAIL') as string)
      .max(constants.account.emailMaxLength, t('errors.ERR_EMAIL_TOO_LONG', { length: constants.account.emailMaxLength }) as string)
      .required(t('errors.ERR_EMAIL_REQUIRED') as string),
    password: yup.string()
      .max(constants.account.passwordMaxLength, t('errors.ERR_PASSWORD_TOO_LONG', { length: constants.account.passwordMaxLength }) as string)
      .required(t('errors.ERR_PASSWORD_REQUIRED') as string)
  })

  const formik = useFormik({
    initialValues: {
      email: rememberMeEmail ?? '',
      password: rememberMePassword ?? ''
    },
    validationSchema,
    onSubmit: (values: LoginData): void => {
      setLoggingIn(true)

      axios.post(login, {
        email: values.email,
        password: values.password
      })
        .then(function () {
          dispatch(setLogin(true))

          // Store remember me if selected, otherwise clear.
          if (rememberMe) {
            dispatch(SetRememberMe({ rememberMeEmail: values.email, rememberMePassword: values.password }))
          } else {
            dispatch(resetRememberMe({}))
          }
        })
        .catch(function (error) {
          console.log('error encountered', error)
          const errorCode: string | null = error?.response?.data?.errors[0].code
          setLoggingIn(false)

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
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
      <TextField
        sx={{ p: 0 }}
        disabled={loggingIn}
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
      <FormControl sx={{ width: '100%' }} variant="outlined">
        <InputLabel sx={{ mt: 2 }} htmlFor="outlined-adornment-password">{t('misc.password')}</InputLabel>
        <OutlinedInput
          sx={{ mt: 2 }}
          disabled={loggingIn}
          id="password"
          label={t('misc.password')}
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={formik.values.password}
          onChange={formik.handleChange}
          error={(formik.touched.password === true) && Boolean(formik.errors.password)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                disabled={loggingIn}
                aria-label="toggle password visibility"
                onClick={() => { setShowPassword(!showPassword) }}
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
      <FormControlLabel
        control={
        <Checkbox
          checked={rememberMe}
          disabled={loggingIn}
          onChange={() => { setRememberMe(!rememberMe) }}
          value="remember"
          color="primary"
          />}
        label={t('login.rememberMe')}
      />
      <SubmitButton buttonText={t('login.logInButton')} disabled={loggingIn} />
      <Grid container>
        <Grid item xs>
          <Link to={requestResetPassword}>
            {t('misc.passwordForgot')}
          </Link>
        </Grid>
        <Grid item>
          <Link to={register}>
          {t('register.noAccount')}
          </Link>
        </Grid>
      </Grid>
    </Box>
  )
}

export default LoginForm

// variant="body2"
