import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Landing from './Landing.jsx'

function Root() {
  const [started, setStarted] = useState(false)
  return started
    ? <App onBack={() => setStarted(false)} />
    : <Landing onStart={() => setStarted(true)} />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
