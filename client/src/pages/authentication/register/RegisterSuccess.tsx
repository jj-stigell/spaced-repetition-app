import * as React from 'react'

// Third party imports
import { Box, Link } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

// Project imports
import { constants } from '../../../config/constants'
import { login } from '../../../config/path'

function RegisterSuccess ({ email }: { email: string }): JSX.Element {
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
        {t('register.success', { email, redirectTimeout: constants.redirectTimeout })}
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

export default RegisterSuccess
