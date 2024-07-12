import React from 'react'
import { Outlet } from 'react-router-dom'
import Nav from './Nav'

const Layout = () => {
  return (
    <>
    {/* <Nav /> */}
    <main className='App'>
        
      <Outlet />
    </main>
    </>
  )
}

export default Layout
