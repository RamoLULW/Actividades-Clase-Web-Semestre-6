import { useState } from "react"
import { Box, TextField, Button, Typography, Paper } from "@mui/material"
import { API_URL } from "../config/api"

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const trimmedUsername = username.trim()
    const trimmedPassword = password.trim()

    if (trimmedUsername === '' || trimmedPassword === '') {
      setError('Please enter both username and password')
      return
    }

    try {
        setLoading(true)
        setError('')

        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: trimmedUsername,
                password: trimmedPassword,
            }),
        })

        const data = await response.json()

        if (!response.ok || !data.login || !data.token) {
            setError(data.msg || data.error || 'Login failed')
            return
        }

        onLogin({ user: data.user, token: data.token })
    }   catch {
        setError('Could not connect to the backend')
    }   finally {
        setLoading(false)
    }
    }

    return (
        <Paper elevation={4} sx={{ padding: 4, maxWidth: 400, width: '100%' }}>
            <Typography variant="h4" textAlign="center" mb={3}>
                Login
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
                <TextField
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                />
                {error && (
                    <Typography color="error" variant="body2">
                        {error}
                    </Typography>
                )}
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                    {loading ? 'Loading...' : 'Login'}
                </Button>
            </Box>
        </Paper>
    )
}

export default LoginForm
