/* eslint-disable no-multiple-empty-lines */
/* eslint-disable no-trailing-spaces */
import React from 'react'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'

import HomePage from '../pages/HomePage'
import NotFound from '../pages/notFound'
import Dashboard from '../pages/dashboard'
import Login from '../pages/login'
import Proto from '../pages/study'
import { persistor, store } from './store'

function App (): React.JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="/kanji/recognise" element={<Proto />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
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
