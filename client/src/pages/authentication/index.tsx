import * as React from 'react'

import { Outlet } from 'react-router-dom'

import Logo from 'src/components/Logo'

function Authentication (): JSX.Element {
  return (
    <div className="bg-blue-100">
      <div className="flex flex-col items-center justify-center px-6 mx-auto md:h-screen">
        <Logo/>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 shadow-lg">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <Outlet/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Authentication
