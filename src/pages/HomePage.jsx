import { Container, Typography, Paper, Box } from "@mui/material"

function HomePage({ username }) {
    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ padding: 4 }}>
                <Typography variant="h3" gutterBottom>
                    Bienvenido, {username}
                </Typography>

                <Typography variant="body1" sx={{ mb: 2 }}>
                    Esta es la página de inicio de la aplicacion.
                </Typography>

                <Box>
                    <Typography variant="body2">
                        ola profe
                    </Typography>
                </Box>
            </Paper>
        </Container>
    )
}

export default HomePage
