import React from 'react'

// Third party imports
import { useTranslation } from 'react-i18next'
import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material'
import {
  DashboardOutlined,
  LogoutOutlined,
  InsightsOutlined,
  MenuBookOutlined,
  SettingsApplicationsOutlined
} from '@mui/icons-material'

// Project imports
import Logo from '../components/Logo'
import { useAppDispatch } from '../app/hooks'
import { resetAccount } from '../features/account/accountSlice'

function SideMenu (): JSX.Element {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const handleLogout = (): void => {
    dispatch(resetAccount({}))
  }

  return (
    <div>
      <Logo fontSize={40}/>
      <Toolbar />
      <Divider />
      <List>
        <ListItem key='dashboard' disablePadding>
          <ListItemButton href="/">
            <ListItemIcon>
              <DashboardOutlined />
            </ListItemIcon>
            <ListItemText primary={t('sidemenu.dashboard')} />
          </ListItemButton>
        </ListItem>
        <ListItem key='study' disablePadding>
          <ListItemButton href="/study">
            <ListItemIcon>
              <MenuBookOutlined />
            </ListItemIcon>
            <ListItemText primary={t('sidemenu.study')} />
          </ListItemButton>
        </ListItem>
        <ListItem key='statistics' disablePadding>
          <ListItemButton href="/statistics">
            <ListItemIcon>
              <InsightsOutlined />
            </ListItemIcon>
            <ListItemText primary={t('sidemenu.statistics')} />
          </ListItemButton>
        </ListItem>
        <ListItem key='settings' disablePadding>
          <ListItemButton href="/settings">
            <ListItemIcon>
              <SettingsApplicationsOutlined />
            </ListItemIcon>
            <ListItemText primary={t('sidemenu.settings')} />
          </ListItemButton>
        </ListItem>
        <ListItem key='logout' disablePadding onClick={() => { handleLogout() }}>
          <ListItemButton>
            <ListItemIcon>
              <LogoutOutlined />
            </ListItemIcon>
            <ListItemText primary={t('sidemenu.logout')} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  )
}

export default SideMenu
