import * as React from 'react'

// Third party imports
import { Container, Box } from '@mui/material'
import { Outlet } from 'react-router-dom'

// Project imports
import Copyright from '../../components/Copyright'
import Logo from '../../components/Logo'

function Authentication (): JSX.Element {
  return (
      <Container component="main" maxWidth="xs" sx={{ pt: 3, pb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: 2,
            borderRadius: 3,
            padding: 5,
            paddingTop: 2,
            borderColor: 'primary.dark'
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Logo fontSize={50}/>
          </Box>
          <Outlet/>
        </Box>
        <Copyright sx={{ mt: 4 }} />
      </Container>
  )
}

export default Authentication
