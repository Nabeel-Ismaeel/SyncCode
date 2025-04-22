// import { useState, useEffect, useMemo } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//   Box,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   IconButton,
//   Typography,
//   CircularProgress,
//   Alert,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
//   Menu,
//   MenuItem,
//   Divider
// } from '@mui/material';
// import {
//   Folder,
//   InsertDriveFile,
//   Add,
//   Delete,
//   Code,
//   PlayArrow
// } from '@mui/icons-material';
// import TerminalIcon from '@mui/icons-material/Terminal';
// import Editor from '@monaco-editor/react';
// import { v4 as uuidv4 } from 'uuid';
// import SockJS from 'sockjs-client';
// import { Client } from '@stomp/stompjs';
// import axios from '../utils/axiosInstance';
// import { TextareaAutosize } from '@mui/base';

// let runCodeClient = null;
// let editorSyncClient = null;

// const detectLanguage = (filename = '') => {
//   const ext = filename.split('.').pop();
//   switch (ext) {
//     case 'js': return 'javascript';
//     case 'ts': return 'typescript';
//     case 'py': return 'python';
//     case 'java': return 'java';
//     case 'html': return 'html';
//     case 'css': return 'css';
//     case 'json': return 'json';
//     case 'md': return 'markdown';
//     case 'xml': return 'xml';
//     case 'c': return 'c';
//     case 'cpp': return 'cpp';
//     case 'cs': return 'csharp';
//     case 'go': return 'go';
//     case 'sh': return 'shell';
//     case 'yaml':
//     case 'yml': return 'yaml';
//     default: return 'plaintext';
//   }
// };

// const StructureItem = ({
//   item,
//   depth,
//   onDelete,
//   expandedFolders,
//   toggleFolder,
//   onCreateClick,
//   onSnippetSelect
// }) => {
//   const [menuAnchor, setMenuAnchor] = useState(null);
//   const isFolder = 'folders' in item;
//   const isExpanded = expandedFolders.has(item.path);

//   const handleClick = () => {
//     if (isFolder) toggleFolder(item.path);
//     else onSnippetSelect(item);
//   };

//   return (
//     <>
//       <ListItem disablePadding sx={{ pl: 2 + depth * 2 }} onContextMenu={(e) => {
//         e.preventDefault();
//         setMenuAnchor(e.currentTarget);
//       }}>
//         <ListItemButton onClick={handleClick}>
//           <ListItemIcon sx={{ minWidth: 32 }}>
//             {isFolder ? <Folder /> : <InsertDriveFile />}
//           </ListItemIcon>
//           <ListItemText primary={item.name} primaryTypographyProps={{ variant: 'body2' }} />
//         </ListItemButton>
//         {isFolder && (
//           <IconButton size="small" onClick={() => onCreateClick(item.path)}>
//             <Add fontSize="small" />
//           </IconButton>
//         )}
//         <Menu
//           anchorEl={menuAnchor}
//           open={Boolean(menuAnchor)}
//           onClose={() => setMenuAnchor(null)}
//         >
//           <MenuItem onClick={() => onDelete(item)}>
//             <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
//           </MenuItem>
//         </Menu>
//       </ListItem>

//       {isFolder && isExpanded && (
//         <List disablePadding>
//           {item.folders?.map(child => (
//             <StructureItem
//               key={child.path}
//               item={child}
//               depth={depth + 1}
//               onDelete={onDelete}
//               expandedFolders={expandedFolders}
//               toggleFolder={toggleFolder}
//               onCreateClick={onCreateClick}
//               onSnippetSelect={onSnippetSelect}
//             />
//           ))}
//           {item.files?.map(child => (
//             <StructureItem
//               key={child.path}
//               item={child}
//               depth={depth + 1}
//               onDelete={onDelete}
//               expandedFolders={expandedFolders}
//               toggleFolder={toggleFolder}
//               onCreateClick={onCreateClick}
//               onSnippetSelect={onSnippetSelect}
//             />
//           ))}
//         </List>
//       )}
//       <Divider variant="inset" component="li" />
//     </>
//   );
// };

