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
import { RegisterData } from '../../../types'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import axios from '../../../lib/axios'
import { register } from '../../../config/api'
import { AxiosError } from 'axios'

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
      .email(t('errors.ERR_NOT_VALID_EMAIL') as string)
      .max(constants.account.emailMaxLength, t('errors.ERR_EMAIL_TOO_LONG', { length: constants.account.emailMaxLength }) as string)
      .required(t('errors.ERR_EMAIL_REQUIRED') as string),
    username: yup.string()
      .max(constants.account.usernameMaxLength, t('errors.ERR_USERNAME_TOO_LONG', { length: constants.account.usernameMaxLength }) as string)
      .min(constants.account.usernameMinLength, t('errors.ERR_USERNAME_TOO_SHORT', { length: constants.account.usernameMinLength }) as string)
      .required(t('errors.ERR_USERNAME_REQUIRED') as string),
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
      email: '',
      username: '',
      password: '',
      passwordConfirmation: '',
      language: 'EN'
    },
    validationSchema,
    onSubmit: (values: RegisterData): void => {
      // console.log(values)
      if (tosAccepted) {
        setRegistering(true)

        axios.post(register, {
          username: values.username,
          email: values.email,
          password: values.password,
          acceptTos: tosAccepted,
          allowNewsLetter: values.allowNewsLetter,
          language: values.language
        })
          .then(function () {
            // console.log('ok tuli', response.status)
            setRegisteredEmail(values.email)
            setRegistering(false)
          })
          .catch(function (error) {
            console.log('error encountered', error)
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            if (error?.response?.data?.errors[0].code) {
              // TODO: what if there are multiple errors.
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              dispatch(setNotification({ message: t(`errors.${error.response.data.errors[0].code}`), severity: 'error' }))
            } else if (error instanceof AxiosError) {
              dispatch(setNotification({ message: error.message, severity: 'error' }))
            } else {
              dispatch(setNotification({ message: t('errors.ERR_CHECK_CONNECTION'), severity: 'error' }))
            }
            setRegistering(false)
          })
      } else {
        setTosError(true)
        dispatch(setNotification({ message: t('errors.ERR_ACCEPT_TOS_REQUIRED'), severity: 'error' }))
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
