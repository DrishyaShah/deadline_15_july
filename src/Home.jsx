// src/pages/Home.jsx

import React from 'react'
import './Home.css'
import Nav from './Nav'

const Home = () => {
  return (
    <>
    <Nav />
    <div className="home-container">
      <h1>Introducing Gen Z special brand new features!</h1>
      <div className="buttons-container">
        <div className="feature-container">
        <button className="funky-button">Fashionable Swipe</button>
        <div className="description-card">
            <p>Swipe through the latest fashion trends and create your own style statement!</p>
          </div>
          </div>
          <div className='feature-container'>
        <button className="funky-button">Fandom Page</button>
        <div className="description-card">
            <p>Only main character energy! Watch your favourite fandoms come to life in the coolest apparels</p>
          </div>
          </div>
      </div>
    </div>
    </>
  )
}

export default Home
