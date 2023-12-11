import React from 'react'

// Third party imports
import { Outlet, Navigate } from 'react-router-dom'

// Project imports
import { useAppSelector } from '../../app/hooks'
import { RootState } from '../../app/store'
import { dashboard } from '../../config/path'
import { Role } from '../../types'

function AuthGuard (): JSX.Element {
  const role: Role = useAppSelector((state: RootState) => state.account.account.role)

  if (role === Role.READ_RIGHT || role === Role.WRITE_RIGHT || role === Role.SUPERUSER) return <Outlet/>

  return <Navigate to={dashboard}/>
}

export default AuthGuard
