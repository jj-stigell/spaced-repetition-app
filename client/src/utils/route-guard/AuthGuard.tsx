import React from 'react'

// Third party imports
import { Outlet, Navigate } from 'react-router-dom'

// Project imports
import { useAppSelector } from '../../app/hooks'
import { RootState } from '../../app/store'

function AuthGuard (): JSX.Element {
  const { isLoggedIn }: { isLoggedIn: boolean } = useAppSelector((state: RootState) => state.account)

  if (isLoggedIn) return <Outlet/>

  return <Navigate to="auth/login"/>
}

export default AuthGuard
