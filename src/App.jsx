import { Navigate, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import useAuth from "./hooks/useAuth"
import AboutPage from "./pages/AboutPage"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import UserDetailPage from "./pages/UserDetailPage"
import "./App.css"

function App() {
  const { auth, isAuthenticated, login, logout } = useAuth()

  if (!isAuthenticated) {
    return <LoginPage onLogin={login} />
  }

  return (
    <>
      <Navbar username={auth.username} onLogout={logout} />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              auth={auth}
              username={auth.username}
              token={auth.token}
              onUnauthorized={logout}
            />
          }
        />
        <Route
          path="/users/:userId"
          element={<UserDetailPage token={auth.token} onUnauthorized={logout} />}
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}

export default App
