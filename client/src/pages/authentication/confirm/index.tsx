import * as React from 'react'

// Third party imports
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Typography } from '@mui/material'

// Project imports
import CircularLoader from '../../../components/CircularLoader'
import ConfirmSuccess from './ConfirmSuccess'
import ReconfirmForm from './ReconfirmForm'

function Confirm (): JSX.Element {
  const [confirmInProsess, setConfirmInProsess] = React.useState<boolean>(true)
  const [confirmSuccess, setConfirmSuccess] = React.useState<boolean>(false)
  const { confirmId } = useParams()
  const { t } = useTranslation()

  React.useEffect(() => {
    // call api and check if the code is active and not confirmed
    // if confirm succes, give message and redirect to login
    // if expired give error message and offer resend
    setTimeout(() => {
      console.log('ID from params is:', confirmId)

      // After API call done
      setConfirmInProsess(false)

      // Set success based on API response
      setConfirmSuccess(true)
    }, 3000)
  }, [])

  return (
    <>
      <Typography component="h1" variant="h5" sx={{ marginTop: 2, marginBottom: 5, textAlign: 'center' }}>
        { confirmInProsess ? t('confirm.title') : (confirmSuccess ? t('confirm.successTitle') : t('confirm.failureTitle'))}
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
