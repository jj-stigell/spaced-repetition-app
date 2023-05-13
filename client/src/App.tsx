import React from 'react'

// Third party imports
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useTheme } from '@mui/material'

// Project imports
import Login from './pages/authentication/login'
import AuthGuard from './utils/routeGuard/AuthGuard'
import NotFound from './pages/notFound'
import GuestGuard from './utils/routeGuard/GuestGuard'
import Settings from './pages/settings'
import MainLayout from './layout/MainLayout'
import Dashboard from './pages/dashboard'
import Category from './pages/category'
import Register from './pages/authentication/register'
import Confirm from './pages/authentication/confirm'
import SandBox from './pages/sandbox'
import Notification from './components/Notification'
import Authentication from './pages/authentication'
import ForgotPassword from './pages/authentication/forgotPassword'
import ResetPassword from './pages/authentication/resetPassword'
import Decks from './pages/decks'
import Study from './pages/study'
import {
  category, dashboard, decks, emailConfirm,
  login, register, requestEmailConfirm, requestResetPassword, resetPassword,
  settings, studyDeck
} from './config/path'
import RouterError from './pages/error/RouterError'

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
                <Route element={<Dashboard />} errorElement={<RouterError />} path={dashboard} />
                <Route element={<Decks />} errorElement={<RouterError />} path={decks} />
                <Route element={<Category />} errorElement={<RouterError />} path={category} />
                {/* <Route element={<Statistics />} errorElement={<RouterError />} path={statistics} /> */}
                <Route element={<Settings />} errorElement={<RouterError />} path={settings} />
              </Route>
              {/* Do not render main layout when in study mode */}
              <Route element={<Study />} errorElement={<RouterError />} path={studyDeck} />
            </Route>
            {/* Guest routes */}
            <Route element={<GuestGuard />}>
              <Route element={<Authentication />}>
                <Route element={<Login />} errorElement={<RouterError />} path={login} />
                <Route element={<Register />} errorElement={<RouterError />} path={register} />
                <Route element={<Confirm />} errorElement={<RouterError />} path={emailConfirm} />
                <Route element={<Confirm />} errorElement={<RouterError />} path={requestEmailConfirm} />
                <Route element={<ResetPassword />} errorElement={<RouterError />} path={resetPassword} />
                <Route element={<ForgotPassword />} errorElement={<RouterError />} path={requestResetPassword} />
              </Route>
            </Route>
            {/* Not found route */}
            <Route element={<SandBox />} errorElement={<RouterError />} path="/sandbox" />
            <Route path="*" element={<NotFound />} errorElement={<RouterError />}/>
          </Routes>
      </Router>
    </div>
  )
}

export default App
