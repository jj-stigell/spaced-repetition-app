/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import * as React from 'react'

// Third party imports
import { AxiosError } from 'axios'
import {
  Box, FormControl, OutlinedInput,
  InputLabel, InputAdornment, IconButton,
  FormHelperText, CircularProgress, Button
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { Visibility, VisibilityOff } from '@mui/icons-material'

// Project imports
import axios from '../../lib/axios'
import { setNotification } from '../../features/notificationSlice'
import { constants } from '../../config/constants'
import { useAppDispatch } from '../../app/hooks'
import { ChangePasswordData } from '../../types'
import { setPassword } from '../../config/api'

function ChangePassword (): JSX.Element {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false)
  const [showCurrentPassword, setShowCurrentPassword] = React.useState<boolean>(false)
  const [showNewPassword, setShowNewPassword] = React.useState<boolean>(false)
  const [showNewPasswordConfirm, setShowNewPasswordConfirm] = React.useState<boolean>(false)

  const validationSchema: yup.AnySchema = yup.object({
    currentPassword: yup.string()
      .required(t('errors.ERR_PASSWORD_REQUIRED') as string),
    newPassword: yup.string()
      .max(constants.account.passwordMaxLength, t('errors.ERR_PASSWORD_TOO_LONG', { length: constants.account.passwordMaxLength }) as string)
      .min(constants.account.passwordMinLength, t('errors.ERR_PASSWORD_TOO_SHORT', { length: constants.account.passwordMinLength }) as string)
      .matches(constants.regex.lowercaseRegex, t('errors.ERR_PASSWORD_LOWERCASE') as string)
      .matches(constants.regex.uppercaseRegex, t('errors.ERR_PASSWORD_UPPERCASE') as string)
      .matches(constants.regex.numberRegex, t('errors.ERR_PASSWORD_NUMBER') as string)
      .required(t('errors.ERR_PASSWORD_REQUIRED') as string),
    newPasswordConfirmation: yup.string()
      .max(constants.account.passwordMaxLength, t('errors.ERR_PASSWORD_TOO_LONG', { length: constants.account.passwordMaxLength }) as string)
      .min(constants.account.passwordMinLength, t('errors.ERR_PASSWORD_TOO_SHORT', { length: constants.account.passwordMinLength }) as string)
      .matches(constants.regex.lowercaseRegex, t('errors.ERR_PASSWORD_LOWERCASE') as string)
      .matches(constants.regex.uppercaseRegex, t('errors.ERR_PASSWORD_UPPERCASE') as string)
      .matches(constants.regex.numberRegex, t('errors.ERR_PASSWORD_NUMBER') as string)
      .oneOf([yup.ref('newPassword'), null], t('errors.ERR_PASSWORD_MISMATCH') as string)
      .required(t('errors.ERR_PASSWORD_CONFIRMATION_REQUIRED') as string)
  })

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      newPasswordConfirmation: ''
    },
    validationSchema,
    onSubmit: (values: ChangePasswordData, { resetForm }): void => {
      setIsSubmitted(true)
      axios.patch(setPassword, {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      })
        .then(function () {
          resetForm()
          setIsSubmitted(false)
          dispatch(setNotification({ message: t('pages.settings.changePassword.passwordChangeSuccess'), severity: 'success' }))
        })
        .catch(function (error) {
          setIsSubmitted(false)
          let errorCode: string | null = null

          if (Array.isArray(error?.response?.data?.errors)) {
            errorCode = error?.response?.data?.errors[0].code
          }

          if (errorCode != null) {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            dispatch(setNotification({ message: t(`errors.${error.response.data.errors[0].code}`), severity: 'error' }))
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
      <div style={{ textAlign: 'center' }}>
        <h2>{t('pages.settings.changePassword.title')}</h2>
      </div>
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
        <FormControl sx={{ width: '100%' }} variant="outlined">
          <InputLabel sx={{ mt: 2 }} htmlFor="outlined-adornment-current-password">{t('misc.password')}</InputLabel>
          <OutlinedInput
            sx={{ mt: 2 }}
            id="currentPassword"
            label={t('misc.password')}
            name="currentPassword"
            disabled={isSubmitted}
            type={showCurrentPassword ? 'text' : 'password'}
            value={formik.values.currentPassword}
            onChange={formik.handleChange}
            error={(formik.touched.currentPassword === true) && Boolean(formik.errors.currentPassword)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  disabled={isSubmitted}
                  aria-label="toggle password visibility"
                  onClick={() => { setShowCurrentPassword(!showCurrentPassword) }}
                  edge="end"
                >
                  {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          {Boolean(formik.errors.currentPassword) && (formik.touched.currentPassword === true) && (
            <FormHelperText error id="password-error">
              {formik.errors.currentPassword}
            </FormHelperText>
          )}
        </FormControl>
        <FormControl sx={{ width: '100%' }} variant="outlined">
          <InputLabel sx={{ mt: 2 }} htmlFor="outlined-adornment-new-password">{t('misc.newPassword')}</InputLabel>
          <OutlinedInput
            sx={{ mt: 2 }}
            id="newPassword"
            label={t('misc.newPassword')}
            name="newPassword"
            disabled={isSubmitted}
            type={showNewPassword ? 'text' : 'password'}
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            error={(formik.touched.newPassword === true) && Boolean(formik.errors.newPassword)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  disabled={isSubmitted}
                  aria-label="toggle password visibility"
                  onClick={() => { setShowNewPassword(!showNewPassword) }}
                  edge="end"
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          {Boolean(formik.errors.newPassword) && (formik.touched.newPassword === true) && (
            <FormHelperText error id="new-password-error">
              {formik.errors.newPassword}
            </FormHelperText>
          )}
        </FormControl>
        <FormControl sx={{ width: '100%' }} variant="outlined">
          <InputLabel sx={{ mt: 2 }} htmlFor="outlined-adornment-new-password-confirmation">{t('misc.confirmNewPassword')}</InputLabel>
          <OutlinedInput
            sx={{ mt: 2 }}
            id="newPasswordConfirmation"
            label={t('misc.confirmNewPassword')}
            name="newPasswordConfirmation"
            disabled={isSubmitted}
            type={showNewPasswordConfirm ? 'text' : 'password'}
            value={formik.values.newPasswordConfirmation}
            onChange={formik.handleChange}
            error={(formik.touched.newPasswordConfirmation === true) && Boolean(formik.errors.newPasswordConfirmation)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  disabled={isSubmitted}
                  aria-label="toggle password visibility"
                  onClick={() => { setShowNewPasswordConfirm(!showNewPasswordConfirm) }}
                  edge="end"
                >
                  {showNewPasswordConfirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          {Boolean(formik.errors.newPasswordConfirmation) && (formik.touched.newPasswordConfirmation === true) && (
            <FormHelperText error id="new-password-confirmation-error">
              {formik.errors.newPasswordConfirmation}
            </FormHelperText>
          )}
        </FormControl>
        { isSubmitted &&
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress color='inherit' />
          </Box>
        }
        <Button
          disabled={isSubmitted}
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          {t('pages.settings.changePassword.button')}
        </Button>
      </Box>
    </>
  )
}

export default ChangePassword
