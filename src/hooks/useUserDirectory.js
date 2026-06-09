import { useCallback, useEffect, useState } from "react"
import { API_URL, createAuthHeaders } from "../config/api"

const emptyForm = {
  name: "",
  username: "",
  password: "",
}

function useUserDirectory(token, onUnauthorized) {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingUserId, setEditingUserId] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingUserId, setDeletingUserId] = useState("")

  const isEditing = editingUserId !== ""

  const resetForm = useCallback(() => {
    setForm(emptyForm)
    setEditingUserId("")
  }, [])

  const loadUsers = useCallback(async () => {
    try {
      setLoadingUsers(true)
      setError("")

      const response = await fetch(`${API_URL}/users`, {
        headers: createAuthHeaders(token),
      })
      const data = await response.json()

      if (response.status === 401) {
        onUnauthorized()
        return
      }

      if (!response.ok) {
        setError(data.error || "Could not load users")
        return
      }

      setUsers(Array.isArray(data) ? data : [])
    } catch {
      setError("Could not connect to the backend")
    } finally {
      setLoadingUsers(false)
    }
  }, [onUnauthorized, token])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const handleChange = (field) => (event) => {
    const nextValue = event.target.value

    setForm((currentForm) => ({
      ...currentForm,
      [field]: nextValue,
    }))
  }

  const saveUser = async (event) => {
    event.preventDefault()

    const payload = {
      name: form.name.trim(),
      username: form.username.trim(),
    }

    if (!payload.name || !payload.username) {
      setError("Name and username are required")
      setMessage("")
      return false
    }

    if (isEditing) {
      if (form.password.trim()) {
        payload.password = form.password
      }
    } else if (!form.password.trim()) {
      setError("Password is required to create a user")
      setMessage("")
      return false
    } else {
      payload.password = form.password
    }

    try {
      setSaving(true)
      setError("")
      setMessage("")

      const response = await fetch(
        isEditing ? `${API_URL}/users/${editingUserId}` : `${API_URL}/users`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: createAuthHeaders(token, true),
          body: JSON.stringify(payload),
        }
      )
      const data = await response.json()

      if (response.status === 401) {
        onUnauthorized()
        return false
      }

      if (!response.ok) {
        setError(data.error || "Could not save user")
        return false
      }

      if (isEditing) {
        setUsers((currentUsers) =>
          currentUsers.map((user) => (user._id === data._id ? data : user))
        )
        setMessage("User updated successfully")
      } else {
        setUsers((currentUsers) => [...currentUsers, data])
        setMessage("User created successfully")
      }

      resetForm()
      return true
    } catch {
      setError("Could not connect to the backend")
      return false
    } finally {
      setSaving(false)
    }
  }

  const startEditing = (user) => {
    setForm({
      name: user.name || "",
      username: user.username || "",
      password: "",
    })
    setEditingUserId(user._id)
    setError("")
    setMessage("")
  }

  const cancelEditing = () => {
    resetForm()
    setError("")
    setMessage("")
  }

  const deleteUser = async (user) => {
    try {
      setDeletingUserId(user._id)
      setError("")
      setMessage("")

      const response = await fetch(`${API_URL}/users/${user._id}`, {
        method: "DELETE",
        headers: createAuthHeaders(token),
      })
      const data = await response.json()

      if (response.status === 401) {
        onUnauthorized()
        return false
      }

      if (!response.ok) {
        setError(data.error || "Could not delete user")
        return false
      }

      setUsers((currentUsers) =>
        currentUsers.filter((currentUser) => currentUser._id !== user._id)
      )

      if (editingUserId === user._id) {
        resetForm()
      }

      setMessage("User deleted successfully")
      return true
    } catch {
      setError("Could not connect to the backend")
      return false
    } finally {
      setDeletingUserId("")
    }
  }

  return {
    users,
    form,
    error,
    message,
    isEditing,
    loadingUsers,
    saving,
    deletingUserId,
    editingUserId,
    handleChange,
    loadUsers,
    saveUser,
    startEditing,
    cancelEditing,
    deleteUser,
  }
}

export default useUserDirectory