// const ProjectStructure = ({ projectID, onSnippetSelect }) => {
//   const [structure, setStructure] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [createOpen, setCreateOpen] = useState(false);
//   const [newItemName, setNewItemName] = useState('');
//   const [createType, setCreateType] = useState('folder');
//   const [expandedFolders, setExpandedFolders] = useState(new Set());
//   const [currentParentPath, setCurrentParentPath] = useState(projectID);

//   const toggleFolder = (path) => {
//     setExpandedFolders(prev => {
//       const next = new Set(prev);
//       next.has(path) ? next.delete(path) : next.add(path);
//       return next;
//     });
//   };

//   const openCreateDialog = (parentPath) => {
//     setCurrentParentPath(parentPath);
//     setCreateOpen(true);
//   };

//   useEffect(() => {
//     const loadStructure = async () => {
//       try {
//         const { data } = await axios.get(`/project/projectStructure/${projectID}`);
//         setStructure(data);
//       } catch {
//         setError('Failed to load project structure');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (projectID) loadStructure();
//   }, [projectID]);

//   const handleCreateItem = async () => {
//     try {
//       const endpoint = createType === 'folder' ? '/folder/create' : '/snippet/create';
//       await axios.post(endpoint, {
//         name: newItemName,
//         parentPath: currentParentPath
//       });

//       const { data } = await axios.get(`/project/projectStructure/${projectID}`);
//       setStructure(data);
//       setCreateOpen(false);
//       setNewItemName('');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to create item');
//     }
//   };

//   const handleDeleteItem = async (item) => {
//     try {
//       const endpoint = 'folders' in item ? '/folder/delete' : '/snippet/delete';
//       await axios.post(endpoint, { path: item.path });

//       const { data } = await axios.get(`/project/projectStructure/${projectID}`);
//       setStructure(data);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to delete item');
//     }
//   };

//   if (loading) return <CircularProgress sx={{ mt: 4 }} />;

//   return (
//     <Box sx={{ width: 300, height: '100vh', bgcolor: 'background.paper' }}>
//       <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
//         <Code color="primary" />
//         <Typography variant="h6">Project Explorer</Typography>
//         <IconButton 
//           size="small" 
//           onClick={() => openCreateDialog(projectID)}
//           sx={{ ml: 'auto' }}
//         >
//           <Add />
//         </IconButton>
//       </Box>

//       {error && <Alert severity="error" sx={{ mx: 2, mb: 1 }}>{error}</Alert>}

//       <List dense sx={{ overflow: 'auto', height: 'calc(100vh - 120px)' }}>
//         {structure?.folders?.map(folder => (
//           <StructureItem
//             key={folder.path}
//             item={folder}
//             depth={0}
//             onDelete={handleDeleteItem}
//             expandedFolders={expandedFolders}
//             toggleFolder={toggleFolder}
//             onCreateClick={openCreateDialog}
//             onSnippetSelect={onSnippetSelect}
//           />
//         ))}
//         {structure?.files?.map(file => (
//           <StructureItem
//             key={file.path}
//             item={file}
//             depth={0}
//             onDelete={handleDeleteItem}
//             expandedFolders={expandedFolders}
//             toggleFolder={toggleFolder}
//             onCreateClick={openCreateDialog}
//             onSnippetSelect={onSnippetSelect}
//           />
//         ))}
//       </List>

//       <Dialog open={createOpen} onClose={() => setCreateOpen(false)}>
//         <DialogTitle>Create New</DialogTitle>
//         <DialogContent sx={{ pt: 1 }}>
//           <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
//             <Button
//               variant={createType === 'folder' ? 'contained' : 'outlined'}
//               onClick={() => setCreateType('folder')}
//               size="small"
//             >
//               Folder
//             </Button>
//             <Button
//               variant={createType === 'snippet' ? 'contained' : 'outlined'}
//               onClick={() => setCreateType('snippet')}
//               size="small"
//             >
//               Snippet
//             </Button>
//           </Box>
//           <TextField
//             autoFocus
//             fullWidth
//             size="small"
//             label="Name"
//             value={newItemName}
//             onChange={(e) => setNewItemName(e.target.value)}
//             onKeyPress={(e) => e.key === 'Enter' && handleCreateItem()}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
//           <Button 
//             onClick={handleCreateItem} 
//             disabled={!newItemName}
//             variant="contained"
//           >
//             Create
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// const EnvironmentPage = () => {
//   const { projectID } = useParams();
//   const navigate = useNavigate();
//   const clientToken = useMemo(() => uuidv4(), []);

