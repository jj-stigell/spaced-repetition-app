import * as React from 'react'

import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import * as yup from 'yup'

import { constants } from '../../../config/constants'
import { resendConfirmation } from '../../../config/api'
import axios from '../../../lib/axios'
import InputField from 'src/components/InputField'
import Button from 'src/components/Button'
import routes from 'src/config/routes'

interface IFormValues {
  email: string
}

interface IForm {
  setSuccess: (value: boolean) => void
}

function ReconfirmForm ({ setSuccess }: IForm): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
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
      axios.post(resendConfirmation, {
        email: values.email
      }).then(function () {
        setSuccess(true)

        setTimeout(() => {
          navigate(routes.login)
        }, constants.redirectTimeout * 1000)
      }).catch(function () {
        setSuccess(false)
      }).finally(function () {
        setProcessing(false)
      })
    }
  })

  return (
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
        loadingText={t('pages.confirm.resend.processing')}
        buttonText={t('pages.confirm.resend.resendConfirmButton')}
      />
      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
        <Link to={routes.login} className="font-medium text-primary-600 hover:underline dark:text-primary-500">{t('pages.login.linkToLogin')}</Link>
      </p>
    </form>
  )
}

export default ReconfirmForm
