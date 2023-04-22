import React from 'react'

// Third party imports
import { Typography } from '@mui/material'

// Project imports
import { constants } from '../config/constants'

function Logo ({ fontSize }: { fontSize: number }): JSX.Element {
  return (
    <Typography sx={{
      textShadow: '3px 3px #b3d1ff',
      color: '#80b3ff',
      fontFamily: 'Pacifico',
      fontSize
    }} >
      {constants.appName}
    </Typography>
  )
}

export default Logo
