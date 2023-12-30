import React from 'react'

import { Outlet } from 'react-router-dom'

import Navigation from './Navigation'

function MainLayout (): JSX.Element {
  return (
    <>
      <Navigation />
      <div className="p-6 mt-16 sm:ml-64 bg-blue-50">
        <Outlet/>
      </div>
    </>
  )
}

export default MainLayout
