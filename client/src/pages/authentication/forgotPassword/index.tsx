import React from 'react'

import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import Form from './Form'
import routes from 'src/config/routes'

export default function ForgotPassword (): React.JSX.Element {
  const { t } = useTranslation()
  const [success, setSuccess] = React.useState<boolean>(false)

  return (
    <>
      <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
        {t('pages.password.forgotPassword.title')}
      </h1>
      { success
        ? <div className="flex flex-col items-center justify-center text-lg font-medium mt-1 text-center">
            <img alt="email succesfully sent" src="https://i.ibb.co/C6kfLm4/Email-file.gif" width="90" />
            {t('pages.password.forgotPassword.successTitle')}
            <p className="text-base mt-4 font-light text-gray-500 dark:text-gray-400">
              <Link to={routes.login} className="font-medium text-primary-600 hover:underline dark:text-primary-500">{t('pages.login.linkToLogin')}</Link>
            </p>
          </div>
        : <Form setSuccess={setSuccess} />
      }
    </>
  )
}
