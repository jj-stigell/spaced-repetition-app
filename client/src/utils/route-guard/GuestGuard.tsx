import React from 'react'

// Third party imports
import { Outlet, Navigate } from 'react-router-dom'

// Project imports
import { useAppSelector } from '../../app/hooks'
import { RootState } from '../../app/store'
import { dashboard } from '../../config/path'

function GuestGuard (): JSX.Element {
  const isLoggedIn: boolean = useAppSelector((state: RootState) => state.account.isLoggedIn)

  if (!isLoggedIn) return <Outlet/>

  return <Navigate to={dashboard}/>
}

export default GuestGuard
