/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'

import { useAppDispatch } from 'src/app/hooks'
import { setPassword } from 'src/config/api'
import { constants } from 'src/config/constants'
import { setNotification } from 'src/features/notificationSlice'
import axios from 'src/lib/axios'
import Button from 'src/components/Button'

export default function ChangePassword (): JSX.Element {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [updating, setUpdating] = useState(false)

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      passwordConfirmation: ''
    },
    validationSchema: yup.object({
      currentPassword: yup.string().required(t('errors.ERR_PASSWORD_REQUIRED')),
      newPassword: yup
        .string()
        .max(
          constants.account.passwordMaxLength,
          t('errors.ERR_PASSWORD_TOO_LONG', {
            length: constants.account.passwordMaxLength
          })
        )
        .min(
          constants.account.passwordMinLength,
          t('errors.ERR_PASSWORD_TOO_SHORT', {
            length: constants.account.passwordMinLength
          })
        )
        .matches(
          constants.regex.lowercaseRegex,
          t('errors.ERR_PASSWORD_LOWERCASE')
        )
        .matches(
          constants.regex.uppercaseRegex,
          t('errors.ERR_PASSWORD_UPPERCASE')
        )
        .matches(constants.regex.numberRegex, t('errors.ERR_PASSWORD_NUMBER'))
        .notOneOf(
          [yup.ref('currentPassword'), ''],
          t('errors.ERR_PASSWORD_CURRENT_AND_NEW_EQUAL')
        )
        .required(t('errors.ERR_PASSWORD_REQUIRED')),
      passwordConfirmation: yup
        .string()
        .max(
          constants.account.passwordMaxLength,
          t('errors.ERR_PASSWORD_TOO_LONG', {
            length: constants.account.passwordMaxLength
          })
        )
        .min(
          constants.account.passwordMinLength,
          t('errors.ERR_PASSWORD_TOO_SHORT', {
            length: constants.account.passwordMinLength
          })
        )
        .matches(
          constants.regex.lowercaseRegex,
          t('errors.ERR_PASSWORD_LOWERCASE')
        )
        .matches(
          constants.regex.uppercaseRegex,
          t('errors.ERR_PASSWORD_UPPERCASE')
        )
        .matches(constants.regex.numberRegex, t('errors.ERR_PASSWORD_NUMBER'))
        .oneOf([yup.ref('newPassword'), ''], t('errors.ERR_PASSWORD_MISMATCH'))
        .required(t('errors.ERR_PASSWORD_CONFIRMATION_REQUIRED'))
    }),
    onSubmit: async (values: any, { resetForm }) => {
      setUpdating(true)
      axios
        .patch(setPassword, {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword
        })
        .then(async function () {
          resetForm()
          await dispatch(
            setNotification({
              message: t('pages.settings.changePassword.passwordChangeSuccess'),
              severity: 'success'
            })
          )
        })
        .catch(function () {
          setUpdating(false)
        })
    }
  })

  return (
    <>
      <p className="mb-4 text-xl font-semibold">
        {t('pages.settings.changePassword.title')}
      </p>
      <form className="space-y-4 md:space-y-6" onSubmit={formik.handleSubmit}>
        {/* Current Password field */}
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            {t('misc.currentPassword')}
          </label>
          <input
            className={`${
              formik.touched.currentPassword && formik.errors.currentPassword
                ? 'bg-red-300 border-red-500 text-red-700'
                : 'bg-gray-50 border-gray-300 text-gray-900'
            } border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
            id="currentPassword"
            name="currentPassword"
            type="password"
            placeholder="••••••••"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.currentPassword}
          />
          {formik.touched.currentPassword && formik.errors.currentPassword
            ? (
            <div className="text-xs font-medium text-red-700 mt-1">
              {formik.errors.currentPassword as string}
            </div>
              )
            : null}
        </div>
        {/* New password field */}
        <div>
          <label
            htmlFor="newPassword"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            {t('misc.newPassword')}
          </label>
          <input
            className={`${
              formik.touched.newPassword && formik.errors.newPassword
                ? 'bg-red-300 border-red-500 text-red-700'
                : 'bg-gray-50 border-gray-300 text-gray-900'
            } border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
            id="newPassword"
            name="newPassword"
            type="password"
            placeholder="••••••••"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.newPassword}
          />
          {formik.touched.newPassword && formik.errors.newPassword
            ? (
            <div className="text-xs font-medium text-red-700 mt-1">
              {formik.errors.newPassword as string}
            </div>
              )
            : null}
        </div>
        {/* New password confirm field */}
        <div>
          <label
            htmlFor="passwordConfirmation"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            {t('misc.confirmNewPassword')}
          </label>
          <input
            className={`${
              formik.touched.passwordConfirmation &&
              formik.errors.passwordConfirmation
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
          {formik.touched.passwordConfirmation &&
          formik.errors.passwordConfirmation
            ? (
            <div className="text-xs font-medium text-red-700 mt-1">
              {formik.errors.passwordConfirmation as string}
            </div>
              )
            : null}
        </div>
        <Button
          type='submit'
          loading={updating}
          disabled={updating}
          loadingText={t('pages.settings.changePassword.processing')}
          buttonText={t('pages.settings.changePassword.button')}
        />
      </form>
    </>
  )
}
