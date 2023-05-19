import * as React from 'react'

// Third party imports
import { useTranslation } from 'react-i18next'
import { Typography } from '@mui/material'

// Project imports
import RegisterSuccess from './RegisterSuccess'
import RegisterForm from './RegisterForm'

function Register (): JSX.Element {
  const { t } = useTranslation()

  const [registeredEmail, setRegisteredEmail] = React.useState<string | null>(null)

  return (
    <>
      <Typography component="h1" variant="h5" textAlign='center'>
        { (registeredEmail != null) ? t('pages.register.successTitle') : t('pages.register.title')}
      </Typography>
      { (registeredEmail != null)
        ? <RegisterSuccess email={registeredEmail}/>
        : <RegisterForm
            setRegisteredEmail={setRegisteredEmail}
          />
      }
    </>
  )
}

export default Register
