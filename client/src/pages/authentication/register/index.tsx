import React, { useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import { Link, redirect } from 'react-router-dom'

import routes from 'src/config/routes'
import Form from './Form'
import { constants } from 'src/config/constants'

export default function Register (): React.JSX.Element {
  const { t } = useTranslation()
  const [registeredEmail, setRegisteredEmail] = React.useState<string | null>(null)

  useEffect(() => {
    if (registeredEmail != null) {
      setTimeout(() => {
        return redirect(routes.login)
      }, constants.redirectTimeout)
    }
  }, [registeredEmail])

  return (
    <>
      <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
        { (registeredEmail != null) ? t('pages.register.successTitle') : t('pages.register.title') }
      </h1>
      { (registeredEmail != null)
        ? <div className="flex flex-col items-center justify-center text-lg font-medium mt-1 text-center">
            <img alt="email succesfully sent" src="https://i.ibb.co/0yy4Jpn/Confetti.gif" width="90" />
              <div className='mt-4'>{t('pages.register.success', { email: registeredEmail, redirectTimeout: constants.redirectTimeout })}</div>
            <p className="text-base mt-4 font-light text-gray-500 dark:text-gray-400">
              <Link to={routes.login} className="font-medium text-primary-600 hover:underline dark:text-primary-500">{t('pages.login.linkToLogin')}</Link>
            </p>
          </div>
        : <Form setRegisteredEmail={setRegisteredEmail} />
      }
    </>
  )
}
