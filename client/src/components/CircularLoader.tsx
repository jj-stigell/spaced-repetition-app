import * as React from 'react'

// Third party imports
import { Box, CircularProgress } from '@mui/material'

function CircularLoader (props: any): JSX.Element {
  return (
    <Box sx={{ display: 'flex', ...props }}>
      <CircularProgress />
    </Box>
  )
}

export default CircularLoader
