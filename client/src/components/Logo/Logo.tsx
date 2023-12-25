import React from 'react'
import { Link } from 'react-router-dom'

import { constants } from '../../config/constants'
import routes from '../../config/routes'

export default function Logo (): React.JSX.Element {
  return (
    <Link to={routes.dashboard} className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">{constants.appName}</Link>
  )
}
