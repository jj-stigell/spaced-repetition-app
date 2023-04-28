import React from 'react'

// Third party imports
import { AxiosError } from 'axios'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'

// Project imports
import { useAppDispatch } from '../../app/hooks'
import { logout } from '../../config/api'
import { initialState, setAccount } from '../../features/accountSlice'
import { setNotification } from '../../features/notificationSlice'
import axios from '../../lib/axios'

function Logout (): JSX.Element {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const handleLogout = (): void => {
    axios.post(logout)
      .catch(function (error) {
        console.log('error encountered', error)
        const errorCode: string | null = error?.response?.data?.errors[0]?.code

        if (errorCode != null) {
          // TODO: what if there are multiple errors.
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          dispatch(setNotification({ message: t(`errors.${errorCode}`), severity: 'error' }))
        } else if (error instanceof AxiosError) {
          dispatch(setNotification({ message: error.message, severity: 'error' }))
        } else {
          dispatch(setNotification({ message: t('errors.ERR_CHECK_CONNECTION'), severity: 'error' }))
        }
      }).finally(function () {
        dispatch(setAccount(initialState))
      })
  }

  return (
    <Button
      type="submit"
      fullWidth
      variant="contained"
      onClick={handleLogout}
      sx={{ mt: 3, mb: 2 }}
    >
      {t('buttonGeneral.logout')}
    </Button>
  )
}

export default Logout
