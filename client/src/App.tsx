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
import Category from './pages/category'
import Statistics from './pages/statistics'
import Register from './pages/authentication/register'
import Confirm from './pages/authentication/confirm'
import SandBox from './pages/sandbox'
import Notification from './components/Notification'
import Authentication from './pages/authentication'
import ForgotPassword from './pages/authentication/forgotPassword'
import Decks from './pages/decks'
import Study from './pages/study'
import {
  category, dashboard, decks, emailConfirm,
  login, register, requestResetPassword, resetPassword,
  settings, statistics, studyDeck
} from './config/path'

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
                <Route element={<Dashboard />} errorElement={<ErrorPage />} path={dashboard} />
                <Route element={<Decks />} errorElement={<ErrorPage />} path={decks} />
                <Route element={<Category />} errorElement={<ErrorPage />} path={category} />
                <Route element={<Statistics />} errorElement={<ErrorPage />} path={statistics} />
                <Route element={<Settings />} errorElement={<ErrorPage />} path={settings} />
              </Route>
              {/* Do not render top menu when in study mode */}
              <Route element={<Study />} errorElement={<ErrorPage />} path={studyDeck} />
            </Route>
            {/* Guest routes */}
            <Route element={<GuestGuard />}>
              <Route element={<Authentication />}>
                <Route element={<Login />} errorElement={<ErrorPage />} path={login} />
                <Route element={<Register />} errorElement={<ErrorPage />} path={register} />
                <Route element={<Confirm />} errorElement={<ErrorPage />} path={emailConfirm} />
                <Route element={<ForgotPassword />} errorElement={<ErrorPage />} path={resetPassword} />
                <Route element={<ForgotPassword />} errorElement={<ErrorPage />} path={requestResetPassword} />
              </Route>
            </Route>
            {/* Not found route */}
            <Route element={<SandBox />} errorElement={<ErrorPage />} path="/sandbox" />
            <Route path="*" element={<NotFound />} errorElement={<ErrorPage />}/>
          </Routes>
      </Router>
    </div>
  )
}

export default App
