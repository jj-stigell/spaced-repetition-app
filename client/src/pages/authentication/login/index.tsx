import * as React from 'react'

// Third party imports
import { useTranslation } from 'react-i18next'
import { Typography } from '@mui/material'

// Project imports
import Form from './LoginForm'

function Login (): JSX.Element {
  const { t } = useTranslation()

  return (
    <>
      <Typography component="h1" variant="h5" textAlign='center'>
        {t('pages.login.title')}
      </Typography>
      <Form />
    </>
  )
}

export default Login
