import { useCallback, useEffect, useState } from "react"
import {
  Alert,
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { API_URL, createAuthHeaders } from "../config/api"

const emptyForm = {
  name: "",
  username: "",
  password: "",
}

function HomePage({ username, token, onUnauthorized }) {
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

      setUsers(data)
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

  const handleSubmit = async (event) => {
    event.preventDefault()

    const payload = {
      name: form.name.trim(),
      username: form.username.trim(),
    }

    if (!payload.name || !payload.username) {
      setError("Name and username are required")
      setMessage("")
      return
    }

    if (isEditing) {
      if (form.password.trim()) {
        payload.password = form.password
      }
    } else if (!form.password.trim()) {
      setError("Password is required to create a user")
      setMessage("")
      return
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
        return
      }

      if (!response.ok) {
        setError(data.error || "Could not save user")
        return
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
    } catch {
      setError("Could not connect to the backend")
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (user) => {
    setForm({
      name: user.name || "",
      username: user.username || "",
      password: "",
    })
    setEditingUserId(user._id)
    setError("")
    setMessage("")
  }

  const handleCancelEdit = () => {
    resetForm()
    setError("")
    setMessage("")
  }

  const handleDelete = async (user) => {
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
        return
      }

      if (!response.ok) {
        setError(data.error || "Could not delete user")
        return
      }

      setUsers((currentUsers) =>
        currentUsers.filter((currentUser) => currentUser._id !== user._id)
      )

      if (editingUserId === user._id) {
        resetForm()
      }

      setMessage("User deleted successfully")
    } catch {
      setError("Could not connect to the backend")
    } finally {
      setDeletingUserId("")
    }
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h3" gutterBottom>
          Bienvenido, {username}
        </Typography>

        <Typography variant="body1">
          Aqui puedes consultar, crear, editar y eliminar usuarios usando el
          backend protegido con JWT.
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          {isEditing ? "Editar usuario" : "Agregar usuario"}
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Name"
            value={form.name}
            onChange={handleChange("name")}
            disabled={saving}
          />
          <TextField
            label="Username"
            value={form.username}
            onChange={handleChange("username")}
            disabled={saving}
          />
          <TextField
            label={isEditing ? "New password (optional)" : "Password"}
            type="password"
            value={form.password}
            onChange={handleChange("password")}
            disabled={saving}
            helperText={
              isEditing
                ? "Leave it empty to keep the current password"
                : "Required for new users"
            }
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving
                ? isEditing
                  ? "Saving..."
                  : "Creating..."
                : isEditing
                  ? "Save changes"
                  : "Add user"}
            </Button>

            {isEditing && (
              <Button variant="outlined" onClick={handleCancelEdit} disabled={saving}>
                Cancel
              </Button>
            )}
          </Stack>
        </Box>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
      </Paper>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
          mb={2}
        >
          <Typography variant="h5">Lista de usuarios</Typography>
          <Button variant="outlined" onClick={loadUsers} disabled={loadingUsers}>
            {loadingUsers ? "Loading..." : "Reload"}
          </Button>
        </Stack>

        {loadingUsers ? (
          <Typography>Cargando usuarios...</Typography>
        ) : users.length === 0 ? (
          <Typography>No hay usuarios todavia.</Typography>
        ) : (
          <List>
            {users.map((user) => (
              <ListItem
                key={user._id}
                divider
                secondaryAction={
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      onClick={() => handleEdit(user)}
                      disabled={saving || deletingUserId === user._id}
                    >
                      Edit
                    </Button>
                    <Button
                      color="error"
                      variant="outlined"
                      onClick={() => handleDelete(user)}
                      disabled={deletingUserId === user._id}
                    >
                      {deletingUserId === user._id ? "Deleting..." : "Delete"}
                    </Button>
                  </Stack>
                }
              >
                <ListItemText primary={user.name} secondary={user.username} />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  )
}

export default HomePage
