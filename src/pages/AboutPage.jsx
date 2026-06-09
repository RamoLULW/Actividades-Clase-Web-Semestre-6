import { Container, Typography, Paper } from "@mui/material"

function AboutPage() {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>
          Sobre esta aplicacion
        </Typography>

        <Typography variant="body1" paragraph>
          Esta aplicacion fue creada con React y Material UI para demostrar inicio
          de sesion, rutas protegidas y manejo de usuarios conectado al backend.
        </Typography>

        <Typography variant="body1" paragraph>
          Para la actividad de URL + Hooks + LifeCycle se agregaron rutas dinamicas
          para ver el detalle de un usuario, hooks personalizados para autenticacion
          y permisos, y un componente que imprime en consola cuando se monta,
          actualiza y desmonta.
        </Typography>
      </Paper>
    </Container>
  )
}

export default AboutPage
