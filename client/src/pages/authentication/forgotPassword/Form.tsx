import React from 'react'

import * as yup from 'yup'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import { Link } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from 'src/app/hooks'
import { RootState } from 'src/app/store'
import { RememberMe, setRememberMe as SetRememberMe, resetRememberMe } from 'src/features/rememberMeSlice'
import { constants } from 'src/config/constants'
import axios from 'src/lib/axios'
import { login, resetPassword } from 'src/config/api'
import i18n from 'src/i18n'
import { Account, setAccount } from 'src/features/accountSlice'
import routes from 'src/config/routes'
import Button from 'src/components/Button'
import InputField from 'src/components/InputField'

interface IFormValues {
  email: string
}

export default function Form (): React.JSX.Element {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [loggingIn, setLoggingIn] = React.useState<boolean>(false)
  const { rememberEmail, rememberPassword }: RememberMe = useAppSelector((state: RootState) => state.remember)
  const [rememberMe, setRememberMe] = React.useState<boolean>(rememberEmail != null && rememberPassword != null)

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .email(t('errors.ERR_NOT_VALID_EMAIL'))
        .max(
          constants.account.emailMaxLength,
          t('errors.ERR_EMAIL_TOO_LONG', {
            length: constants.account.emailMaxLength
          })
        )
        .required(t('errors.ERR_EMAIL_REQUIRED'))
    }),
    onSubmit: (values: IFormValues) => {
      axios.post(resetPassword, {
        email: values.email
      }).then(function () {
        // setIsSubmitted(false)
        // setResetInProcess(false)
        // setSuccess(true)
      }).catch(function (error) {
        console.log(error)
      })
    }
  })

  return (
    <div className="bg-blue-100">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">{constants.appName}</a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 shadow-lg">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              {t('pages.login.title')}
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={formik.handleSubmit}
            >
              {/* Email field */}
              <InputField
                id='email'
                type='email'
                name='email'
                label={t('misc.email')}
                placeholder='example@yomiko.io'
                value={formik.values.email}
                errors={formik.errors.email}
                fieldTouched={formik.touched.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              <Button
                type='submit'
                loading={loggingIn}
                disabled={loggingIn}
                loadingText={t('pages.login.signingIn')}
                buttonText={t('pages.login.logInButton')}
              />
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                <Link
                  to={routes.register}
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  {t('pages.register.noAccount')}
                </Link>
              </p>
            </form>

          </div>
        </div>
      </div>
    </div>
  )
}

/*
import * as React from 'react'

// Third party imports
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Box } from '@mui/system'
import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined'
import { Grid, Typography } from '@mui/material'

// Project imports
import ResetForm from './Form'
import { login } from '../../../config/path'

function ForgotPassword (): JSX.Element {
  const { t } = useTranslation()

  const [resetInProcess, setResetInProcess] = React.useState<boolean>(false)
  const [success, setSuccess] = React.useState<boolean>(false)

  return (
    <>
      <Typography component="h1" variant="h5" sx={{ marginTop: 2, marginBottom: 5, textAlign: 'center' }}>
        {t('pages.password.forgotPassword.title')}
      </Typography>
      { success
        ? <Box sx={{ textAlign: 'center' }}>
          <DoneOutlineOutlinedIcon sx={{ color: 'green', fontSize: 50 }}/>
          <Typography component="h4" variant="h5" sx={{ marginTop: 2, marginBottom: 5 }}>
            {t('pages.password.forgotPassword.successTitle')}
          </Typography>
          <Link to={login}>
            {t('pages.login.linkToLogin')}
          </Link>
        </Box>
        : <Box sx={{ opacity: resetInProcess ? 0.2 : 1.0 }}>
          <ResetForm setResetInProcess={setResetInProcess} setSuccess={setSuccess}/>
          <Grid container>
            <Grid item>
              <Link to={login}>
                {t('pages.login.linkToLogin')}
              </Link>
            </Grid>
          </Grid>
        </Box>
      }
    </>
  )
}

export default ForgotPassword
*/
