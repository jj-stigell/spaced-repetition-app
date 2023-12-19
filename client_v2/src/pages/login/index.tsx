/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useState } from 'react'

import * as yup from 'yup'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'

import { constants } from '../../config/constants'

export default function Login (): React.JSX.Element {
  const { t } = useTranslation()
  const [remeberMe, setRememberMe] = useState(false)

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
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
    onSubmit: (values: any) => {
      alert(JSON.stringify(values, null, 2))
    }
  })

  return (
    <div className="bg-blue-100">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="/"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          Yomiko
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              {t('pages.login.title')}
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={formik.handleSubmit}
            >
              {/* Password field */}
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
              {/* Password field */}
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
                    {formik.errors.password as string}
                  </div>
                    )
                  : null}
              </div>
              {/* Remember me and login button */}
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      onClick={() => { setRememberMe(!remeberMe) }}
                      checked={remeberMe}
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="remember"
                      className="text-gray-500 dark:text-gray-300"
                    >
                      {t('pages.login.rememberMe')}
                    </label>
                  </div>
                </div>
                <a
                  href="reset-password"
                  className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  {t('misc.passwordForgot')}
                </a>
              </div>
              <button
                disabled={false}
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                {t('pages.login.logInButton')}
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                <a
                  href="/register"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  {t('pages.register.noAccount')}
                </a>
              </p>
            </form>
            {/* 3rd party auth */}
            <div className="flex items-center mb-3">
              <hr className="h-0 border-b border-solid border-grey-500 grow" />
              <p className="mx-4 text-grey-600">{t('pages.login.or')}</p>
              <hr className="h-0 border-b border-solid border-grey-500 grow" />
            </div>
            <button className="flex items-center justify-center w-full py-4 mb-6 text-sm font-medium transition duration-300 rounded-2xl text-grey-900 bg-gray-200 hover:bg-gray-300 hover:scale-105">
              <img
                className="h-5 mr-2"
                src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/logos/logo-google.png"
                alt=""
              />
              {t('pages.login.googleLogin')}
            </button>
            <button className="flex items-center justify-center w-full py-4 mb-6 text-sm font-medium transition duration-300 rounded-2xl text-grey-900 bg-gray-200 hover:bg-gray-300 hover:scale-105">
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
