import * as React from 'react'

import { Outlet } from 'react-router-dom'
import Footer from 'src/components/Footer'

function Authentication (): JSX.Element {
  return (
    <>
      <Outlet/>
      <Footer />
    </>
  )
}

export default Authentication
