import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, Alert } from '@mui/material';
import axios from 'axios';
import Header from '../components/Header';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:9090/auth/register', {
        username,
        password
      });
      
      if (response.data) {
        setRegistrationSuccess(true);
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (err) {
      setError(err.response?.data || 'Registration failed. Please try again.');
    }
  };

  return (
    <>
      <Container maxWidth="sm">
        <Box 
          component="form" 
          onSubmit={handleSubmit}
          sx={{ 
            mt: 8,
            padding: 4,
            borderRadius: 2,
            backgroundColor: '#1a1a1a',
            boxShadow: '0px 4px 20px rgba(0, 255, 136, 0.1)'
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ color: '#00ff88', mb: 4 }}>
            Create Account
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {registrationSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Registration successful! Redirecting to home...
            </Alert>
          )}

          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            sx={{ 
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: '#4d4d4d' },
                '&:hover fieldset': { borderColor: '#00ff88' },
              },
              '& .MuiInputLabel-root': { color: '#8c8c8d' }
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ 
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: '#4d4d4d' },
                '&:hover fieldset': { borderColor: '#00ff88' },
              },
              '& .MuiInputLabel-root': { color: '#8c8c8d' }
            }}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            sx={{ 
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: '#4d4d4d' },
                '&:hover fieldset': { borderColor: '#00ff88' },
              },
              '& .MuiInputLabel-root': { color: '#8c8c8d' }
            }}
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{
              mt: 3,
              py: 1.5,
              borderRadius: '20px',
              fontSize: '1.1rem',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0px 4px 15px rgba(0, 255, 136, 0.3)'
              }
            }}
          >
            Register
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default RegisterPage;