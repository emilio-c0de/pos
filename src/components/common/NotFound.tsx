
import { Box, Button, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
const notFound_img = new URL('/images/background/error404.jpg', import.meta.url).href
function NotFound() {
  const navigate = useNavigate()
  const toGoHome = () => {
    navigate('/')
  }
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="h1">
              404
            </Typography>
            <Typography variant="h6">
              La página que buscas no existe.
            </Typography>
            <Button variant="contained" onClick={() => toGoHome()}>Back Home</Button>
          </Grid>
          <Grid item xs={6}>
            <img
              src={notFound_img}
              alt=""
              width={500} height={250}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default NotFound
