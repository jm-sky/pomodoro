import './App.scss'
import Clock from './Clock'

function App() {
  return (
    <>
      <Clock muted={true} intervalAmount={1000} />
    </>
  )
}

export default App
