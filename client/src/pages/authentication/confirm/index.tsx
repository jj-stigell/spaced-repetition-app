import React, { useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import { Link, redirect, useParams } from 'react-router-dom'

import ReconfirmForm from './ReconfirmForm'
import { constants } from 'src/config/constants'
import routes from 'src/config/routes'
import axios from 'src/lib/axios'
import { confirmEmail } from 'src/config/api'

export default function ResetPassword (): React.JSX.Element {
  const { t } = useTranslation()
  const { confirmationId } = useParams()
  const [success, setSuccess] = React.useState<boolean>(false)
  const [processing, setProcessing] = React.useState<boolean>(confirmationId !== undefined)

  useEffect(() => {
    if (processing) {
      axios.post(confirmEmail, {
        confirmationId
      }).then(function () {
        setSuccess(true)
        setProcessing(false)
      }).catch(function () {
        setSuccess(false)
      }).finally(function () {
        setProcessing(false)
      })
    }
  }, [])

  useEffect(() => {
    if (success && !processing) {
      setTimeout(() => {
        return redirect(routes.login)
      }, constants.redirectTimeout)
    }
  }, [success, processing])

  return (
    <>
      <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
        { confirmationId === undefined ? t('pages.confirm.resend.title') : processing ? t('pages.confirm.title') : (success ? t('pages.confirm.successTitle') : t('pages.confirm.failureTitle'))}
      </h1>
      { success
        ? <div className="flex flex-col items-center justify-center text-lg font-medium mt-1 text-center">
            <img alt="email confirmation success" src="https://i.ibb.co/G9jzKkN/Happy-customer.gif" width="90" />
              {t('pages.confirm.success', { redirectTimeout: constants.redirectTimeout })}
            <p className="text-base mt-4 font-light text-gray-500 dark:text-gray-400">
              <Link to={routes.login} className="font-medium text-primary-600 hover:underline dark:text-primary-500">{t('pages.login.linkToLogin')}</Link>
            </p>
          </div>
        : <ReconfirmForm setSuccess={setSuccess} />
      }
    </>
  )
}
