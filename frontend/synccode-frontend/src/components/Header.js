// src/components/Header.js
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../services/authService';

const Header = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1a1a1a' }}>
      <Toolbar>
        <Typography 
          variant="h4" 
          component={Link} 
          to="/"
          sx={{ 
            flexGrow: 1,
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: '#00ff88',
            textDecoration: 'none',
          }}
        >
          SyncCode
        </Typography>

        {isHomePage ? (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Button 
              component={Link}
              to="/login"
              variant="contained" 
              color="secondary"
              sx={{ 
                textTransform: 'none',
                borderRadius: '20px',
                '&:hover': { transform: 'scale(1.05)' }
              }}
            >
              Login
            </Button>
            <Button 
              component={Link}
              to="/register"
              variant="contained" 
              color="primary"
              sx={{ 
                textTransform: 'none',
                borderRadius: '20px',
                '&:hover': { transform: 'scale(1.05)' }
              }}
            >
              Register
            </Button>
          </Box>
        ) : (
          <Button 
            variant="contained" 
            color="error"
            onClick={() => {
              logout();
              window.location.href = '/';
            }}
            sx={{ 
              textTransform: 'none',
              borderRadius: '20px',
              '&:hover': { 
                transform: 'scale(1.05)',
                backgroundColor: '#ff4444'
              }
            }}
          >
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;