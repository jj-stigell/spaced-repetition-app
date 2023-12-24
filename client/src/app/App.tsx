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
import Proto from '../pages/study'
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

// For dispatching notifications via axios interceptor.
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
                <Route path="/" errorElement={<RouterError />} element={<Dashboard />} />
                <Route path="/settings" errorElement={<RouterError />} element={<Settings />} />
                <Route path="/statistics" errorElement={<RouterError />} element={<UnderConstruction />} />
                <Route path="/study" errorElement={<RouterError />} element={<UnderConstruction />} />
                <Route path="/exam" errorElement={<RouterError />} element={<UnderConstruction />} />
                <Route path="/kanji/recognise" errorElement={<RouterError />} element={<Proto />} />
              </Route>
            </Route>
            <Route element={<GuestGuard />}>
              <Route element={<Authentication />}>
                <Route path="/auth/login" errorElement={<RouterError />} element={<Login />} />
                <Route path="/auth/register" errorElement={<RouterError />} element={<Register />} />
                <Route path={routes.requestResetPassword} errorElement={<RouterError />} element={<ForgotPassword />} />
                <Route path={routes.resetPassword} errorElement={<RouterError />} element={<ResetPassword />} />
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

/*
    <div style={{
      backgroundColor: theme.palette.primary.light,
      minHeight: '100vh'
    }}>
      <Notification />
        <Router>
          <Routes>

          
            <Route element={<AuthGuard />}>
              <Route element={<MainLayout />}>
                <Route element={<Dashboard />} errorElement={<RouterError />} path={dashboard} />
                <Route element={<Decks />} errorElement={<RouterError />} path={decks} />
                <Route element={<Category />} errorElement={<RouterError />} path={category} />
                <Route element={<Settings />} errorElement={<RouterError />} path={settings} />
                <Route element={<AdminGuard />}>

                
                  <Route element={<AdminDashBoard />} errorElement={<RouterError />} path={admin} />
                  <Route element={<DeckInfo />} errorElement={<RouterError />} path={adminDeckInfo} />
                  <Route element={<BugReports />} errorElement={<RouterError />} path={adminBugReports} />
                </Route>
              </Route>
              <Route element={<Study />} errorElement={<RouterError />} path={studyDeck} />
            </Route>


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


            <Route path="*" element={<NotFound />} errorElement={<RouterError />}/>
          </Routes>
      </Router>
    </div>
*/
