/* eslint-disable @typescript-eslint/strict-boolean-expressions */
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
import { login } from 'src/config/api'
import i18n from 'src/i18n'
import { Account, setAccount } from 'src/features/accountSlice'
import routes from 'src/config/routes'
import Button from 'src/components/Button'
import InputField from 'src/components/InputField'

interface IFormValues {
  email: string
  password: string
}

export default function Login (): React.JSX.Element {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [loggingIn, setLoggingIn] = React.useState<boolean>(false)
  const { rememberEmail, rememberPassword }: RememberMe = useAppSelector((state: RootState) => state.remember)
  const [rememberMe, setRememberMe] = React.useState<boolean>(rememberEmail != null && rememberPassword != null)

  const formik = useFormik({
    initialValues: {
      email: rememberEmail ?? '',
      password: rememberPassword ?? ''
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
        .required(t('errors.ERR_EMAIL_REQUIRED')),
      password: yup
        .string()
        .max(
          constants.account.passwordMaxLength,
          t('errors.ERR_PASSWORD_TOO_LONG', {
            length: constants.account.passwordMaxLength
          })
        )
        .required(t('errors.ERR_PASSWORD_REQUIRED'))
    }),
    onSubmit: (values: IFormValues) => {
      setLoggingIn(true)

      axios.post(login, {
        email: values.email,
        password: values.password
      }).then(function (response) {
        const accountInformation: Account = response.data.data
        void i18n.changeLanguage(accountInformation.language.toLocaleLowerCase())
        // TODO, get nextcard and timer from backend
        dispatch(setAccount({
          isLoggedIn: true,
          ...accountInformation,
          autoNextCard: true,
          nextCardtimer: 5
        }))

        // Store remember me if selected, otherwise clear.
        if (rememberMe) {
          dispatch(SetRememberMe({ rememberEmail: values.email, rememberPassword: values.password }))
        } else {
          dispatch(resetRememberMe({}))
        }
        setLoggingIn(false)
      }).catch(function () {
        setLoggingIn(false)
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
              {/* Password field */}
              <InputField
                id='password'
                type='password'
                name='password'
                label={t('misc.password')}
                placeholder='••••••••'
                value={formik.values.password}
                errors={formik.errors.password}
                fieldTouched={formik.touched.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {/* Remember me and login button */}
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      onClick={() => { setRememberMe(!rememberMe) }}
                      checked={rememberMe}
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">
                      {t('pages.login.rememberMe')}
                    </label>
                  </div>
                </div>
                <a href="reset-password" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">
                  {t('misc.passwordForgot')}
                </a>
              </div>
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
            {/* 3rd party auth */}
            <div className="flex items-center mb-3">
              <hr className="h-0 border-b border-solid border-grey-500 grow" />
              <p className="mx-4 text-grey-600">{t('pages.login.or')}</p>
              <hr className="h-0 border-b border-solid border-grey-500 grow" />
            </div>
            <button className="flex items-center justify-center w-full py-4 mb-6 text-sm font-medium transition duration-300 rounded-2xl text-grey-900 bg-gray-200 hover:bg-gray-300 hover:scale-105 transform active:scale-95 transition-transform">
              <img
                className="h-5 mr-2"
                src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/logos/logo-google.png"
                alt=""
              />
              {t('pages.login.googleLogin')}
            </button>
            <button className="flex items-center justify-center w-full py-4 mb-6 text-sm font-medium transition duration-300 rounded-2xl text-grey-900 bg-gray-200 hover:bg-gray-300 hover:scale-105 transform active:scale-95 transition-transform">
              <img
                className="h-5 mr-2"
                src="https://cdn.iconscout.com/icon/free/png-256/free-facebook-logo-2019-1597680-1350125.png"
                alt=""
              />
              {t('pages.login.facebookLogin')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/*

              <InputField
                id='email'
                type='email'
                name='email'
                label={t('misc.email')}
                value={formik.values.email}
                errorMessage={formik.errors.email}
                fieldTouched={formik.touched.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />

              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  {t('misc.email')}
                </label>
                <input
                  className={`${
                    formik.touched.email && formik.errors.email
                      ? 'bg-red-300 border-red-500 text-red-700'
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  } border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="yomiko@yahoo.com"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                {formik.touched.email && formik.errors.email
                  ? (
                  <div className="text-xs font-medium text-red-700 mt-1">
                    {formik.errors.email as string}
                  </div>
                    )
                  : null}
              </div>

                            <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  {t('misc.password')}
                </label>
                <input
                  className={`${
                    formik.touched.password && formik.errors.password
                      ? 'bg-red-300 border-red-500 text-red-700'
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  } border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password
                  ? (
                  <div className="text-xs font-medium text-red-700 mt-1">
                    {formik.errors.password }
                  </div>
                    )
                  : null}
              </div>
*/
