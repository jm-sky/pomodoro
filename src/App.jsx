import { useState } from 'react'
import './App.scss'
import Clock from './Clock'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Clock muted={true} intervalAmount={1000} audioSrc="/assets/BeepSound.wav" />
    </>
  )
}

export default App
