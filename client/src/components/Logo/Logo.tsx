import React from 'react'
import { Link } from 'react-router-dom'

import { constants } from '../../config/constants'
import routes from '../../config/routes'

export default function Logo (): React.JSX.Element {
  return (
    <div className="flex items-center">
      <img className="w-36" src="https://i.ibb.co/D16j9Y2/logo-rounded.png" />
      <Link to={routes.dashboard} className="text-4xl font-extrabold leading-9 tracking-tight mb-3 text-gray-900 dark:text-gray-100 sm:text-3xl sm:leading-10 md:text-4xl md:leading-normal text-transparent bg-clip-text bg-gradient-to-r from-yomiko-red to-sky-400">
        {constants.appName}
      </Link>
    </div>
  )
}
