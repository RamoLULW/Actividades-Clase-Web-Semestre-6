import { useState } from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')

  const handleLogin = (user) => {
    setUsername(user)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setUsername('')
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <>
      <Navbar username={username} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HomePage username={username} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}

export default App