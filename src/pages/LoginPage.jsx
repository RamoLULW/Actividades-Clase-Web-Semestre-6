import { Container, Box } from "@mui/material"
import LoginForm from "../components/LoginForm"

function LoginPage({ onLogin }) {
    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <LoginForm onLogin={onLogin} />
            </Box>
        </Container>
    )
}

export default LoginPage