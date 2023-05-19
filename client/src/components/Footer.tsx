import React from 'react'

// Third party imports
import { Box } from '@mui/material'

// Project imports
import Copyright from '../components/Copyright'

function Footer (): JSX.Element {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#f7e09e',
        color: '#ffffff',
        padding: 1,
        textAlign: 'center',
        marginTop: 3
      }}
    >
      <Copyright />
    </Box>
  )
}

export default Footer
