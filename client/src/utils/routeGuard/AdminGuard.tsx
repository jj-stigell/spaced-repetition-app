import React from 'react'

// Third party imports
import { Outlet, Navigate } from 'react-router-dom'

// Project imports
import { Role } from '@common/types'

import { useAppSelector } from '../../app/hooks'
import { RootState } from '../../app/store'
import routes from '../../config/routes'

/**
 * AuthGuard is a route guard that prevents unauthenticated users from accessing
 * routes that are meant for admin users only. Admin users are users with
 * read/write access to the database.
 */
function AuthGuard (): JSX.Element {
  const role: Role = useAppSelector((state: RootState) => state.account.role)

  if (role === Role.READ_RIGHT || role === Role.WRITE_RIGHT || role === Role.SUPERUSER) return <Outlet/>

  return <Navigate to={routes.dashboard}/>
}

export default AuthGuard
