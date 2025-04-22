import React, { useState, useEffect } from 'react';
import { 
  Container, Box, Button, Typography, Modal, TextField, Grid, Card, CardContent, CardActions, Alert 
} from '@mui/material';
import Cookies from 'js-cookie';
import axios from '../utils/axiosInstance';


const AdminPage = () => {
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [projects, setProjects] = useState([]);
  const [showProjects, setShowProjects] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddAdmin = async () => {
    try {
      await axios.post('http://localhost:9090/admin/register', {
        username: adminUsername,
        password: adminPassword
      });
      setSuccessMsg('Admin registered successfully!');
      setErrorMsg('');
      setShowAddAdmin(false);
      setAdminUsername('');
      setAdminPassword('');
    } catch (err) {
      setErrorMsg(err.response?.data || 'Failed to register admin');
      setSuccessMsg('');
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:9090/admin/allProject');
      setProjects(response.data);
      setShowProjects(true);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProject = async (id) => {
    try {
      const token = Cookies.get('accessToken');
      await axios.get(`http://localhost:9090/project/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Typography variant="h4" sx={{ mb: 4, color: '#00ff88' }}>Admin Dashboard</Typography>

      {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}
      {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => setShowAddAdmin(true)}
        >
          Add New Admin
        </Button>
        <Button 
          variant="outlined" 
          color="secondary" 
          onClick={fetchProjects}
        >
          Edit Projects
        </Button>
      </Box>

      {/* Modal for Add Admin */}
      <Modal open={showAddAdmin} onClose={() => setShowAddAdmin(false)}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          bgcolor: '#1a1a1a', boxShadow: 24, p: 4, borderRadius: 2, width: 400
        }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#00ff88' }}>Register New Admin</Typography>
          <TextField
            label="Username"
            fullWidth
            value={adminUsername}
            onChange={(e) => setAdminUsername(e.target.value)}
            sx={{ mb: 2, input: { color: 'white' }, label: { color: '#8c8c8d' } }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            sx={{ mb: 2, input: { color: 'white' }, label: { color: '#8c8c8d' } }}
          />
          <Button variant="contained" fullWidth onClick={handleAddAdmin}>
            Submit
          </Button>
        </Box>
      </Modal>

      {/* Project List */}
      {showProjects && (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <Card sx={{ backgroundColor: '#121212', color: 'white' }}>
                <CardContent>
                  <Typography variant="h6">{project.name}</Typography>
                  <Typography variant="body2" sx={{ wordWrap: 'break-word' }}>{project.path}</Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    color="error" 
                    onClick={() => deleteProject(project.id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default AdminPage;
