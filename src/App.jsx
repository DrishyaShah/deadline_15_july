import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import TinderCards from './TinderCards'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <TinderCards />
    </>
  )
}

export default App
