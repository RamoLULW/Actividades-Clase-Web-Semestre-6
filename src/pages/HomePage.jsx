import { useCallback, useEffect, useState } from "react"
import { 
    Container, 
    Typography, 
    Paper, 
    Box,
    TextField,
    Button,
    Stack,
    List,
    ListItem,
    ListItemText, 
} from "@mui/material"
import { API_URL, createAuthHeaders } from "../config/api"

function HomePage({ username, token, onUnauthorized }) {
    const [users, setUsers] = useState([])
    const [name, setName] = useState('')
    const [newUsername, setNewUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true)

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true)
            const response = await fetch(`${API_URL}/users`, {
                headers: createAuthHeaders(token),
            })
            const data = await response.json()

            if (response.status === 401) {
                onUnauthorized()
                return
            }

            if (!response.ok) {
                setError(data.error || 'Could not load users')
                return
            }

            setUsers(data)
            setError('')
        }   catch{
            setError('Could not connect to the backend')
        }   finally {
            setLoading(false)
        }
    }, [onUnauthorized, token])

    useEffect(() => {
        loadUsers()
    }, [loadUsers])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!name.trim() || !newUsername.trim() || !password.trim()) {
            setError('Complete all fields')
            return
        }

        try {
            const response = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: createAuthHeaders(token, true),
                body: JSON.stringify({
                    name,
                    username: newUsername,
                    password,
                }),
            })

            const data = await response.json()

            if (response.status === 401) {
                onUnauthorized()
                return
            }

            if(!response.ok) {
                setError(data.error || 'Could not create user')
                setMessage('')
                return
            }

            setUsers((currentUsers) => [...currentUsers, data])
            setName('')
            setNewUsername('')
            setPassword('')
            setError('')
            setMessage('User created successfully')
        }   catch {
            setError('Could not connect to the backend')
            setMessage('')
        }
    }

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${API_URL}/users/${id}`, {
                method: 'DELETE',
                headers: createAuthHeaders(token),
            })

            const data = await response.json()

            if (response.status === 401) {
                onUnauthorized()
                return
            }

            if(!response.ok) {
                setError(data.error || 'Could not delete user')
                setMessage('')
                return
            }

            setUsers((currentUsers) => currentUsers.filter((user) => user._id !== id))
            setError('')
            setMessage('User deleted successfully')
        }   catch {
            setError('Could not connect to the backend')
            setMessage('')
        }
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ padding: 4, mb: 3 }}>
                <Typography variant="h3" gutterBottom>
                    Bienvenido, {username}
                </Typography>

                <Typography variant="body1" sx={{ mb: 2 }}>
                    Esta es la página donde puedes ver, agregar y eliminar usuarios.
                </Typography>
            </Paper>

            <Paper elevation={3} sx={{ padding: 4, mb: 3}}>
                <Typography variant="h5" gutterBottom>
                    Agregar usuario
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                    <TextField
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        label="Username"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button type="submit" variant="contained">
                        Agregar
                    </Button>
                </Box>

                {error && (
                    <Typography color="error" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                )}

                {message && (
                    <Typography color="primary" sx={{ mt: 2 }}>
                        {message}
                    </Typography>
                )}
            </Paper>

            <Paper elevation={3} sx={{ padding: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h5">
                        Lista de usuarios
                    </Typography>
                    <Button variant="outlined" onClick={loadUsers}>
                        Recargar
                    </Button>
                </Stack>

                {loading ? (
                    <Typography>Cargando usuarios...</Typography>
                ) : users.length === 0 ? (
                    <Typography>No hay usuarios todavia.</Typography>
                ) : (
                    <List>
                        {users.map((user) => (
                            <ListItem
                                key={user._id}
                                secondaryAction={
                                    <Button
                                        color="error"
                                        variant="outlined"
                                        onClick={() => handleDelete(user._id)}
                                    >
                                        Eliminar
                                    </Button>
                                }
                            >
                                <ListItemText
                                    primary={user.name}
                                    secondary={user.username}
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
