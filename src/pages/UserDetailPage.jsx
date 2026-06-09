import { Alert, Button, Container, Paper, Stack, Typography } from "@mui/material"
import { Link, useLocation, useParams } from "react-router-dom"
import useUserDetail from "../hooks/useUserDetail"

function UserDetailPage({ token, onUnauthorized }) {
  const { userId } = useParams()
  const location = useLocation()
  const initialUser = location.state?.user || null
  const { user, loading, error, reloadUser } = useUserDetail(
    userId,
    token,
    onUnauthorized,
    initialUser
  )

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            spacing={2}
          >
            <div>
              <Typography variant="h4" gutterBottom>
                User Detail
              </Typography>
              <Typography variant="body1">
                Dynamic route loaded from <code>/users/{userId}</code>.
              </Typography>
            </div>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <Button component={Link} to="/" variant="outlined">
                Back to list
              </Button>
              <Button onClick={reloadUser} variant="contained" disabled={loading}>
                {loading ? "Loading..." : "Reload"}
              </Button>
            </Stack>
          </Stack>

          {error && <Alert severity="error">{error}</Alert>}

          {loading ? (
            <Typography>Loading user details...</Typography>
          ) : user ? (
            <Stack spacing={2}>
              <Paper variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Basic information
                </Typography>
                <Typography>
                  <strong>Name:</strong> {user.name || "Not available"}
                </Typography>
                <Typography>
                  <strong>Username:</strong> {user.username || "Not available"}
                </Typography>
                <Typography>
                  <strong>ID:</strong> {user._id || userId}
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Why this page matters
                </Typography>
                <Typography variant="body2">
                  This screen demonstrates React Router dynamic URLs and loading data
                  for a single record starting from the users list.
                </Typography>
              </Paper>
            </Stack>
          ) : (
            <Typography>No user information is available.</Typography>
          )}
        </Stack>
      </Paper>
    </Container>
  )
}

export default UserDetailPage
