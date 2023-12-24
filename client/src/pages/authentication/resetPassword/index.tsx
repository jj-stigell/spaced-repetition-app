import React, { useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import { Link, redirect } from 'react-router-dom'

import Form from './Form'
import { constants } from 'src/config/constants'
import routes from 'src/config/routes'

export default function ResetPassword (): React.JSX.Element {
  const { t } = useTranslation()
  const [success, setSuccess] = React.useState<boolean>(false)

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        redirect(routes.login)
      }, constants.redirectTimeout)
    }
  }, [success])

  return (
    <div className="bg-blue-100">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <Link to="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">{constants.appName}</Link>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 shadow-lg">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              {t('pages.password.resetPassword.title')}
            </h1>
            { success
              ? <div className="flex flex-col items-center justify-center text-lg font-medium mt-1 text-center">
                  <img alt="email succesfully sent" src="https://i.ibb.co/rvc8sTp/protected-file.gif" width="90" />
                  {t('pages.password.resetPassword.successTitle', { redirectTimeout: constants.redirectTimeout })}
                  <p className="text-base mt-4 font-light text-gray-500 dark:text-gray-400">
                    <Link to={routes.login} className="font-medium text-primary-600 hover:underline dark:text-primary-500">{t('pages.login.linkToLogin')}</Link>
                  </p>
                </div>
              : <Form setSuccess={setSuccess} />
            }
          </div>
        </div>
      </div>
    </div>
  )
}
