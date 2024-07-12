import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Layout from './Layout'
import { Routes, Route } from 'react-router-dom';
import Home from './Home'

import TinderCards from './TinderCards'

function App() {
 

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="swipe" element={ <TinderCards />} />
      </Route>
    </Routes>
  )
}

export default App
