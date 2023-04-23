import * as React from 'react'

// Third party imports
import { Box, CircularProgress } from '@mui/material'

function CircularLoader (): JSX.Element {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <CircularProgress color='inherit' />
    </Box>
  )
}

export default CircularLoader
