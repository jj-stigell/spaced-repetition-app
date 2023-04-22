import * as React from 'react'

// Third party imports
import { Alert, Snackbar } from '@mui/material'
import { useAppSelector } from '../app/hooks'

// Project imports
import { RootState } from '../app/store'

function Notification (): JSX.Element {
  const notification = useAppSelector((state: RootState) => state.notification)
  const [showNotification, setShowNotification] = React.useState<boolean>(false)

  React.useEffect(() => {
    setShowNotification(notification.showNotification)
  }, [notification])

  return (
    <Snackbar
      open={showNotification}
      autoHideDuration={notification.autoHideDuration}
      onClose={() => { setShowNotification(false) }}
      anchorOrigin={{ vertical: notification.anchorOrigin.vertical, horizontal: notification.anchorOrigin.horizontal }}
    >
      <Alert onClose={() => { setShowNotification(false) }} severity={notification.severity} sx={{ width: '100%' }}>
        {notification.message}
      </Alert>
    </Snackbar>
  )
}

export default Notification
