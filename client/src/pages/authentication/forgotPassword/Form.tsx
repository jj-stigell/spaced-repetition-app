import React from 'react'

import * as yup from 'yup'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import { Link } from 'react-router-dom'

import { constants } from 'src/config/constants'
import axios from 'src/lib/axios'
import { resetPassword } from 'src/config/api'
import routes from 'src/config/routes'
import Button from 'src/components/Button'
import InputField from 'src/components/InputField'

interface IFormValues {
  email: string
}

interface IForm {
  setSuccess: (value: boolean) => void
}

export default function Form ({ setSuccess }: IForm): React.JSX.Element {
  const { t } = useTranslation()
  const [processing, setProcessing] = React.useState<boolean>(false)

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: yup.object({
      email: yup.string()
        .email(t('errors.ERR_NOT_VALID_EMAIL'))
        .max(constants.account.emailMaxLength, t('errors.ERR_EMAIL_TOO_LONG', { length: constants.account.emailMaxLength }))
        .required(t('errors.ERR_EMAIL_REQUIRED'))
    }),
    onSubmit: (values: IFormValues) => {
      setProcessing(true)
      axios.post(resetPassword, {
        email: values.email
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
          loading={processing}
          disabled={processing}
          loadingText={t('pages.password.forgotPassword.processing')}
          buttonText={t('pages.password.forgotPassword.resetButton')}
        />
        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
          <Link to={routes.login} className="font-medium text-primary-600 hover:underline dark:text-primary-500">{t('pages.login.linkToLogin')}</Link>
        </p>
      </form>
    </>
  )
}
