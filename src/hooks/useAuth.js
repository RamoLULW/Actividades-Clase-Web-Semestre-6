import { useState } from "react"

const SESSION_KEY = "fries-auth-session"

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

function useAuth() {
  const [auth, setAuth] = useState(() => getStoredSession())

  const login = ({ user, token }) => {
    const fallbackName = user?.name || user?.username || "Usuario"
    const fallbackUsername = user?.username || fallbackName
    const nextSession = {
      token,
      username: fallbackUsername,
      name: fallbackName,
      role: user?.role || null,
      isAdmin: user?.isAdmin ?? null,
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession))
    setAuth(nextSession)
  }

  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
    setAuth(null)
  }

  return {
    auth,
    isAuthenticated: Boolean(auth?.token),
    login,
    logout,
  }
}

export default useAuth
