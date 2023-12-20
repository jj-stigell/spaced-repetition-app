import React from 'react'

// Third party imports
import { Outlet } from 'react-router-dom'

// Project imports
import SideMenu from './SideMenu'

function MainLayout (): JSX.Element {
  return (
    <>
      <SideMenu />
      <div className="p-6 mt-16 sm:ml-64 bg-rose-50">
        <Outlet/>
      </div>
    </>
  )
}

export default MainLayout
