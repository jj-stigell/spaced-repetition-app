/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import * as React from 'react'

// Third party imports
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import { Box, Grid, Link, Checkbox, TextField, FormControlLabel, FormControl, InputLabel, OutlinedInput, FormHelperText, InputAdornment, IconButton } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

// Project imports
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { RootState } from '../../../app/store'
import { setAccount } from '../../../features/account/accountSlice'
import { RememberMe, setRememberMe as SetRememberMe, resetRememberMe } from '../../../features/account/rememberMeSlice'
import { setNotification } from '../../../features/notification/notificationSlice'
import { LoginData } from '../../../types'
import SubmitButton from '../../../components/SubmitButton'
import { constants } from '../../../config/constants'

// DEV STUFF
import { loggedInAccount, logInErrorResponse } from '../../../mockData'

function LoginForm (): JSX.Element {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { rememberMeEmail, rememberMePassword }: RememberMe = useAppSelector((state: RootState) => state.remember)
  const [rememberMe, setRememberMe] = React.useState<boolean>(rememberMeEmail != null && rememberMePassword != null)
  const [showPassword, setShowPassword] = React.useState<boolean>(false)
  const [loggingIn, setLoggingIn] = React.useState<boolean>(false)

  const handleClickShowPassword = (): void => { setShowPassword(!showPassword) }

  const validationSchema: yup.AnySchema = yup.object({
    email: yup
      .string()
      .email(t('errors.notValidEmailError') as string)
      .max(constants.account.emailMaxLength, t('errors.emailMaxLengthError', { length: constants.account.emailMaxLength }) as string)
      .required(t('errors.requiredEmailError') as string),
    password: yup
      .string()
      .max(constants.account.passwordMaxLength, t('errors.passwordMaxLengthError', { length: constants.account.passwordMaxLength }) as string)
      .required(t('errors.requiredPasswordError') as string)
  })

  const formik = useFormik({
    initialValues: {
      email: (rememberMeEmail != null) ? rememberMeEmail : '',
      password: (rememberMePassword != null) ? rememberMePassword : ''
    },
    validationSchema,
    onSubmit: (values: LoginData): void => {
      setLoggingIn(true)
      console.log(values, 'Remember me:', rememberMe)
      setTimeout(() => {
        // If Login success
        if (values.password === 'Testing12345' && values.email === 'test@test.com') {
          console.log('correct')
          dispatch(setAccount(loggedInAccount))
          if (rememberMe) {
            dispatch(SetRememberMe({ email: values.email, password: values.password }))
          } else {
            dispatch(resetRememberMe({}))
          }
        } else {
          // If login failed
          dispatch(setNotification({ message: t(`errors.${logInErrorResponse[0]}`), severity: 'error' }))
          setLoggingIn(false)
        }
      }, 3000)
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
          autoFocus
          type={showPassword ? 'text' : 'password'}
          value={formik.values.password}
          onChange={formik.handleChange}
          error={(formik.touched.password === true) && Boolean(formik.errors.password)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                disabled={loggingIn}
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
          <Link href="/auth/forgot-password" variant="body2">
            {t('misc.passwordForgot')}
          </Link>
        </Grid>
        <Grid item>
          <Link href="/auth/register" variant="body2">
          {t('register.noAccount')}
          </Link>
        </Grid>
      </Grid>
    </Box>
  )
}

export default LoginForm
