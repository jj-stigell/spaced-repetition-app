
import React from 'react'

import * as yup from 'yup'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import { Link, useParams } from 'react-router-dom'

import { constants } from 'src/config/constants'
import axios from 'src/lib/axios'
import { resetPassword } from 'src/config/api'
import routes from 'src/config/routes'
import Button from 'src/components/Button'
import InputField from 'src/components/InputField'

interface IFormValues {
  password: string
  passwordConfirmation: string
}

interface IForm {
  setSuccess: (value: boolean) => void
}

export default function Form ({ setSuccess }: IForm): React.JSX.Element {
  const { t } = useTranslation()
  const { confirmationId } = useParams()
  const [processing, setProcessing] = React.useState<boolean>(false)

  const formik = useFormik({
    initialValues: {
      password: '',
      passwordConfirmation: ''
    },
    validationSchema: yup.object({
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
    onSubmit: (values: IFormValues) => {
      setProcessing(true)
      axios.patch(resetPassword, {
        password: values.password,
        confirmationId
      }).then(function () {
        setSuccess(true)
      }).catch(function (error) {
        console.log(error)
      }).finally(function () {
        setProcessing(false)
      })
    }
  })

  return (
    <>
      <div className="my-4">
        {t('pages.password.forgotPassword.resetDescription', { redirectTimeout: constants.redirectTimeout })}
      </div>
      <form className="space-y-4 md:space-y-6" onSubmit={formik.handleSubmit}>
        <InputField
          id='password'
          type='password'
          name='password'
          label={t('misc.newPassword')}
          placeholder='••••••••'
          value={formik.values.password}
          errors={formik.errors.password}
          fieldTouched={formik.touched.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
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
          loading={processing}
          disabled={processing}
          loadingText={t('pages.password.resetPassword.processing')}
          buttonText={t('pages.password.resetPassword.resetButton')}
        />
        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          <Link to={routes.login} className="font-medium text-primary-600 hover:underline dark:text-primary-500">{t('pages.login.linkToLogin')}</Link>
        </p>
      </form>
    </>
  )
}
