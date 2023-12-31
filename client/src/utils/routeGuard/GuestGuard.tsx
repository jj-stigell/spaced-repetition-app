import React from 'react'

// Third party imports
import { Outlet, Navigate } from 'react-router-dom'

// Project imports
import { useAppSelector } from '../../app/hooks'
import { RootState } from '../../app/store'
import routes from '../../config/routes'

/**
 * GuestGuard is a route guard that prevents logged in users from accessing
 * routes that are meant for guests only or unauthenticated users.
 */
function GuestGuard (): JSX.Element {
  const isLoggedIn: boolean = useAppSelector((state: RootState) => state.account.isLoggedIn)

  if (!isLoggedIn) return <Outlet/>

  return <Navigate to={routes.dashboard}/>
}

export default GuestGuard
