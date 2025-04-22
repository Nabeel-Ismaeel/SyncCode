import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  TextField,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogTitle,
  Box,
  IconButton
} from '@mui/material';
import { Delete, Add, Code, Visibility, Share } from '@mui/icons-material';
import { 
  getEditProjects, 
  getViewProjects, 
  createProject, 
  deleteProject 
} from '../services/projectService';
import axios from '../utils/axiosInstance';

const ProjectCard = ({ project, onDelete, isEditable }) => {
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [permissionType, setPermissionType] = useState('edit');
  const [shareError, setShareError] = useState('');
  const [shareSuccess, setShareSuccess] = useState('');
  const [sharing, setSharing] = useState(false);

  const handleCardClick = () => {
    const route = isEditable ? `/environment/${project.id}` : `/viewProject/${project.id}`;
    navigate(route);
  };

  const handleShareProject = async (e) => {
    e.stopPropagation();
    setSharing(true);
    try {
      const endpoint = permissionType === 'edit' 
        ? '/client/shareWithEdit' 
        : '/client/shareWithView';

      await axios.post(endpoint, {
        projectID: project.id,
        targetUsername: username
      });

      setShareSuccess(`Successfully shared with ${username} (${permissionType} access)`);
      setUsername('');
      setTimeout(() => {
        setShareOpen(false);
        setShareSuccess('');
      }, 2000);
    } catch (err) {
      setShareError(err.response?.data?.message || 'Failed to share project');
    } finally {
      setSharing(false);
    }
  };

  return (
    <Card 
      sx={{ 
        minWidth: 300,
        m: 2,
        background: 'linear-gradient(145deg, #1a1a1a 30%, #2d2d2d 90%)',
        border: '1px solid #2a2a2a',
        borderRadius: '16px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': { 
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0, 255, 136, 0.1)'
        }
      }}
    >
      <CardContent sx={{ position: 'relative' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }} onClick={handleCardClick}>
          <Code sx={{ 
            fontSize: 32, 
            color: isEditable ? '#00ff88' : '#00ccff',
            filter: 'drop-shadow(0 0 8px rgba(0, 255, 136, 0.2))'
          }} />
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            {project.name}
          </Typography>
        </Box>

        <Box 
          sx={{ 
            position: 'absolute', 
            top: 16, 
            right: 16, 
            display: 'flex', 
            gap: 1 
          }}
        >
          {isEditable && (
            <IconButton
              sx={{
                color: '#00ccff',
                '&:hover': { backgroundColor: 'rgba(0, 204, 255, 0.1)' }
              }}
              onClick={(e) => {
                e.stopPropagation();
                setShareOpen(true);
                setUsername('');
                setPermissionType('edit');
                setShareError('');
                setShareSuccess('');
              }}
              aria-label="Share project"
            >
              <Share />
            </IconButton>
          )}

          {/* Always show delete button - backend handles permissions */}
          <IconButton
            sx={{
              color: '#ff4444',
              '&:hover': { backgroundColor: 'rgba(255, 68, 68, 0.1)' }
            }}
            onClick={(e) => {
              e.stopPropagation();
              setConfirmOpen(true);
            }}
            aria-label="Delete project"
          >
            <Delete />
          </IconButton>
        </Box>

        {/* Share Dialog */}
        <Dialog 
          open={shareOpen} 
          onClose={() => setShareOpen(false)}
          PaperProps={{
            sx: {
              background: '#1a1a1a',
              borderRadius: '16px',
              border: '1px solid #2a2a2a',
              p: 3
            }
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <DialogTitle sx={{ color: '#00ff88', fontSize: '1.5rem' }}>
            Share "{project.name}"
          </DialogTitle>
          
          <Box sx={{ minWidth: 400 }}>
            {shareError && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>
                {shareError}
              </Alert>
            )}
            {shareSuccess && (
              <Alert severity="success" sx={{ mb: 2, borderRadius: '12px' }}>
                {shareSuccess}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': { color: '#00ff88' },
                '& .MuiInputLabel-root': { color: '#8c8c8d' },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#4d4d4d !important'
                }
              }}
            />

            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              mb: 3,
              '& button': {
                flex: 1,
                py: 1.5,
                borderRadius: '12px',
                border: '1px solid #00ff88',
                transition: 'all 0.2s ease'
              }
            }}>
              <Button
                variant={permissionType === 'edit' ? 'contained' : 'outlined'}
                onClick={() => setPermissionType('edit')}
                sx={{
                  background: permissionType === 'edit' 
                    ? 'linear-gradient(45deg, #00ff88 30%, #00ccff 90%)' 
                    : 'transparent',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: permissionType !== 'edit' 
                      ? '0 0 12px rgba(0, 255, 136, 0.2)' 
                      : 'none'
                  }
                }}
              >
                Edit Access
              </Button>
              <Button
                variant={permissionType === 'view' ? 'contained' : 'outlined'}
                onClick={() => setPermissionType('view')}
                sx={{
                  background: permissionType === 'view' 
                    ? 'linear-gradient(45deg, #00ff88 30%, #00ccff 90%)' 
                    : 'transparent',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: permissionType !== 'view' 
                      ? '0 0 12px rgba(0, 255, 136, 0.2)' 
                      : 'none'
                  }
                }}
              >
                View Access
              </Button>
            </Box>

            <Button
              fullWidth
              variant="contained"
              onClick={handleShareProject}
              disabled={sharing}
              startIcon={sharing ? <CircularProgress size={20} /> : null}
              sx={{
                py: 1.5,
                borderRadius: '12px',
                background: 'linear-gradient(45deg, #00ff88 30%, #00ccff 90%)',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 4px 12px rgba(0, 255, 136, 0.3)'
                }
              }}
            >
              {sharing ? 'Sharing...' : 'Share Project'}
            </Button>
          </Box>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog 
          open={confirmOpen} 
          onClose={() => setConfirmOpen(false)}
          PaperProps={{
            sx: {
              background: '#1a1a1a',
              borderRadius: '16px',
              border: '1px solid #2a2a2a'
            }
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <DialogTitle sx={{ color: '#fff' }}>
            Delete "{project.name}" permanently?
          </DialogTitle>
          <DialogActions>
            <Button 
              onClick={() => setConfirmOpen(false)}
              sx={{ 
                color: '#8c8c8d',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)'
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project.id);
                setConfirmOpen(false);
              }}
              startIcon={<Delete />}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 68, 68, 0.1)'
                }
              }}
            >
              Confirm Delete
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

