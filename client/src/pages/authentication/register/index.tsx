/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'

import * as yup from 'yup'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'

import { Link } from 'react-router-dom'

import { useAppDispatch } from 'src/app/hooks'
import { constants } from 'src/config/constants'
import axios from 'src/lib/axios'
import { register } from 'src/config/api'
import { setNotification } from 'src/features/notificationSlice'
import Spinner from 'src/components/Spinner'
import Modal from 'src/components/Modal'
import Tos from './Tos'
import routes from 'src/config/routes'

export default function Register (): React.JSX.Element {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [registering, setRegistering] = React.useState<boolean>(false)
  const [tosAccepted, setTosAccepted] = React.useState<boolean>(false)
  const [tosError, setTosError] = React.useState<boolean>(false)
  const [showTos, setShowTos] = React.useState<boolean>(false)

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: '',
      passwordConfirmation: ''
    },
    validationSchema: yup.object({
      email: yup.string()
        .email(t('errors.ERR_NOT_VALID_EMAIL'))
        .max(constants.account.emailMaxLength, t('errors.ERR_EMAIL_TOO_LONG', { length: constants.account.emailMaxLength }))
        .required(t('errors.ERR_EMAIL_REQUIRED')),
      username: yup.string()
        .max(constants.account.usernameMaxLength, t('errors.ERR_USERNAME_TOO_LONG', { length: constants.account.usernameMaxLength }))
        .min(constants.account.usernameMinLength, t('errors.ERR_USERNAME_TOO_SHORT', { length: constants.account.usernameMinLength }))
        .required(t('errors.ERR_USERNAME_REQUIRED')),
      password: yup.string()
        .max(constants.account.passwordMaxLength, t('errors.ERR_PASSWORD_TOO_LONG', { length: constants.account.passwordMaxLength }))
        .min(constants.account.passwordMinLength, t('errors.ERR_PASSWORD_TOO_SHORT', { length: constants.account.passwordMinLength }))
        .matches(constants.regex.lowercaseRegex, t('errors.ERR_PASSWORD_LOWERCASE'))
        .matches(constants.regex.uppercaseRegex, t('errors.ERR_PASSWORD_UPPERCASE'))
        .matches(constants.regex.numberRegex, t('errors.ERR_PASSWORD_NUMBER'))
        .required(t('errors.ERR_PASSWORD_REQUIRED')),
      passwordConfirmation: yup.string()
        .max(constants.account.passwordMaxLength, t('errors.ERR_PASSWORD_TOO_LONG', { length: constants.account.passwordMaxLength }))
        .min(constants.account.passwordMinLength, t('errors.ERR_PASSWORD_TOO_SHORT', { length: constants.account.passwordMinLength }))
        .matches(constants.regex.lowercaseRegex, t('errors.ERR_PASSWORD_LOWERCASE'))
        .matches(constants.regex.uppercaseRegex, t('errors.ERR_PASSWORD_UPPERCASE'))
        .matches(constants.regex.numberRegex, t('errors.ERR_PASSWORD_NUMBER'))
        .oneOf([yup.ref('password'), ''], t('errors.ERR_PASSWORD_MISMATCH'))
        .required(t('errors.ERR_PASSWORD_CONFIRMATION_REQUIRED'))
    }),
    onSubmit: async (values: any, { resetForm }) => {
      setRegistering(true)

      if (tosAccepted) {
        axios.post(register, {
          username: values.username,
          email: values.email,
          password: values.password,
          acceptTos: tosAccepted,
          allowNewsLetter: values.allowNewsLetter,
          language: 'EN'
        }).then(function () {
          resetForm()
          // setRegisteredEmail(values.email)
        }).catch(function () {
        })
      } else {
        setTosError(true)
        await dispatch(setNotification({ message: t('errors.ERR_ACCEPT_TOS_REQUIRED'), severity: 'error' }))
      }
      setRegistering(false)
    }
  })

  return (
    <>
    <Modal showModal={showTos} setShowModal={setShowTos}>
      <Tos />
    </Modal>
    <div className="bg-blue-100">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="/"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          Yomiko
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 shadow-lg">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              {t('pages.register.title')}
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={formik.handleSubmit}
            >
              {/* Email field */}
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
              {/* Username field */}
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  {t('misc.username')}
                </label>
                <input
                  className={`${
                    formik.touched.username && formik.errors.username
                      ? 'bg-red-300 border-red-500 text-red-700'
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  } border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                  id="username"
                  name="username"
                  type="text"
                  placeholder="tanaka-kun"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.username}
                />
                {formik.touched.username && formik.errors.username
                  ? (
                  <div className="text-xs font-medium text-red-700 mt-1">
                    {formik.errors.username as string}
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
              {/* Confirm password field */}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  {t('misc.passwordConfirm')}
                </label>
                <input
                  className={`${
                    formik.touched.passwordConfirmation && formik.errors.passwordConfirmation
                      ? 'bg-red-300 border-red-500 text-red-700'
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  } border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  type="password"
                  placeholder="••••••••"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.passwordConfirmation}
                />
                {formik.touched.passwordConfirmation && formik.errors.passwordConfirmation
                  ? (
                  <div className="text-xs font-medium text-red-700 mt-1">
                    {formik.errors.passwordConfirmation as string}
                  </div>
                    )
                  : null}
              </div>
              {/* Remember me and login button */}
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      onClick={() => {
                        setTosAccepted(!tosAccepted)
                        setTosError(false)
                      }}
                      checked={tosAccepted}
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="remember"
                      className={`${tosError ? 'text-red-600' : 'text-gray-500'} dark:text-gray-300`}
                    >
                      {t('pages.register.agreeWith')} {' '}
                    </label>
                      <button className={`${tosError ? 'text-red-600' : ''} font-bold dark:text-gray-300 hover:underline`} onClick={(e) => {
                        e.preventDefault()
                        setShowTos(true)
                      }}>
                      {t('pages.register.TOS')}
                      </button>
                  </div>
                </div>
              </div>
              <button
                disabled={registering}
                type="submit"
                className="w-full text-white bg-blue-500 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700"
              >
                {registering ? (<Spinner text={t('pages.register.registering')} />) : t('pages.register.registerButton')}
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                <Link
                  to={routes.login}
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  {t('pages.register.haveAccount')}
                </Link>
              </p>
            </form>
            {/* 3rd party auth */}
            <div className="flex items-center mb-3">
              <hr className="h-0 border-b border-solid border-grey-500 grow" />
              <p className="mx-4 text-grey-600">{t('pages.login.or')}</p>
              <hr className="h-0 border-b border-solid border-grey-500 grow" />
            </div>
            <button disabled={showTos || registering} className="flex items-center justify-center w-full py-4 mb-6 text-sm font-medium transition duration-300 rounded-2xl text-grey-900 bg-gray-200 hover:bg-gray-300 hover:scale-105 transform active:scale-95 transition-transform">
              <img
                className="h-5 mr-2"
                src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/logos/logo-google.png"
                alt=""
              />
              {t('pages.register.googleRegister')}
            </button>
            <button disabled={showTos || registering} className="flex items-center justify-center w-full py-4 mb-6 text-sm font-medium transition duration-300 rounded-2xl text-grey-900 bg-gray-200 hover:bg-gray-300 hover:scale-105 transform active:scale-95 transition-transform">
              <img
                className="h-5 mr-2"
                src="https://cdn.iconscout.com/icon/free/png-256/free-facebook-logo-2019-1597680-1350125.png"
                alt=""
              />
              {t('pages.register.facebookRegister')}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
