import * as React from 'react'

// Third party imports
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Box } from '@mui/material'

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

export default ConfirmSuccess
