import { Container, Typography, Paper } from "@mui/material"

function AboutPage() {
    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ padding: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Sobre este aplicacion
                </Typography>

                <Typography variant="body1">
                    Esta aplicacion fue creada con React y Material-UI para demostrar un flujo de inicio de sesion simple y rutas protegidas.
                </Typography>
            </Paper>
        </Container>
    )
}

export default AboutPage