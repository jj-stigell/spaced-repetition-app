import * as React from 'react'

// Third party imports
import { Link, Typography } from '@mui/material'

// Project imports
import { constants } from '../config/constants'

function Copyright (props: any): JSX.Element {
  return (
    <Typography variant="body2" color='primary.dark' align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href={constants.homePage} target="_blank">
        {constants.appName}
      </Link>{' '}
      {new Date().getFullYear()}
    </Typography>
  )
}

export default Copyright
