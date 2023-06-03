import React from 'react'

// Third party imports
import { Typography } from '@mui/material'

// Project imports
import { constants } from '../config/constants'

function Logo ({ fontSize }: { fontSize: number }): JSX.Element {
  return (
    <div style={{ display: 'flex' }}>
      <Typography sx={{
        textShadow: '3px 3px primary.main',
        color: 'primary.dark',
        fontFamily: 'Pacifico',
        fontSize
      }} >
        {constants.appName}
      </Typography>
      <Typography variant='subtitle1' sx={{
        textShadow: '1px 1px #b3d1ff',
        color: 'primary.dark'
      }} >
        beta
      </Typography>
    </div>
  )
}

export default Logo
