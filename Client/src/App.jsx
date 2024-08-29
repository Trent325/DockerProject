import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import RouterApp from './components/router/Router';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <RouterApp/>
    </>
  )
}

export default App
