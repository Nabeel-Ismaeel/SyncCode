import { Box, Typography, Container } from '@mui/material';

const HomePage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        mt: 8,
        textAlign: 'center',
        padding: '6rem 0',
        background: 'linear-gradient(45deg, #1a1a1a 30%, #2a2a2a 90%)',
        borderRadius: '2rem',
        color: 'white'
      }}>
        <Typography variant="h2" component="h1" sx={{ 
          fontWeight: 'bold',
          mb: 4,
          background: 'linear-gradient(45deg, #00ff88 30%, #00ccff 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Code Together in Real-Time
        </Typography>
        
        <Typography variant="h5" sx={{ 
          mb: 4,
          color: '#cccccc',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          Collaborate on code with your team instantly. No setup required.
        </Typography>
      </Box>
    </Container>
  );
};

export default HomePage;