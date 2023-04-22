import * as React from 'react'

// Third party imports
import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

// Project imports
import ResetForm from './Form'

function ForgotPassword (): JSX.Element {
  const { t } = useTranslation()

  return (
    <>
      <Typography component="h1" variant="h5" sx={{ marginTop: 2, marginBottom: 5, textAlign: 'center' }}>
        {t('confirm.title')}
      </Typography>
      <ResetForm />
    </>
  )
}

export default ForgotPassword
