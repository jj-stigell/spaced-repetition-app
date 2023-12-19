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
        backgroundColor: 'primary.main',
        padding: 1,
        textAlign: 'center'
      }}
    >
      <Copyright />
    </Box>
  )
}

export default Footer
