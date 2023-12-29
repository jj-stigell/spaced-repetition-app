import React, { useState } from 'react'

import * as yup from 'yup'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import { Link } from 'react-router-dom'

import { useAppDispatch } from 'src/app/hooks'
import { constants } from 'src/config/constants'
import axios from 'src/lib/axios'
import { register } from 'src/config/api'
import { setNotification } from 'src/features/notificationSlice'
import Tos from '../../tos'
import routes from 'src/config/routes'
import Modal from 'src/components/Modal'
import Button from 'src/components/Button'
import InputField from 'src/components/InputField'

interface IFormValues {
  email: string
  username: string
  password: string
  passwordConfirmation: string
  allowNewsLetter: boolean
  language: string
}

interface IRegister {
  setRegisteredEmail: (email: string) => void
}

export default function Register ({ setRegisteredEmail }: IRegister): React.JSX.Element {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [registering, setRegistering] = useState<boolean>(false)
  const [tosAccepted, setTosAccepted] = useState<boolean>(false)
  const [tosError, setTosError] = useState<boolean>(false)
  const [showTos, setShowTos] = useState<boolean>(false)

  const toggleModal = (): void => {
    setShowTos(!showTos)
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      username: '',
      password: '',
      passwordConfirmation: '',
      language: '',
      allowNewsLetter: false
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
    onSubmit: (values: IFormValues, { resetForm }) => {
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
          setRegisteredEmail(values.email)
        }).catch(function () {
        })
      } else {
        setTosError(true)
        void dispatch(setNotification({ message: t('errors.ERR_ACCEPT_TOS_REQUIRED'), severity: 'error' }))
      }
      setRegistering(false)
    }
  })

  return (
    <>
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
        {/* Username field */}
        <InputField
          id='username'
          type='text'
          name='username'
          label={t('misc.username')}
          placeholder='tanaka-kun'
          value={formik.values.username}
          errors={formik.errors.username}
          fieldTouched={formik.touched.username}
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
        {/* Confirm password field */}
        <InputField
          id='passwordConfirmation'
          type='password'
          name='passwordConfirmation'
          label={t('misc.passwordConfirm')}
          placeholder='••••••••'
          value={formik.values.passwordConfirmation}
          errors={formik.errors.passwordConfirmation}
          fieldTouched={formik.touched.passwordConfirmation}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
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
              <label htmlFor="remember" className={`${tosError ? 'text-red-600' : 'text-gray-500'} dark:text-gray-300`}>
                {t('pages.register.agreeWith')} {' '}
              </label>
                <Link to={routes.tos} className={`${tosError ? 'text-red-600' : ''} font-bold dark:text-gray-300 hover:underline`}>
                  {t('pages.register.TOS')}
                </Link>
            </div>
          </div>
        </div>
        <Button
          type='submit'
          loading={registering}
          disabled={registering}
          loadingText={t('pages.register.registering')}
          buttonText={t('pages.register.registerButton')}
        />
        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          <Link to={routes.login} className="font-medium text-primary-600 hover:underline dark:text-primary-500">
            {t('pages.register.haveAccount')}
          </Link>
        </p>
      </form>
      {/* 3rd party auth, disabled currently */}
      {/*
      <div className="flex items-center mb-3">
        <hr className="h-0 border-b border-solid border-grey-500 grow" />
        <p className="mx-4 text-grey-600">{t('pages.login.or')}</p>
        <hr className="h-0 border-b border-solid border-grey-500 grow" />
      </div>
      <button disabled={showTos || registering} className="flex items-center justify-center w-full py-4 mb-6 text-sm font-medium transition duration-300 rounded-2xl text-grey-900 bg-gray-200 hover:bg-gray-300 hover:scale-105 transform active:scale-95 transition-transform">
        <img
          className="h-5 mr-2"
          src="https://tailus.io/sources/blocks/social/preview/images/google.svg"
          alt="google-logo"
        />
        {t('pages.register.googleRegister')}
      </button>
      <button disabled={showTos || registering} className="flex items-center justify-center w-full py-4 mb-6 text-sm font-medium transition duration-300 rounded-2xl text-grey-900 bg-gray-200 hover:bg-gray-300 hover:scale-105 transform active:scale-95 transition-transform">
        <img
          className="h-5 mr-2"
          src="https://upload.wikimedia.org/wikipedia/en/0/04/Facebook_f_logo_%282021%29.svg"
          alt="facebook-logo"
        />
        {t('pages.register.facebookRegister')}
      </button>
      */}
    </>
  )
}
