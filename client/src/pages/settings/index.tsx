/* eslint-disable no-multiple-empty-lines */
/* eslint-disable no-trailing-spaces */
import React from 'react'

// Third party imports
import { AxiosError } from 'axios'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import { experimentalStyled as styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

// Project imports
import { useAppDispatch } from '../../app/hooks'
import { logout } from '../../config/api'
import { setLogin } from '../../features/account/accountSlice'
import { setNotification } from '../../features/notification/notificationSlice'
import axios from '../../lib/axios'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(6),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  '&:hover': {
    backgroundColor: '#ddd'
  }
}))

function Settings (): JSX.Element {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const handleLogout = (): void => {
    axios.post(logout)
      .then(function () {
        dispatch(setLogin(false))
      })
      .catch(function (error) {
        console.log('error encountered', error)
        const errorCode: string | null = error?.response?.data?.errors[0].code

        if (errorCode != null) {
          // TODO: what if there are multiple errors.
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          dispatch(setNotification({ message: t(`errors.${errorCode}`), severity: 'error' }))
        } else if (error instanceof AxiosError) {
          dispatch(setNotification({ message: error.message, severity: 'error' }))
        } else {
          dispatch(setNotification({ message: t('errors.ERR_CHECK_CONNECTION'), severity: 'error' }))
        }
      })
  }

  return (
    <div id="settings-page" style={{ marginTop: 15 }}>
    <CssBaseline />
    <Container maxWidth="sm">
    <h1>{t('settings.title')}</h1>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, sm: 2, md: 2 }}>
            <Grid item xs={2} sm={4} md={4} key={1}>
              <Item onClick={() => { console.log('djsfklsdjlfk') } }>something</Item>
            </Grid>
        </Grid>
      </Box>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        onClick={handleLogout}
        sx={{ mt: 3, mb: 2 }}
      >
        {t('buttonGeneral.logout')}
      </Button>
    </Container>
    </div>
  )
}

export default Settings

/*

  "settings": {
    "title": "Account information"
    "email": "Email address"
    "username": "Username"
    "changePasswordTitle": "Change password"

    // cancel news email

      "misc": {
    "username": "Username",
    "email": "Email address",
    "password": "Password",
    "passwordConfirm": "Confirm password",
    "passwordForgot": "Forgot Password?",
    "currentPassword": "Current password",
    "newPassword": "New password",
    "confirmNewPassword": "Confirm new password


    <div id="error-page">
      <h1>Settings</h1>
      <p>This is settings page</p>
      <SubmitButton
        type="submit"
        fullWidth
        variant="contained"
        onClick={handleLogout}
        sx={{ mt: 3, mb: 2 }}
      >
        {t('buttonGeneral.logout')}
      </Button>
    </div>

*/
