import * as React from 'react'

// Third party imports
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Typography } from '@mui/material'

// Project imports
import CircularLoader from '../../../components/CircularLoader'
import ConfirmSuccess from './ConfirmSuccess'
import ReconfirmForm from './ReconfirmForm'
import axios from '../../../lib/axios'
import { confirmEmail } from '../../../config/api'
import { useAppDispatch } from '../../../app/hooks'
import { setNotification } from '../../../features/notificationSlice'
import { AxiosError } from 'axios'
import { login } from '../../../config/path'

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
          console.log('error encountered', error)
          const errorCode: string | null = error?.response?.data?.errors[0].code

          if (errorCode != null) {
            // TODO: what if there are multiple errors.
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

export default Confirm
