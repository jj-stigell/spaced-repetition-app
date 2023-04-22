/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import * as React from 'react'

// Third party imports
import { Box, Grid, Link, Checkbox, TextField, FormControlLabel, FormControl, OutlinedInput, InputLabel, InputAdornment, IconButton, FormHelperText } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import * as yup from 'yup'

// Project imports
import { setNotification } from '../../../features/notification/notificationSlice'
import CircularLoader from '../../../components/CircularLoader'
import SubmitButton from '../../../components/SubmitButton'
import { constants } from '../../../config/constants'
import { useAppDispatch } from '../../../app/hooks'
import { LoginData } from '../../../types'
import { Visibility, VisibilityOff } from '@mui/icons-material'

interface FormProps {
  setRegisteredEmail: React.Dispatch<React.SetStateAction<string | null>>
}

function RegisterForm ({ setRegisteredEmail }: FormProps): JSX.Element {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const [tosAccepted, setTosAccepted] = React.useState<boolean>(false)
  const [tosError, setTosError] = React.useState<boolean>(false)
  const [registering, setRegistering] = React.useState<boolean>(false)
  const [showPassword, setShowPassword] = React.useState<boolean>(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = React.useState<boolean>(false)

  const handleClickShowPassword = (): void => { setShowPassword(!showPassword) }
  const handleClickShowPasswordConfirm = (): void => { setShowPasswordConfirm(!showPasswordConfirm) }

  const validationSchema: yup.AnySchema = yup.object({
    email: yup.string()
      .email(t('errors.notValidEmailError') as string)
      .max(constants.account.emailMaxLength, t('errors.emailMaxLengthError', { length: constants.account.emailMaxLength }) as string)
      .required(t('errors.requiredEmailError') as string),
    username: yup.string()
      .max(constants.account.usernameMaxLength, t('errors.usernameMaxLengthError', { length: constants.account.usernameMaxLength }) as string)
      .min(constants.account.usernameMinLength, t('errors.usernameMinLengthError', { length: constants.account.usernameMinLength }) as string)
      .required(t('errors.requiredUsernameError') as string),
    password: yup.string()
      .max(constants.account.passwordMaxLength, t('errors.passwordMaxLengthError', { length: constants.account.passwordMaxLength }) as string)
      .min(constants.account.passwordMinLength, t('errors.passwordMinLengthError', { length: constants.account.passwordMinLength }) as string)
      .matches(constants.regex.lowercaseRegex, t('errors.passwordLowercaseError') as string)
      .matches(constants.regex.uppercaseRegex, t('errors.passwordUppercaseError') as string)
      .matches(constants.regex.numberRegex, t('errors.passwordNumberError') as string)
      .required(t('errors.requiredPasswordError') as string),
    passwordConfirmation: yup.string()
      .max(constants.account.passwordMaxLength, t('errors.passwordMaxLengthError', { length: constants.account.passwordMaxLength }) as string)
      .min(constants.account.passwordMinLength, t('errors.passwordMinLengthError', { length: constants.account.passwordMinLength }) as string)
      .matches(constants.regex.lowercaseRegex, t('errors.passwordLowercaseError') as string)
      .matches(constants.regex.uppercaseRegex, t('errors.passwordUppercaseError') as string)
      .matches(constants.regex.numberRegex, t('errors.passwordNumberError') as string)
      .oneOf([yup.ref('password'), null], t('errors.passwordMismatchError') as string)
      .required(t('errors.requiredPasswordConfirmError') as string)
  })

  const formik = useFormik({
    initialValues: {
      email: 'test@test.com',
      username: 'testingMan',
      password: 'Testing12345',
      passwordConfirmation: 'Testing12345'
    },
    validationSchema,
    onSubmit: (values: LoginData): void => {
      console.log(values)
      if (tosAccepted) {
        setRegistering(true)
        console.log('TOS ACCEPT! REGISTERING NEW ACCOUNT')
        // send to server
        // if success redirect to succes page and then login
        // if error display errors and wait for fixes

        // SUCCESS
        setTimeout(() => {
          setRegisteredEmail(values.email)
          setRegistering(false)
        }, 3000)

        // ERROR
        setTimeout(() => {
          setRegistering(false)
        }, 3000)
      } else {
        setTosError(true)
        dispatch(setNotification({ message: t('errors.tosNotChecked'), severity: 'error' }))
      }
    }
  })

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
      <TextField
        disabled={registering}
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
      <TextField
        disabled={registering}
        margin="normal"
        fullWidth
        id="username"
        label={t('misc.username')}
        name="username"
        type="text"
        autoFocus
        value={formik.values.username}
        onChange={formik.handleChange}
        error={(formik.touched.username === true) && Boolean(formik.errors.username)}
        helperText={(formik.touched.username === true) && formik.errors.username}
      />
      <FormControl sx={{ width: '100%' }} variant="outlined">
        <InputLabel sx={{ mt: 2 }} htmlFor="outlined-adornment-password">{t('misc.password')}</InputLabel>
        <OutlinedInput
          sx={{ mt: 2 }}
          id="password"
          label={t('misc.password')}
          name="password"
          autoFocus
          disabled={registering}
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
          disabled={registering}
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
      <div style={{
        marginTop: 2,
        fontSize: 15,
        borderStyle: tosError ? 'solid' : 'none',
        borderColor: tosError ? 'red' : 'none',
        borderRadius: tosError ? '5px' : 'none'
      }}>
        <FormControlLabel
          control={
          <Checkbox
            disabled={registering}
            checked={tosAccepted}
            onChange={() => {
              setTosAccepted(!tosAccepted)
              setTosError(false)
            }}
            value={tosAccepted}
            color="primary"
            />}
            label=''
        />
        {t('register.agreeWith')} {' '}
        <Link href={constants.tosLink} target='_blank'>
          {t('register.TOS')}
        </Link>
      </div>
      {!registering
        ? <SubmitButton buttonText={t('register.registerButton')} disabled={registering} />
        : <CircularLoader />
      }
      <Grid container>
        <Grid item>
          <Link href="/auth/login" variant="body2">
            {t('register.haveAccount')}
          </Link>
        </Grid>
      </Grid>
    </Box>
  )
}

export default RegisterForm
