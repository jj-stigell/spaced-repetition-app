import * as React from 'react'

// Third party imports
import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined'
import { Grid, Link, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

// Project imports
import CircularLoader from '../../../components/CircularLoader'
import { Box } from '@mui/system'
import ResetForm from './Form'

function ForgotPassword (): JSX.Element {
  const [resetInProcess, setResetInProcess] = React.useState<boolean>(false)
  const [success, setSuccess] = React.useState<boolean>(false)
  const { t } = useTranslation()

  return (
    <>
      <Typography component="h1" variant="h5" sx={{ marginTop: 2, marginBottom: 5, textAlign: 'center' }}>
        {t('password.forgotPassword.title')}
      </Typography>
      { success &&
        <Box sx={{ textAlign: 'center' }}>
          <DoneOutlineOutlinedIcon sx={{ color: 'green', fontSize: 50 }}/>
          <Typography component="h4" variant="h5" sx={{ marginTop: 2, marginBottom: 5 }}>
            {t('password.forgotPassword.successTitle')}
          </Typography>
        </Box>
    }
      { resetInProcess && <CircularLoader /> }
      { !success &&
        <Box sx={{ opacity: resetInProcess ? 0.2 : 1.0 }}>
          <ResetForm setResetInProcess={setResetInProcess} setSuccess={setSuccess}/>
          <Grid container>
            <Grid item>
              <Link href="/auth/login" variant="body2">
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
