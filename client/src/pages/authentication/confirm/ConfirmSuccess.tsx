import * as React from 'react'

// Third party imports
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Box, Link } from '@mui/material'

// Project imports
import { constants } from '../../../config/constants'
import { login } from '../../../config/path'

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
        {t('confirm.success', { redirectTimeout: constants.redirectTimeout })}
      </Box>
      <Box sx={{ mt: 4 }}>
        {t('misc.redirectMessage')}
        <Link href={login} variant="body2">
          {t('misc.clickHere')}
        </Link>
      </Box>
    </div>
  )
}

export default ConfirmSuccess
