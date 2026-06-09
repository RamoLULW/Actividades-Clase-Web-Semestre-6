import React from "react"
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { Link } from "react-router-dom"
import LifecycleDemo from "../components/LifecycleDemo"
import useAdmin from "../hooks/useAdmin"
import useUserDirectory from "../hooks/useUserDirectory"

function HomePage({ auth, username, token, onUnauthorized }) {
  const [showLifecycle, setShowLifecycle] = React.useState(true)
  const { isAdmin, label } = useAdmin(auth)
  const {
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
  } = useUserDirectory(token, onUnauthorized)

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          mb={2}
        >
          <Typography variant="h3">Bienvenido, {username}</Typography>
          <Chip label={label} color={isAdmin ? "success" : "primary"} />
        </Stack>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Aqui puedes consultar, crear, editar y eliminar usuarios usando el
          backend protegido con JWT.
        </Typography>

        <Typography variant="body2">
          Esta pantalla ahora incluye hooks personalizados, rutas dinamicas y un
          componente de ciclo de vida para la actividad.
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
          mb={2}
        >
          <Typography variant="h5">Lifecycle with useEffect</Typography>
          <Button
            variant="outlined"
            onClick={() => setShowLifecycle((currentValue) => !currentValue)}
          >
            {showLifecycle ? "Unmount component" : "Mount component"}
          </Button>
        </Stack>

        <Typography variant="body2" sx={{ mb: 2 }}>
          Toggle this section and edit different users to see the mount, update,
          and unmount messages in the browser console.
        </Typography>

        {showLifecycle ? (
          <LifecycleDemo
            label="selected user id"
            trackedValue={editingUserId || "none"}
          />
        ) : (
          <Alert severity="info">The lifecycle demo is currently unmounted.</Alert>
        )}
      </Paper>

      <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          {isEditing ? "Editar usuario" : "Agregar usuario"}
        </Typography>

        <Box
          component="form"
          onSubmit={saveUser}
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
              <Button variant="outlined" onClick={cancelEditing} disabled={saving}>
                Cancel
              </Button>
            )}
          </Stack>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        {message && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
      </Paper>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
          mb={2}
        >
          <div>
            <Typography variant="h5">Lista de usuarios</Typography>
            <Typography variant="body2">
              Use the details button to open a dynamic route for each user.
            </Typography>
          </div>
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
                      component={Link}
                      to={`/users/${user._id}`}
                      state={{ user }}
                      variant="contained"
                    >
                      Details
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => startEditing(user)}
                      disabled={saving || deletingUserId === user._id}
                    >
                      Edit
                    </Button>
                    <Button
                      color="error"
                      variant="outlined"
                      onClick={() => deleteUser(user)}
                      disabled={deletingUserId === user._id}
                    >
                      {deletingUserId === user._id ? "Deleting..." : "Delete"}
                    </Button>
                  </Stack>
                }
              >
                <ListItemText
                  primary={user.name}
                  secondary={`${user.username} | ID: ${user._id}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  )
}

export default HomePage
