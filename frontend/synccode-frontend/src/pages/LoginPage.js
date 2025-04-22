import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { login } from '../services/authService';
import Cookies from 'js-cookie';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ username, password, role });
      
      // Save tokens in cookies (1 hour for access, 7 days for refresh)
      Cookies.set('accessToken', response.accessToken, { expires: 1/24 });
      Cookies.set('refreshToken', response.refreshToken, { expires: 7 });
      
      // Redirect based on role
      if (role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
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
          Login to SyncCode
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          sx={{ 
            '& .MuiOutlinedInput-root': { color: 'white' },
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
            '& .MuiOutlinedInput-root': { color: 'white' },
            '& .MuiInputLabel-root': { color: '#8c8c8d' }
          }}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel sx={{ color: '#8c8c8d' }}>Role</InputLabel>
          <Select
            value={role}
            label="Role"
            onChange={(e) => setRole(e.target.value)}
            sx={{ 
              color: 'white',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#4d4d4d' }
            }}
          >
            <MenuItem value="USER">User</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
          </Select>
        </FormControl>

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
            '&:hover': { transform: 'scale(1.02)' }
          }}
        >
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default LoginPage;