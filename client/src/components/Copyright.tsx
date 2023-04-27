import * as React from 'react'

import { Link, Typography } from '@mui/material'
import { constants } from '../config/constants'

function Copyright (props: any): JSX.Element {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href={constants.homePage} target="_blank">
        {constants.appName}
      </Link>{' '}
      {new Date().getFullYear()}
    </Typography>
  )
}

export default Copyright
