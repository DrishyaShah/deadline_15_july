import React from 'react'
import './Nav.css'
// import myntraLogo from './assets/myntra-logo.png'

const Nav = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="https://cdn.iconscout.com/icon/free/png-256/free-myntra-2709168-2249158.png?f=webp&w=256" alt="Myntra Logo" className="logo" />
        <h1 className="heading">Be Dressed to Impress</h1>
      </div>
      <div className="navbar-right">
        <button className="login-button">Login</button>
      </div>
    </nav>
  )
}

export default Nav