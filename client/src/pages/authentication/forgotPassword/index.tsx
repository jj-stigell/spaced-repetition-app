import * as React from 'react'

// Third party imports
import { Box } from '@mui/system'
import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined'
import { Grid, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

// Project imports
import ResetForm from './Form'
import { login } from '../../../config/path'

function ForgotPassword (): JSX.Element {
  const [resetInProcess, setResetInProcess] = React.useState<boolean>(false)
  const [success, setSuccess] = React.useState<boolean>(false)
  const { t } = useTranslation()

  return (
    <>
      <Typography component="h1" variant="h5" sx={{ marginTop: 2, marginBottom: 5, textAlign: 'center' }}>
        {t('password.forgotPassword.title')}
      </Typography>
      { success
        ? <Box sx={{ textAlign: 'center' }}>
          <DoneOutlineOutlinedIcon sx={{ color: 'green', fontSize: 50 }}/>
          <Typography component="h4" variant="h5" sx={{ marginTop: 2, marginBottom: 5 }}>
            {t('password.forgotPassword.successTitle')}
          </Typography>
          <Link to={login}>
            {t('login.linkToLogin')}
          </Link>
        </Box>
        : <Box sx={{ opacity: resetInProcess ? 0.2 : 1.0 }}>
          <ResetForm setResetInProcess={setResetInProcess} setSuccess={setSuccess}/>
          <Grid container>
            <Grid item>
              <Link to={login}>
                {t('login.linkToLogin')}
              </Link>
            </Grid>
          </Grid>
        </Box>
      }
    </>
  )
}

export default ForgotPassword
