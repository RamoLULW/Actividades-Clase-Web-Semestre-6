import { useCallback, useEffect, useState } from "react"
import { API_URL, createAuthHeaders } from "../config/api"

function useUserDetail(userId, token, onUnauthorized, initialUser = null) {
  const [user, setUser] = useState(initialUser)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadUser = useCallback(async () => {
    if (!userId) {
      setError("A valid user id is required")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError("")

      const detailResponse = await fetch(`${API_URL}/users/${userId}`, {
        headers: createAuthHeaders(token),
      })

      if (detailResponse.status === 401) {
        onUnauthorized()
        return
      }

      const detailData = await detailResponse.json()

      if (detailResponse.ok) {
        setUser(detailData)
        return
      }

      const listResponse = await fetch(`${API_URL}/users`, {
        headers: createAuthHeaders(token),
      })

      if (listResponse.status === 401) {
        onUnauthorized()
        return
      }

      const listData = await listResponse.json()

      if (!listResponse.ok) {
        setError(detailData.error || "Could not load user details")
        return
      }

      const matchedUser = Array.isArray(listData)
        ? listData.find((candidate) => candidate._id === userId)
        : null

      if (!matchedUser) {
        setError("User not found")
        return
      }

      setUser(matchedUser)
    } catch {
      setError("Could not connect to the backend")
    } finally {
      setLoading(false)
    }
  }, [onUnauthorized, token, userId])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  return {
    user,
    loading,
    error,
    reloadUser: loadUser,
  }
}

export default useUserDetail
