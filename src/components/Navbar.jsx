import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material"
import { Link } from "react-router-dom"

function Navbar({ username, onLogout }) {
  return (
    <AppBar position="static">
        <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Aplicacion para clase de web
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button color="inherit" component={Link} to="/">
                    Home
                </Button>
                <Button color="inherit" component={Link} to="/about">
                    About
                </Button>
                <Typography variant="body1">
                    {username}
                </Typography>
                <Button color="inherit" onClick={onLogout}>
                    Logout
                </Button>
            </Box>
        </Toolbar>
    </AppBar>
  )
}

export default Navbar