const UserPage = () => {
  const [editProjects, setEditProjects] = useState([]);
  const [viewProjects, setViewProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    try {
      const [editable, viewable] = await Promise.all([
        getEditProjects(),
        getViewProjects()
      ]);
      setEditProjects(editable);
      setViewProjects(viewable);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      setError('Project name cannot be empty');
      return;
    }
    
    try {
      const createdProject = await createProject(newProjectName);
      setEditProjects([...editProjects, createdProject]);
      setNewProjectName('');
    } catch (err) {
      setError('Failed to create project');
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteProject(projectId);
      await fetchProjects();  // Refresh the list after deletion
    } catch (err) {
      setError('Failed to delete project');
    }
  };

  if (loading) {
    return (
      <Container sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        mt: 4,
        gap: 4,
        flexWrap: 'wrap'
      }}>
        {[1, 2, 3].map((i) => (
          <Card key={i} sx={{ 
            width: 300,
            height: 120,
            background: '#1a1a1a',
            borderRadius: '16px',
            animation: 'pulse 1.5s infinite',
            '@keyframes pulse': {
              '0%': { opacity: 0.8 },
              '50%': { opacity: 0.4 },
              '100%': { opacity: 0.8 }
            }
          }} />
        ))}
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Box sx={{ 
        mb: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 4
      }}>
        <Typography variant="h3" sx={{ 
          color: '#00ff88',
          fontWeight: 700,
          textShadow: '0 0 16px rgba(0, 255, 136, 0.3)'
        }}>
          Your Projects
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexGrow: 1, maxWidth: 600 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="New Project"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            InputProps={{
              sx: {
                color: '#00ff88',
                borderRadius: '12px',
                '& fieldset': { borderColor: '#4d4d4d' },
                '&:hover fieldset': { borderColor: '#00ff88 !important' },
                '&.Mui-focused fieldset': { borderColor: '#00ff88 !important' }
              }
            }}
            InputLabelProps={{
              sx: { 
                color: '#8c8c8d',
                '&.Mui-focused': { color: '#00ff88' }
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleCreateProject}
            startIcon={<Add />}
            sx={{
              px: 4,
              borderRadius: '12px',
              background: 'linear-gradient(45deg, #00ff88 30%, #00ccff 90%)',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0 4px 12px rgba(0, 255, 136, 0.3)'
              }
            }}
          >
            Create
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ 
          mb: 4,
          borderRadius: '12px',
          background: 'rgba(255, 76, 76, 0.1)',
          border: '1px solid #ff4c4c'
        }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" sx={{ 
          mb: 4,
          color: '#00ccff',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Code sx={{ fontSize: 32 }} />
          Editable Projects
        </Typography>
        <Grid container spacing={3}>
          {editProjects.map(project => (
            <Grid item key={project.id} xs={12} sm={6} md={4} lg={3}>
              <ProjectCard 
                project={project} 
                onDelete={handleDeleteProject}
                isEditable={true}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" sx={{ 
          mb: 4,
          color: '#00ccff',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Visibility sx={{ fontSize: 32 }} />
          View-only Projects
        </Typography>
        <Grid container spacing={3}>
          {viewProjects.map(project => (
            <Grid item key={project.id} xs={12} sm={6} md={4} lg={3}>
              <ProjectCard 
                project={project} 
                onDelete={handleDeleteProject}
                isEditable={false}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};


export default UserPage;