//   const [selectedSnippet, setSelectedSnippet] = useState(null);
//   const [editorContent, setEditorContent] = useState('');
//   const [language, setLanguage] = useState('plaintext');
//   const [output, setOutput] = useState('');
//   const [lastLocalUpdate, setLastLocalUpdate] = useState(null);

//   const [showTerminal, setShowTerminal] = useState(false);
//   const [terminalInput, setTerminalInput] = useState('');
//   const [terminalOutput, setTerminalOutput] = useState('');

//   useEffect(() => {
//     const runCodeSocket = new SockJS('http://localhost:9090/code-websocket');
//     const runCodeClientInstance = new Client({
//       webSocketFactory: () => runCodeSocket,
//       onConnect: () => {
//         runCodeClientInstance.subscribe(`/topic/output/${clientToken}`, (message) => {
//           const msg = JSON.parse(message.body);
//           setOutput(prev => prev + msg.output + (msg.output.endsWith('\n') ? '' : '\n'));
//         });
//       },
//       debug: (str) => console.log(str),
//       reconnectDelay: 5000,
//     });
//     runCodeClientInstance.activate();
//     runCodeClient = runCodeClientInstance;

//     const editorSyncSocket = new SockJS('http://localhost:9090/update-snippet');
//     const editorSyncClientInstance = new Client({
//       webSocketFactory: () => editorSyncSocket,
//       onConnect: () => {
//         if (selectedSnippet) {
//           editorSyncClientInstance.subscribe(`/topic/editor/${selectedSnippet.id}`, (message) => {
//             const update = JSON.parse(message.body);
//             if (update.content !== lastLocalUpdate) {
//               setEditorContent(update.content);
//             }
//           });
//         }
//       },
//       debug: (str) => console.log(str),
//       reconnectDelay: 5000,
//     });
//     editorSyncClientInstance.activate();
//     editorSyncClient = editorSyncClientInstance;

//     return () => {
//       if (runCodeClient?.active) runCodeClient.deactivate();
//       if (editorSyncClient?.active) editorSyncClient.deactivate();
//     };
//   }, [clientToken, selectedSnippet?.id]);

//   const loadSnippetContent = async (snippet) => {
//     try {
//       const { data } = await axios.post('/snippet/load', {
//         projectID,
//         snippetID: snippet.id
//       });
//       setSelectedSnippet(snippet);
//       setEditorContent(data);
//       setLanguage(detectLanguage(snippet.name));
//       setOutput('');
//     } catch (err) {
//       console.error('Failed to load snippet content', err);
//     }
//   };

//   const updateSnippetContent = async (content) => {
//     try {
//       await axios.post('/snippet/update', {
//         projectID,
//         snippetID: selectedSnippet.id,
//         content
//       });
//     } catch (err) {
//       console.error('Failed to update snippet', err);
//     }
//   };

//   const runCode = () => {
//     if (runCodeClient?.connected && selectedSnippet) {
//       runCodeClient.publish({
//         destination: '/app/sendCode',
//         body: JSON.stringify({
//           code: editorContent,
//           snippetName: selectedSnippet.name,
//           clientToken
//         })
//       });
//     }
//   };

//   const syncEditorContent = (content) => {
//     if (editorSyncClient?.connected && selectedSnippet) {
//       editorSyncClient.publish({
//         destination: '/app/editor/change',
//         body: JSON.stringify({
//           content,
//           snippetID: selectedSnippet.id
//         })
//       });
//       setLastLocalUpdate(content);
//     }
//   };

