import React from 'react'

// Third party imports
import { useTranslation } from 'react-i18next'
import Container from '@mui/material/Container'
import { experimentalStyled as styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'

// Project imports
import ChangePassword from './ChangePassword'
import Logout from './Logout'
import AccountInformation from './AccountInformation'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  ...theme.typography.body2,
  padding: theme.spacing(2),
  marginBottom: 10,
  textAlign: 'center',
  color: theme.palette.text.secondary
}))

function Settings (): JSX.Element {
  const { t } = useTranslation()

  return (
    <div id="settings-page" style={{ marginTop: 15 }}>
      <Container maxWidth="sm">
        <h1 style={{ textAlign: 'center' }}>
          {t('pages.settings.title')}
        </h1>
        <Item>
          <AccountInformation />
        </Item>
        <Item>
          <ChangePassword />
        </Item>
        <Logout />
      </Container>
    </div>
  )
}

export default Settings
