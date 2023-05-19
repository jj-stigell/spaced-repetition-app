import React from 'react'

// Third party imports
import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'

// Project imports
import TopAppBar from '../components/TopAppBar'
import Footer from '../components/Footer'

function MainLayout (): JSX.Element {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <TopAppBar />
      <Box sx={{ flexGrow: 1, marginLeft: 2, marginRight: 2, marginTop: 7 }}>
        <Outlet/>
      </Box>
      <Footer />
    </Box>
  )
}

export default MainLayout