//   const runVCSCommand = async () => {
//     if (!terminalInput.trim()) return;
//     try {
//       const { data } = await axios.post('/vcs', {
//         command: terminalInput,
//         projectID
//       });
//       setTerminalOutput(prev => prev + `> ${terminalInput}\n${data}\n`);
//       setTerminalInput('');
//     } catch (err) {
//       setTerminalOutput(prev => prev + `> ${terminalInput}\nError: ${err.response?.data || err.message}\n`);
//       setTerminalInput('');
//     }
//   };

//   return (
//     <Box sx={{ display: 'flex', height: '100vh' }}>
//       <ProjectStructure
//         projectID={projectID}
//         onSnippetSelect={loadSnippetContent}
//       />
//       <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
//         {selectedSnippet ? (
//           <>
//             <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between' }}>
//               <Typography variant="subtitle2">{selectedSnippet.name}</Typography>
//               <Box sx={{ display: 'flex', gap: 1 }}>
//                 <Button
//                   size="small"
//                   variant="contained"
//                   startIcon={<PlayArrow />}
//                   onClick={runCode}
//                 >
//                   Run
//                 </Button>
//                 <Button
//                   size="small"
//                   variant="outlined"
//                   startIcon={<TerminalIcon />}
//                   onClick={() => setShowTerminal(prev => !prev)}
//                 >
//                   VCS
//                 </Button>
//               </Box>
//             </Box>
//             <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
//               <Box sx={{ flex: showTerminal ? 0.7 : 1 }}>
//                 <Editor
//                   height="100%"
//                   language={language}
//                   value={editorContent}
//                   onChange={(val) => {
//                     setEditorContent(val);
//                     updateSnippetContent(val);
//                     syncEditorContent(val);
//                   }}
//                   options={{
//                     fontSize: 14,
//                     fontFamily: 'monospace',
//                     minimap: { enabled: false },
//                     scrollBeyondLastLine: false,
//                     automaticLayout: true,
//                   }}
//                 />
//               </Box>
//               {showTerminal && (
//                 <Box sx={{
//                   flex: 0.3,
//                   borderTop: '1px solid #ddd',
//                   background: '#000',
//                   color: '#0f0',
//                   fontFamily: 'monospace',
//                   display: 'flex',
//                   flexDirection: 'column'
//                 }}>
//                   <Typography variant="body2" sx={{ p: 1, color: '#0f0' }}>
//                     Terminal
//                   </Typography>
//                   <TextareaAutosize
//                     minRows={5}
//                     value={terminalOutput}
//                     readOnly
//                     style={{
//                       width: '100%',
//                       background: '#000',
//                       color: '#0f0',
//                       border: 'none',
//                       resize: 'none',
//                       flex: 1
//                     }}
//                   />
//                   <TextField
//                     size="small"
//                     variant="filled"
//                     placeholder="Enter VCS command..."
//                     value={terminalInput}
//                     onChange={(e) => setTerminalInput(e.target.value)}
//                     onKeyDown={(e) => e.key === 'Enter' && runVCSCommand()}
//                     sx={{
//                       input: { color: '#0f0', backgroundColor: '#111' },
//                       px: 1,
//                     }}
//                   />
//                 </Box>
//               )}
//             </Box>
//           </>
//         ) : (
//           <Box sx={{
//             flex: 1,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             border: '2px dashed',
//             borderColor: 'divider',
//             borderRadius: 2,
//             m: 2
//           }}>
//             <Typography variant="h6" color="text.secondary">
//               Select a snippet to view or edit
//             </Typography>
//           </Box>
//         )}
//       </Box>
//       <Box sx={{ width: 350, p: 2, bgcolor: '#f9f9f9', borderLeft: '1px solid #ddd', overflow: 'auto' }}>
//         <Typography variant="subtitle1" gutterBottom>Output</Typography>
//         <pre style={{
//           whiteSpace: 'pre-wrap',
//           fontFamily: 'monospace',
//           fontSize: '0.875rem',
//           margin: 0
//         }}>{output}</pre>
//       </Box>
//     </Box>
//   );
// };

// export default EnvironmentPage;




import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import {
  Folder,
  InsertDriveFile,
  Add,
  Delete,
  Code,
  PlayArrow
} from '@mui/icons-material';
import TerminalIcon from '@mui/icons-material/Terminal';
import Editor from '@monaco-editor/react';
import { v4 as uuidv4 } from 'uuid';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import axios from '../utils/axiosInstance';
import { TextareaAutosize } from '@mui/base';

