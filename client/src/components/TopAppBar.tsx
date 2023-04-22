/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import AdbIcon from '@mui/icons-material/Adb'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { constants } from '../config/constants'

const pages = ['dashboard', 'study', 'statistics', 'settings']

function TopAppBar (): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorElNav(event.currentTarget)
  }

  const handleCloseNavMenu = (): void => {
    setAnchorElNav(null)
  }

  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            {constants.appName}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' }
              }}
            >
              <MenuItem key='dashboard' onClick={() => {
                handleCloseNavMenu()
                navigate('/')
              }}>
                <Typography textAlign="center" color="inherit">
                  {t('sidemenu.dashboard')}
                </Typography>
              </MenuItem>

              <MenuItem key='study' onClick={() => {
                handleCloseNavMenu()
                navigate('/study')
              }}>
                <Typography textAlign="center" color="inherit">
                  {t('sidemenu.study')}
                </Typography>
              </MenuItem>
              <MenuItem key='statistics' onClick={() => {
                handleCloseNavMenu()
                navigate('/statistics')
              }}>
                <Typography textAlign="center" color="inherit">
                  {t('sidemenu.statistics')}
                </Typography>
              </MenuItem>
              <MenuItem key='settings' onClick={() => {
                handleCloseNavMenu()
                navigate('/settings')
              }}>
                <Typography textAlign="center" color="inherit">
                  {t('sidemenu.settings')}
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none'
            }}
          >
            {constants.appName}
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              key='dashboard'
              onClick={() => {
                handleCloseNavMenu()
                navigate('/')
              }}
              sx={{ my: 2, color: 'inherit', display: 'block' }}
            >
              {t('sidemenu.dashboard')}
            </Button>
            <Button
              key='study'
              onClick={() => {
                handleCloseNavMenu()
                navigate('/study')
              }}
              sx={{ my: 2, color: 'inherit', display: 'block' }}
            >
              {t('sidemenu.study')}
            </Button>
            <Button
              key='statistics'
              onClick={() => {
                handleCloseNavMenu()
                navigate('/statistics')
              }}
              sx={{ my: 2, color: 'inherit', display: 'block' }}
            >
              {t('sidemenu.statistics')}
            </Button>
            <Button
              key='settings'
              onClick={() => {
                handleCloseNavMenu()
                navigate('/settings')
              }}
              sx={{ my: 2, color: 'inherit', display: 'block' }}
            >
              {t('sidemenu.settings')}
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default TopAppBar
