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
// import TranslateIcon from '@mui/icons-material/Translate'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { constants } from '../config/constants'
import { category, dashboard, settings } from '../config/path'

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
    <AppBar position="fixed" style={{ background: '#fad25f' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* <TranslateIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'Pacifico',
              fontWeight: 500,
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
                navigate(dashboard)
              }}>
                <Typography textAlign="center" color="inherit">
                  {t('navbar.dashboard')}
                </Typography>
              </MenuItem>

              <MenuItem key='study' onClick={() => {
                handleCloseNavMenu()
                navigate(category)
              }}>
                <Typography textAlign="center" color="inherit">
                  {t('navbar.study')}
                </Typography>
              </MenuItem>
              {
                /*
              <MenuItem key='statistics' onClick={() => {
                handleCloseNavMenu()
                navigate(statistics)
              }}>
                <Typography textAlign="center" color="inherit">
                  {t('navbar.statistics')}
                </Typography>
              </MenuItem>
                */
              }
              <MenuItem key='settings' onClick={() => {
                handleCloseNavMenu()
                navigate(settings)
              }}>
                <Typography textAlign="center" color="inherit">
                  {t('navbar.settings')}
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
          {/* <TranslateIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'Pacifico',
              fontWeight: 500,
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
                navigate(dashboard)
              }}
              sx={{ my: 2, color: 'inherit', display: 'block' }}
            >
              {t('navbar.dashboard')}
            </Button>
            <Button
              key='study'
              onClick={() => {
                handleCloseNavMenu()
                navigate(category)
              }}
              sx={{ my: 2, color: 'inherit', display: 'block' }}
            >
              {t('navbar.study')}
            </Button>
            {
              /*
              <Button
                key='statistics'
                onClick={() => {
                  handleCloseNavMenu()
                  navigate(statistics)
                }}
                sx={{ my: 2, color: 'inherit', display: 'block' }}
              >
                {t('navbar.statistics')}
              </Button>
              */
            }
            <Button
              key='settings'
              onClick={() => {
                handleCloseNavMenu()
                navigate(settings)
              }}
              sx={{ my: 2, color: 'inherit', display: 'block' }}
            >
              {t('navbar.settings')}
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default TopAppBar