let runCodeClient = null;
let editorSyncClient = null;

const detectLanguage = (filename = '') => {
  const ext = filename.split('.').pop();
  switch (ext) {
    case 'js': return 'javascript';
    case 'ts': return 'typescript';
    case 'py': return 'python';
    case 'java': return 'java';
    case 'html': return 'html';
    case 'css': return 'css';
    case 'json': return 'json';
    case 'md': return 'markdown';
    case 'xml': return 'xml';
    case 'c': return 'c';
    case 'cpp': return 'cpp';
    case 'cs': return 'csharp';
    case 'go': return 'go';
    case 'sh': return 'shell';
    case 'yaml':
    case 'yml': return 'yaml';
    default: return 'plaintext';
  }
};

const StructureItem = ({
  item,
  depth,
  onDelete,
  expandedFolders,
  toggleFolder,
  onCreateClick,
  onSnippetSelect
}) => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const isFolder = 'folders' in item;
  const isExpanded = expandedFolders.has(item.path);

  const handleClick = () => {
    if (isFolder) toggleFolder(item.path);
    else onSnippetSelect(item);
  };

  return (
    <>
      <ListItem disablePadding sx={{ pl: 2 + depth * 2 }} onContextMenu={(e) => {
        e.preventDefault();
        setMenuAnchor(e.currentTarget);
      }}>
        <ListItemButton onClick={handleClick}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            {isFolder ? <Folder /> : <InsertDriveFile />}
          </ListItemIcon>
          <ListItemText primary={item.name} primaryTypographyProps={{ variant: 'body2' }} />
        </ListItemButton>
        {isFolder && (
          <IconButton size="small" onClick={() => onCreateClick(item.path)}>
            <Add fontSize="small" />
          </IconButton>
        )}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
        >
          <MenuItem onClick={() => onDelete(item)}>
            <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
          </MenuItem>
        </Menu>
      </ListItem>

      {isFolder && isExpanded && (
        <List disablePadding>
          {item.folders?.map(child => (
            <StructureItem
              key={child.path}
              item={child}
              depth={depth + 1}
              onDelete={onDelete}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
              onCreateClick={onCreateClick}
              onSnippetSelect={onSnippetSelect}
            />
          ))}
          {item.files?.map(child => (
            <StructureItem
              key={child.path}
              item={child}
              depth={depth + 1}
              onDelete={onDelete}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
              onCreateClick={onCreateClick}
              onSnippetSelect={onSnippetSelect}
            />
          ))}
        </List>
      )}
      <Divider variant="inset" component="li" />
    </>
  );
};

