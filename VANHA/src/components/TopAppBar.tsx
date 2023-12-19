import * as React from 'react'

// Third party imports
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
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

// Project imports
import { constants } from '../config/constants'
import { category, dashboard, settings, admin } from '../config/path'
import { useAppSelector } from '../app/hooks'
import { RootState } from '../app/store'
import { Role } from '../types'

function TopAppBar (): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { role } = useAppSelector((state: RootState) => state.account.account)
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorElNav(event.currentTarget)
  }

  const handleCloseNavMenu = (): void => {
    setAnchorElNav(null)
  }

  return (
    <AppBar position="fixed" style={{ background: 'primary.main' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
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
              color: 'primary.dark',
              textDecoration: 'none'
            }}
          >
            {constants.appName} beta
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
              <MenuItem key='settings' onClick={() => {
                handleCloseNavMenu()
                navigate(settings)
              }}>
                <Typography textAlign="center" color="inherit">
                  {t('navbar.settings')}
                </Typography>
              </MenuItem>
              <MenuItem key='admin' onClick={() => {
                handleCloseNavMenu()
                navigate(admin)
              }}>
                <Typography textAlign="center" color="inherit">
                  {t('navbar.admin')}
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
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
              color: 'primary.dark',
              textDecoration: 'none'
            }}
          >
            {constants.appName} beta
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              key='dashboard'
              onClick={() => {
                handleCloseNavMenu()
                navigate(dashboard)
              }}
              sx={{ my: 2, backgroundColor: 'primary.main', display: 'block' }}
            >
              {t('navbar.dashboard')}
            </Button>
            <Button
              key='study'
              onClick={() => {
                handleCloseNavMenu()
                navigate(category)
              }}
              sx={{ my: 2, backgroundColor: 'primary.main', display: 'block' }}
            >
              {t('navbar.study')}
            </Button>
            <Button
              key='settings'
              onClick={() => {
                handleCloseNavMenu()
                navigate(settings)
              }}
              sx={{ my: 2, backgroundColor: 'primary.main', display: 'block' }}
            >
              {t('navbar.settings')}
            </Button>
            {(role === Role.READ_RIGHT || role === Role.WRITE_RIGHT || role === Role.SUPERUSER) && (
              <Button
                key='admin'
                onClick={() => {
                  handleCloseNavMenu()
                  navigate(admin)
                }}
                sx={{ my: 2, backgroundColor: 'primary.main', display: 'block' }}
              >
                {t('navbar.admin')}
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default TopAppBar
