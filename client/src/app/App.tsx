/* eslint-disable no-multiple-empty-lines */
/* eslint-disable no-trailing-spaces */
import React from 'react'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'

import NotFound from '../pages/notFound'
import Dashboard from '../pages/dashboard'
import Login from '../pages/authentication/login'
import Register from '../pages/authentication/register'
import Proto from '../pages/study/session'
import { persistor, store } from './store'
import Notification from '../components/Notification/index'
import { injectStore } from 'src/lib/axios'
import RouterError from 'src/pages/error/RouterError'
import Settings from 'src/pages/settings'
import GuestGuard from 'src/utils/routeGuard/GuestGuard'
import Authentication from 'src/pages/authentication'
import AuthGuard from 'src/utils/routeGuard/AuthGuard'
import MainLayout from 'src/layout/MainLayout'
import UnderConstruction from 'src/pages/underConstruction'
import ForgotPassword from 'src/pages/authentication/forgotPassword'
import routes from 'src/config/routes'
import ResetPassword from 'src/pages/authentication/resetPassword'
import Confirm from 'src/pages/authentication/confirm'
import StudyMain from 'src/pages/study/main'

// For dispatching notifications with axios interceptor.
injectStore(store)

function App (): React.JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Notification />
        <Router>
          <Routes>
            <Route element={<AuthGuard />}>
              <Route element={<MainLayout />}>
                <Route path={routes.dashboard} errorElement={<RouterError />} element={<Dashboard />} />
                <Route path={routes.settings} errorElement={<RouterError />} element={<Settings />} />
                <Route path={routes.statistics} errorElement={<RouterError />} element={<UnderConstruction />} />
                <Route path={routes.study} errorElement={<RouterError />} element={<StudyMain />} />
                <Route path={routes.exam} errorElement={<RouterError />} element={<UnderConstruction />} />
                <Route path="/kanji/recognise" errorElement={<RouterError />} element={<Proto />} />
              </Route>
            </Route>
            <Route element={<GuestGuard />}>
              <Route element={<Authentication />}>
                <Route path={routes.login} errorElement={<RouterError />} element={<Login />} />
                <Route path={routes.register} errorElement={<RouterError />} element={<Register />} />
                <Route path={routes.requestResetPassword} errorElement={<RouterError />} element={<ForgotPassword />} />
                <Route path={routes.resetPassword} errorElement={<RouterError />} element={<ResetPassword />} />
                <Route path={routes.emailConfirm} errorElement={<RouterError />} element={<Confirm />} />
                <Route path={routes.requestEmailConfirm} errorElement={<RouterError />} element={<Confirm />} />
              </Route>
            </Route>
            <Route path="*" errorElement={<RouterError />} element={<NotFound />} />
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  )
}

export default App