const ProjectStructure = ({ projectID, onSnippetSelect }) => {
  const [structure, setStructure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [createType, setCreateType] = useState('folder');
  const [expandedFolders, setExpandedFolders] = useState(new Set());
  const [currentParentPath, setCurrentParentPath] = useState(projectID);

  const navigate = useNavigate();

  const toggleFolder = (path) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      next.has(path) ? next.delete(path) : next.add(path);
      return next;
    });
  };

  const openCreateDialog = (parentPath) => {
    setCurrentParentPath(parentPath);
    setCreateOpen(true);
  };

  useEffect(() => {
    const loadStructure = async () => {
      try {
        const { data } = await axios.get(`/project/projectStructure/${projectID}`);
        setStructure(data);
      } catch {
        setError('Failed to load project structure');
      } finally {
        setLoading(false);
      }
    };

    if (projectID) loadStructure();
  }, [projectID]);

  const handleCreateItem = async () => {
    try {
      const endpoint = createType === 'folder' ? '/folder/create' : '/snippet/create';
      await axios.post(endpoint, {
        name: newItemName,
        parentPath: currentParentPath
      });

      const { data } = await axios.get(`/project/projectStructure/${projectID}`);
      setStructure(data);
      setCreateOpen(false);
      setNewItemName('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create item');
    }
  };

  const handleDeleteItem = async (item) => {
    try {
      const endpoint = 'folders' in item ? '/folder/delete' : '/snippet/delete';
      await axios.post(endpoint, { path: item.path });

      const { data } = await axios.get(`/project/projectStructure/${projectID}`);
      setStructure(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete item');
    }
  };

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;

  return (
    <Box sx={{ width: 300, height: '100vh', bgcolor: 'background.paper' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Code color="primary" />
        <Typography variant="h6">Project Explorer</Typography>
        <IconButton 
          size="small" 
          onClick={() => openCreateDialog(projectID)}
          sx={{ ml: 'auto' }}
        >
          <Add />
        </IconButton>
      </Box>

      {/* View Comments Button */}
      <Box sx={{ px: 2, mb: 1 }}>
        <Button
          variant="outlined"
          onClick={() => navigate(`/comments/${projectID}`)}
          sx={{ width: '100%', borderRadius: 2 }}
        >
          View Comments
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mx: 2, mb: 1 }}>{error}</Alert>}

      <List dense sx={{ overflow: 'auto', height: 'calc(100vh - 120px)' }}>
        {structure?.folders?.map(folder => (
          <StructureItem
            key={folder.path}
            item={folder}
            depth={0}
            onDelete={handleDeleteItem}
            expandedFolders={expandedFolders}
            toggleFolder={toggleFolder}
            onCreateClick={openCreateDialog}
            onSnippetSelect={onSnippetSelect}
          />
        ))}
        {structure?.files?.map(file => (
          <StructureItem
            key={file.path}
            item={file}
            depth={0}
            onDelete={handleDeleteItem}
            expandedFolders={expandedFolders}
            toggleFolder={toggleFolder}
            onCreateClick={openCreateDialog}
            onSnippetSelect={onSnippetSelect}
          />
        ))}
      </List>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)}>
        <DialogTitle>Create New</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button
              variant={createType === 'folder' ? 'contained' : 'outlined'}
              onClick={() => setCreateType('folder')}
              size="small"
            >
              Folder
            </Button>
            <Button
              variant={createType === 'snippet' ? 'contained' : 'outlined'}
              onClick={() => setCreateType('snippet')}
              size="small"
            >
              Snippet
            </Button>
          </Box>
          <TextField
            autoFocus
            fullWidth
            size="small"
            label="Name"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateItem()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateItem} 
            disabled={!newItemName}
            variant="contained"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const EnvironmentPage = () => {
  const { projectID } = useParams();
  const navigate = useNavigate();
  const clientToken = useMemo(() => uuidv4(), []);

  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [editorContent, setEditorContent] = useState('');
  const [language, setLanguage] = useState('plaintext');
  const [output, setOutput] = useState('');
  const [lastLocalUpdate, setLastLocalUpdate] = useState(null);

  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState('');

  useEffect(() => {
    const runCodeSocket = new SockJS('http://localhost:9090/code-websocket');
    const runCodeClientInstance = new Client({
      webSocketFactory: () => runCodeSocket,
      onConnect: () => {
        runCodeClientInstance.subscribe(`/topic/output/${clientToken}`, (message) => {
          const msg = JSON.parse(message.body);
          setOutput(prev => prev + msg.output + (msg.output.endsWith('\n') ? '' : '\n'));
        });
      },
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
    });
    runCodeClientInstance.activate();
    runCodeClient = runCodeClientInstance;

    const editorSyncSocket = new SockJS('http://localhost:9090/update-snippet');
    const editorSyncClientInstance = new Client({
      webSocketFactory: () => editorSyncSocket,
      onConnect: () => {
        if (selectedSnippet) {
          editorSyncClientInstance.subscribe(`/topic/editor/${selectedSnippet.id}`, (message) => {
            const update = JSON.parse(message.body);
            if (update.content !== lastLocalUpdate) {
              setEditorContent(update.content);
            }
          });
        }
      },
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
    });
    editorSyncClientInstance.activate();
    editorSyncClient = editorSyncClientInstance;

    return () => {
      if (runCodeClient?.active) runCodeClient.deactivate();
      if (editorSyncClient?.active) editorSyncClient.deactivate();
    };
  }, [clientToken, selectedSnippet?.id]);

  const loadSnippetContent = async (snippet) => {
    try {
      const { data } = await axios.post('/snippet/load', {
        projectID,
        snippetID: snippet.id
      });
      setSelectedSnippet(snippet);
      setEditorContent(data);
      setLanguage(detectLanguage(snippet.name));
      setOutput('');
    } catch (err) {
      console.error('Failed to load snippet content', err);
    }
  };

  const updateSnippetContent = async (content) => {
    try {
      await axios.post('/snippet/update', {
        projectID,
        snippetID: selectedSnippet.id,
        content
      });
    } catch (err) {
      console.error('Failed to update snippet', err);
    }
  };

  const runCode = () => {
    if (runCodeClient?.connected && selectedSnippet) {
      runCodeClient.publish({
        destination: '/app/sendCode',
        body: JSON.stringify({
          code: editorContent,
          snippetName: selectedSnippet.name,
          clientToken
        })
      });
    }
  };

  const syncEditorContent = (content) => {
    if (editorSyncClient?.connected && selectedSnippet) {
      editorSyncClient.publish({
        destination: '/app/editor/change',
        body: JSON.stringify({
          content,
          snippetID: selectedSnippet.id
        })
      });
      setLastLocalUpdate(content);
    }
  };

  const runVCSCommand = async () => {
    if (!terminalInput.trim()) return;
    try {
      const { data } = await axios.post('/vcs', {
        command: terminalInput,
        projectID
      });
      setTerminalOutput(prev => prev + `> ${terminalInput}\n${data}\n`);
      setTerminalInput('');
    } catch (err) {
      setTerminalOutput(prev => prev + `> ${terminalInput}\nError: ${err.response?.data || err.message}\n`);
      setTerminalInput('');
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <ProjectStructure
        projectID={projectID}
        onSnippetSelect={loadSnippetContent}
      />
      <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
        {selectedSnippet ? (
          <>
            <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="subtitle2">{selectedSnippet.name}</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<PlayArrow />}
                  onClick={runCode}
                >
                  Run
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<TerminalIcon />}
                  onClick={() => setShowTerminal(prev => !prev)}
                >
                  VCS
                </Button>
              </Box>
            </Box>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ flex: showTerminal ? 0.7 : 1 }}>
                <Editor
                  height="100%"
                  language={language}
                  value={editorContent}
                  onChange={(val) => {
                    setEditorContent(val);
                    updateSnippetContent(val);
                    syncEditorContent(val);
                  }}
                  options={{
                    fontSize: 14,
                    fontFamily: 'monospace',
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              </Box>
              {showTerminal && (
                <Box sx={{
                  flex: 0.3,
                  borderTop: '1px solid #ddd',
                  background: '#000',
                  color: '#0f0',
                  fontFamily: 'monospace',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <Typography variant="body2" sx={{ p: 1, color: '#0f0' }}>
                    Terminal
                  </Typography>
                  <TextareaAutosize
                    minRows={5}
                    value={terminalOutput}
                    readOnly
                    style={{
                      width: '100%',
                      background: '#000',
                      color: '#0f0',
                      border: 'none',
                      resize: 'none',
                      flex: 1
                    }}
                  />
                  <TextField
                    size="small"
                    variant="filled"
                    placeholder="Enter VCS command..."
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && runVCSCommand()}
                    sx={{
                      input: { color: '#0f0', backgroundColor: '#111' },
                      px: 1,
                    }}
                  />
                </Box>
              )}
            </Box>
          </>
        ) : (
          <Box sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 2,
            m: 2
          }}>
            <Typography variant="h6" color="text.secondary">
              Select a snippet to view or edit
            </Typography>
          </Box>
        )}
      </Box>
      <Box sx={{ width: 350, p: 2, bgcolor: '#f9f9f9', borderLeft: '1px solid #ddd', overflow: 'auto' }}>
        <Typography variant="subtitle1" gutterBottom>Output</Typography>
        <pre style={{
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace',
          fontSize: '0.875rem',
          margin: 0
        }}>{output}</pre>
      </Box>
    </Box>
  );
};

export default EnvironmentPage;
