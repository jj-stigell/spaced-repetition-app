import React from 'react'

// Third party imports
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useTheme } from '@mui/material'

// Project imports
import Login from './pages/authentication/login'
import AuthGuard from './utils/route-guard/AuthGuard'
import ErrorPage from './pages/error'
import NotFound from './pages/notFound'
import GuestGuard from './utils/route-guard/GuestGuard'
import Settings from './pages/settings'
import MainLayout from './layout/MainLayout'
import Dashboard from './pages/dashboard'
import Study from './pages/study'
import Statistics from './pages/statistics'
import Register from './pages/authentication/register'
import Confirm from './pages/authentication/confirm'
import SandBox from './pages/sandbox'
import Notification from './components/Notification'
import Authentication from './pages/authentication'
import ForgotPassword from './pages/authentication/forgotPassword'

function App (): JSX.Element {
  const theme = useTheme()
  return (
    <div style={{ backgroundColor: theme.palette.primary.main }}>
      <Notification />
        <Router>
          <Routes>
            {/* Protected routes */}
            <Route element={<AuthGuard />}>
              <Route element={<MainLayout />}>
                <Route element={<Dashboard/>} errorElement={<ErrorPage />} path="/"/>
                <Route element={<Study/>} errorElement={<ErrorPage />} path="/study"/>
                <Route element={<Statistics/>} errorElement={<ErrorPage />} path="/statistics"/>
                <Route element={<Settings/>} errorElement={<ErrorPage />} path="/settings"/>
              </Route>
            </Route>
            {/* Guest routes */}
            <Route element={<GuestGuard />}>
              <Route element={<Authentication />}>
                <Route element={<Login/>} errorElement={<ErrorPage />} path="/auth/login"/>
                <Route element={<Register/>} errorElement={<ErrorPage />} path="/auth/register"/>
                <Route element={<Confirm/>} errorElement={<ErrorPage />} path="/auth/confirm-email/:confirmId"/>
                <Route element={<ForgotPassword/>} errorElement={<ErrorPage />} path="/auth/forgot-password/reset/:resetId"/>
                <Route element={<ForgotPassword/>} errorElement={<ErrorPage />} path="/auth/forgot-password"/>
              </Route>
            </Route>
            {/* Not found route */}
            <Route element={<SandBox/>} errorElement={<ErrorPage />} path="/sandbox"/>
            <Route path="*" element={<NotFound />} errorElement={<ErrorPage />}/>
          </Routes>
      </Router>
    </div>
  )
}

export default App
