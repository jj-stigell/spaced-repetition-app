import * as React from 'react'

// Third party imports
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Container, Box } from '@mui/material'
import { Outlet } from 'react-router-dom'

// Project imports
import Copyright from '../../components/Copyright'
import Logo from '../../components/Logo'

const theme = createTheme()

function Authentication (): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Logo fontSize={50}/>
          </Box>
          <Outlet/>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  )
}

export default Authentication
