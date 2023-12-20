import React from 'react'

// Third party imports
import { Outlet, Navigate } from 'react-router-dom'

// Project imports
import { useAppSelector } from '../../app/hooks'
import { RootState } from '../../app/store'
import routes from '../../config/routes'

/**
 * AuthGuard is a route guard that prevents unauthenticated users from accessing
 * routes that are meant for authenticated users only.
 */
function AuthGuard (): JSX.Element {
  const isLoggedIn: boolean = useAppSelector((state: RootState) => state.account.isLoggedIn)

  if (isLoggedIn) return <Outlet/>

  return <Navigate to={routes.login}/>
}

export default AuthGuard
