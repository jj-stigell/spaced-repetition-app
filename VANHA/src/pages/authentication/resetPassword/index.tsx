import * as React from 'react'

// Third party imports
import { useTranslation } from 'react-i18next'
import { Typography } from '@mui/material'

// Project imports
import ResetForm from './Form'

function ForgotPassword (): JSX.Element {
  const { t } = useTranslation()

  return (
    <>
      <Typography component="h1" variant="h5" sx={{ marginTop: 2, marginBottom: 5, textAlign: 'center' }}>
        {t('pages.password.resetPassword.title')}
      </Typography>
      <ResetForm />
    </>
  )
}

export default ForgotPassword
