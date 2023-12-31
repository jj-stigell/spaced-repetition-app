import React, { useState } from 'react'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'

import axios from 'src/lib/axios'
import Button from 'src/components/Button'
import InputField from 'src/components/InputField'
import { useAppDispatch } from 'src/app/hooks'
import { setPassword } from 'src/config/api'
import { constants } from 'src/config/constants'
import { setNotification } from 'src/features/notificationSlice'

export default function ChangePassword (): React.JSX.Element {
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
      currentPassword: yup.string()
        .required(t('errors.ERR_PASSWORD_REQUIRED')),
      newPassword: yup.string()
        .max(constants.account.passwordMaxLength, t('errors.ERR_PASSWORD_TOO_LONG', { length: constants.account.passwordMaxLength }))
        .min(constants.account.passwordMinLength, t('errors.ERR_PASSWORD_TOO_SHORT', { length: constants.account.passwordMinLength }))
        .matches(constants.regex.lowercaseRegex, t('errors.ERR_PASSWORD_LOWERCASE'))
        .matches(constants.regex.uppercaseRegex, t('errors.ERR_PASSWORD_UPPERCASE'))
        .matches(constants.regex.numberRegex, t('errors.ERR_PASSWORD_NUMBER'))
        .notOneOf([yup.ref('currentPassword'), ''], t('errors.ERR_PASSWORD_CURRENT_AND_NEW_EQUAL'))
        .required(t('errors.ERR_PASSWORD_REQUIRED')),
      passwordConfirmation: yup.string()
        .max(constants.account.passwordMaxLength, t('errors.ERR_PASSWORD_TOO_LONG', { length: constants.account.passwordMaxLength }))
        .min(constants.account.passwordMinLength, t('errors.ERR_PASSWORD_TOO_SHORT', { length: constants.account.passwordMinLength }))
        .matches(constants.regex.lowercaseRegex, t('errors.ERR_PASSWORD_LOWERCASE'))
        .matches(constants.regex.uppercaseRegex, t('errors.ERR_PASSWORD_UPPERCASE'))
        .matches(constants.regex.numberRegex, t('errors.ERR_PASSWORD_NUMBER'))
        .oneOf([yup.ref('newPassword'), ''], t('errors.ERR_PASSWORD_MISMATCH'))
        .required(t('errors.ERR_PASSWORD_CONFIRMATION_REQUIRED'))
    }),
    onSubmit: (values: any, { resetForm }) => {
      setUpdating(true)
      axios.patch(setPassword, {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      }).then(function () {
        resetForm()
        void dispatch(setNotification({ message: t('pages.settings.changePassword.passwordChangeSuccess'), severity: 'success' }))
        setUpdating(false)
      }).catch(function () {
        setUpdating(false)
      })
    }
  })

  return (
    <>
      <p className="mb-4 text-xl font-semibold">{t('pages.settings.changePassword.title')}</p>
      <form className="space-y-4 md:space-y-6" onSubmit={formik.handleSubmit}>
        {/* Current Password field */}
        <InputField
          id='currentPassword'
          type='password'
          name='currentPassword'
          label={t('misc.currentPassword')}
          placeholder='••••••••'
          value={formik.values.currentPassword}
          errors={formik.errors.currentPassword}
          fieldTouched={formik.touched.currentPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {/* New password field */}
        <InputField
          id='newPassword'
          type='password'
          name='newPassword'
          label={t('misc.newPassword')}
          placeholder='••••••••'
          value={formik.values.newPassword}
          errors={formik.errors.newPassword}
          fieldTouched={formik.touched.newPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {/* New password confirm field */}
        <InputField
          id='passwordConfirmation'
          type='password'
          name='passwordConfirmation'
          label={t('misc.confirmNewPassword')}
          placeholder='••••••••'
          value={formik.values.passwordConfirmation}
          errors={formik.errors.passwordConfirmation}
          fieldTouched={formik.touched.passwordConfirmation}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
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
