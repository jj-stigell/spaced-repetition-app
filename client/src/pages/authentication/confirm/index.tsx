
// https://i.ibb.co/D4cQhYS/Happy-customer.gif

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
      }).catch(function (error) {
        setSuccess(false)
        let errorCode: string | undefined

        if (Array.isArray(error?.response?.data?.errors)) {
          errorCode = error?.response?.data?.errors[0].code
        }

        if (errorCode !== undefined) {
          switch (errorCode) {
            case 'ERR_EMAIL_NOT_FOUND':
              return redirect(routes.login)
            case 'ERR_EMAIL_ALREADY_CONFIRMED':
              return redirect(routes.login)
            case 'ERR_CONFIRMATION_ID_NOT_FOUND':
              break
            default:
              break
          }
        }
      }).finally(function () {
        setProcessing(false)
      })
    }
  }, [])

  useEffect(() => {
    if (success && !processing) {
      setTimeout(() => {
        redirect(routes.login)
      }, constants.redirectTimeout)
    }
  }, [success, processing])

  return (
    <div className="bg-blue-100">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <Link to="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">{constants.appName}</Link>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 shadow-lg">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              { processing ? t('pages.confirm.title') : (success ? t('pages.confirm.successTitle') : t('pages.confirm.failureTitle'))}
            </h1>
            { success
              ? <div className="flex flex-col items-center justify-center text-lg font-medium mt-1 text-center">
                  <img alt="email confirmation success" src="https://i.ibb.co/D4cQhYS/Happy-customer.gif" width="90" />
                    {t('pages.confirm.success', { redirectTimeout: constants.redirectTimeout })}
                  <p className="text-base mt-4 font-light text-gray-500 dark:text-gray-400">
                    <Link to={routes.login} className="font-medium text-primary-600 hover:underline dark:text-primary-500">{t('pages.login.linkToLogin')}</Link>
                  </p>
                </div>
              : <ReconfirmForm setSuccess={setSuccess} />
            }
          </div>
        </div>
      </div>
    </div>
  )
}

/*
function ConfirmSuccess (): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()

  React.useEffect(() => {
    setTimeout(() => {
      navigate(login)
    }, constants.redirectTimeout * 1000)
  }, [])

  return (
    <div style={{ textAlign: 'center' }}>
      <Box sx={{ mt: 4 }}>
        {t('pages.confirm.success', { redirectTimeout: constants.redirectTimeout })}
      </Box>
      <Box sx={{ mt: 4 }}>
        {t('misc.redirectMessage')}
        <Link to={login}>
          {t('misc.clickHere')}
        </Link>
      </Box>
    </div>
  )
}

    "confirm": {
      "title": "Confirming email address",
      "successTitle": "Email address confirmed!",
      "failureTitle": "Email address confirmation failed",
      "success": "Your email address confirmation was successful. Redirecting to login page in {{redirectTimeout}} seconds.",
      "resend": {
        "resendConfirmButton": "Resend confirmation code",
        "resendConfirmDescription": "Confirmation failed, please resend the confirmation by entering your email address below.",
        "resendSuccess": "New confirmation code sent to email address {{email}}. Redirecting to login page in {{redirectTimeout}} seconds."
      }
    },

function Confirm (): JSX.Element {
  const { confirmationId } = useParams()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [confirmInProsess, setConfirmInProsess] = React.useState<boolean>(confirmationId != null)
  const [confirmSuccess, setConfirmSuccess] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (confirmInProsess) {
      axios.post(confirmEmail, {
        confirmationId
      })
        .then(function () {
          setConfirmSuccess(true)
          setConfirmInProsess(false)
        })
        .catch(function (error) {
          let errorCode: string | null = null

          if (Array.isArray(error?.response?.data?.errors)) {
            errorCode = error?.response?.data?.errors[0].code
          }

          if (errorCode != null) {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            dispatch(setNotification({ message: t(`errors.${errorCode}`), severity: 'error' }))

            if (errorCode === 'ERR_EMAIL_ALREADY_CONFIRMED') {
              navigate(login)
            }
          } else if (error instanceof AxiosError) {
            dispatch(setNotification({ message: error.message, severity: 'error' }))
          } else {
            dispatch(setNotification({ message: t('errors.ERR_CHECK_CONNECTION'), severity: 'error' }))
          }
          setConfirmInProsess(false)
        })
    }
  }, [])

  return (
    <>
      <Typography component="h1" variant="h5" sx={{ marginTop: 2, marginBottom: 5, textAlign: 'center' }}>
        { confirmInProsess ? t('pages.confirm.title') : (confirmSuccess ? t('pages.confirm.successTitle') : t('pages.confirm.failureTitle'))}
      </Typography>
      { confirmInProsess
        ? <CircularLoader />
        : <>
        { confirmSuccess
          ? <ConfirmSuccess />
          : <ReconfirmForm />
        }
        </>
      }
    </>
  )
}
*/
