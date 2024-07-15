import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import OrderPage from'./components/OrderPage'
import Layout from './Layout'
import { Routes, Route } from 'react-router-dom';
import Home from './Home'

import TinderCards from './TinderCards'
import FandomPage from './FandomPage'
import OrderCards from './OrderCards'

function App() {
 

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="swipe" element={ <TinderCards />} />
      <Route path="fandom" element={<FandomPage/>}/>
      <Route path="orders" element={<OrderCards/>}/>
      </Route>
    </Routes>
  )
}

export default App
