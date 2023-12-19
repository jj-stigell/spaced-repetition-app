import React from 'react';

import HomePage from '../view/HomePage'
import NotFound from '../view/NotFound'
import Keyboard from '../components/Keyboard'
import Dashboard from '../view/DashBoard'
import Login from '../view/Login'
import Proto from '../components/proto'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App (): React.JSX.Element {
  return (
    <Router>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/kanji/recognise" element={<Proto />} />
        <Route path="/keyboard" element={<Keyboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
