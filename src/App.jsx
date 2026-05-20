import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import './App.css'

const SESSION_KEY = 'fries-auth-session'

const getStoredSession = () => {
  const storedValue = localStorage.getItem(SESSION_KEY)

  if (!storedValue) {
    return null
  }

  try {
    return JSON.parse(storedValue)
  } catch {
    localStorage.removeItem(SESSION_KEY)
    return null
  }
}

function App() {
  const [auth, setAuth] = useState(() => getStoredSession())

  const handleLogin = ({ user, token }) => {
    const nextSession = {
      token,
      username: user.username,
      name: user.name,
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession))
    setAuth(nextSession)
  }

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY)
    setAuth(null)
  }

  if (!auth?.token) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <>
      <Navbar username={auth.username} onLogout={handleLogout} />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              username={auth.username}
              token={auth.token}
              onUnauthorized={handleLogout}
            />
          }
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}

export default App
