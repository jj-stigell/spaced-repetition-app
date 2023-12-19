import React from 'react'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import HomePage from '../pages/HomePage'
import NotFound from '../pages/notFound'
import Dashboard from '../pages/dashboard'
import Login from '../pages/login'
import Proto from '../pages/study'

function App (): React.JSX.Element {
  return (
    <Router>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/kanji/recognise" element={<Proto />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
