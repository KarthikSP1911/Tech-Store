import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Product'
import Login from './pages/Login'
import Register from './pages/Register'
import H from './pages/Home'
import Order from './pages/Order'

const App = () => {
  return (
    <Routes>
      <Route path="/product" element={<Home />} />
      <Route path="/" element={<H/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/order" element={<Order/>} />
    </Routes>
  )
}

export default App
