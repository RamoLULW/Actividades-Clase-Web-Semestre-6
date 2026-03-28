import { useState } from "react"
import { Box, TextField, Button, Typography, Paper } from "@mui/material"

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (username.trim() === '' || password.trim() === '') {
      setError('Please enter both username and password')
      return
    }

    setError('')
    onLogin(username)
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
                <Button type="submit" variant="contained" color="primary">
                    Login
                </Button>
            </Box>
        </Paper>
    )
}

export default LoginForm