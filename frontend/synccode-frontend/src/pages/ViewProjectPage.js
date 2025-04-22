// import { useState, useEffect, useMemo } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//   Box,
//   Typography,
//   IconButton,
//   CircularProgress,
//   Alert,
//   Button,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Divider
// } from '@mui/material';
// import {
//   Folder,
//   InsertDriveFile,
//   Code,
//   PlayArrow
// } from '@mui/icons-material';
// import Editor from '@monaco-editor/react';
// import SockJS from 'sockjs-client';
// import { Client } from '@stomp/stompjs';
// import axios from '../utils/axiosInstance';

// let runCodeClient = null;

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
//   expandedFolders,
//   toggleFolder,
//   onSnippetSelect
// }) => {
//   const isFolder = 'folders' in item;
//   const isExpanded = expandedFolders.has(item.path);

//   const handleClick = () => {
//     if (isFolder) toggleFolder(item.path);
//     else onSnippetSelect(item);
//   };

//   return (
//     <>
//       <ListItem disablePadding sx={{ pl: 2 + depth * 2 }}>
//         <ListItemButton onClick={handleClick}>
//           <ListItemIcon sx={{ minWidth: 32 }}>
//             {isFolder ? <Folder /> : <InsertDriveFile />}
//           </ListItemIcon>
//           <ListItemText primary={item.name} primaryTypographyProps={{ variant: 'body2' }} />
//         </ListItemButton>
//       </ListItem>

//       {isFolder && isExpanded && (
//         <List disablePadding>
//           {item.folders?.map(child => (
//             <StructureItem
//               key={child.path}
//               item={child}
//               depth={depth + 1}
//               expandedFolders={expandedFolders}
//               toggleFolder={toggleFolder}
//               onSnippetSelect={onSnippetSelect}
//             />
//           ))}
//           {item.files?.map(child => (
//             <StructureItem
//               key={child.path}
//               item={child}
//               depth={depth + 1}
//               expandedFolders={expandedFolders}
//               toggleFolder={toggleFolder}
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
//   const [expandedFolders, setExpandedFolders] = useState(new Set());

//   const toggleFolder = (path) => {
//     setExpandedFolders(prev => {
//       const next = new Set(prev);
//       next.has(path) ? next.delete(path) : next.add(path);
//       return next;
//     });
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

//   if (loading) return <CircularProgress sx={{ mt: 4 }} />;

//   return (
//     <Box sx={{ width: 300, height: '100vh', bgcolor: 'background.paper' }}>
//       <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
//         <Code color="primary" />
//         <Typography variant="h6">Project Explorer</Typography>
//         <Button
//           variant="outlined"
//           onClick={() => window.location.href = `/comments/${projectID}`}
//           sx={{ ml: 'auto', borderRadius: 2 }}
//         >
//           View Comments
//         </Button>
//       </Box>

//       {error && <Alert severity="error" sx={{ mx: 2, mb: 1 }}>{error}</Alert>}

//       <List dense sx={{ overflow: 'auto', height: 'calc(100vh - 120px)' }}>
//         {structure?.folders?.map(folder => (
//           <StructureItem
//             key={folder.path}
//             item={folder}
//             depth={0}
//             expandedFolders={expandedFolders}
//             toggleFolder={toggleFolder}
//             onSnippetSelect={onSnippetSelect}
//           />
//         ))}
//         {structure?.files?.map(file => (
//           <StructureItem
//             key={file.path}
//             item={file}
//             depth={0}
//             expandedFolders={expandedFolders}
//             toggleFolder={toggleFolder}
//             onSnippetSelect={onSnippetSelect}
//           />
//         ))}
//       </List>
//     </Box>
//   );
// };

// const ViewProjectPage = () => {
//   const { projectID } = useParams();
//   const navigate = useNavigate();
//   const clientToken = useMemo(() => Math.random().toString(36).substring(2), []);
//   const [selectedSnippet, setSelectedSnippet] = useState(null);
//   const [editorContent, setEditorContent] = useState('');
//   const [language, setLanguage] = useState('plaintext');
//   const [output, setOutput] = useState('');

//   useEffect(() => {
//     if (!projectID) navigate('/');
//   }, [projectID, navigate]);

//   useEffect(() => {
//     const socket = new SockJS('http://localhost:9090/code-websocket');
//     const client = new Client({
//       webSocketFactory: () => socket,
//       onConnect: () => {
//         client.subscribe(`/topic/output/${clientToken}`, (message) => {
//           const msg = JSON.parse(message.body);
//           setOutput(prev => prev + msg.output + '\n');
//         });
//       },
//       debug: (str) => console.log(str),
//       reconnectDelay: 5000
//     });

//     client.activate();
//     runCodeClient = client;

//     return () => {
//       if (client && client.active) {
//         client.deactivate();
//       }
//     };
//   }, [clientToken]);

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

//   const runCode = () => {
//     if (runCodeClient && runCodeClient.connected && selectedSnippet) {
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
//               <Button
//                 size="small"
//                 variant="contained"
//                 startIcon={<PlayArrow />}
//                 onClick={runCode}
//               >
//                 Run
//               </Button>
//             </Box>
//             <Editor
//               height="100%"
//               language={language}
//               value={editorContent}
//               options={{
//                 readOnly: true,
//                 fontSize: 14,
//                 fontFamily: 'monospace',
//                 minimap: { enabled: false },
//                 scrollBeyondLastLine: false,
//                 automaticLayout: true
//               }}
//             />
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
//               Select a snippet to view
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

// export default ViewProjectPage;

import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Folder,
  InsertDriveFile,
  Code,
  PlayArrow
} from '@mui/icons-material';
import Editor from '@monaco-editor/react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import axios from '../utils/axiosInstance';

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
  expandedFolders,
  toggleFolder,
  onSnippetSelect
}) => {
  const isFolder = 'folders' in item;
  const isExpanded = expandedFolders.has(item.path);

  const handleClick = () => {
    if (isFolder) toggleFolder(item.path);
    else onSnippetSelect(item);
  };

  return (
    <>
      <ListItem disablePadding sx={{ pl: 2 + depth * 2 }}>
        <ListItemButton onClick={handleClick}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            {isFolder ? <Folder /> : <InsertDriveFile />}
          </ListItemIcon>
          <ListItemText primary={item.name} primaryTypographyProps={{ variant: 'body2' }} />
        </ListItemButton>
      </ListItem>

      {isFolder && isExpanded && (
        <List disablePadding>
          {item.folders?.map(child => (
            <StructureItem
              key={child.path}
              item={child}
              depth={depth + 1}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
              onSnippetSelect={onSnippetSelect}
            />
          ))}
          {item.files?.map(child => (
            <StructureItem
              key={child.path}
              item={child}
              depth={depth + 1}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
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
  const [expandedFolders, setExpandedFolders] = useState(new Set());

  const toggleFolder = (path) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      next.has(path) ? next.delete(path) : next.add(path);
      return next;
    });
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

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;

  return (
    <Box sx={{ width: 300, height: '100vh', bgcolor: 'background.paper' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Code color="primary" />
        <Typography variant="h6">Project Explorer</Typography>
        <Button
          variant="outlined"
          onClick={() => window.location.href = `/comments/${projectID}`}
          sx={{ ml: 'auto', borderRadius: 2 }}
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
            expandedFolders={expandedFolders}
            toggleFolder={toggleFolder}
            onSnippetSelect={onSnippetSelect}
          />
        ))}
        {structure?.files?.map(file => (
          <StructureItem
            key={file.path}
            item={file}
            depth={0}
            expandedFolders={expandedFolders}
            toggleFolder={toggleFolder}
            onSnippetSelect={onSnippetSelect}
          />
        ))}
      </List>
    </Box>
  );
};

const ViewProjectPage = () => {
  const { projectID } = useParams();
  const navigate = useNavigate();
  const clientToken = useMemo(() => Math.random().toString(36).substring(2), []);
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [editorContent, setEditorContent] = useState('');
  const [language, setLanguage] = useState('plaintext');
  const [output, setOutput] = useState('');

  useEffect(() => {
    if (!projectID) navigate('/');
  }, [projectID, navigate]);

  useEffect(() => {
    // WebSocket for run output
    const runSocket = new SockJS('http://localhost:9090/code-websocket');
    const runClient = new Client({
      webSocketFactory: () => runSocket,
      onConnect: () => {
        runClient.subscribe(`/topic/output/${clientToken}`, (message) => {
          const msg = JSON.parse(message.body);
          setOutput(prev => prev + msg.output + '\n');
        });
      },
      debug: (str) => console.log(str),
      reconnectDelay: 5000
    });
    runClient.activate();
    runCodeClient = runClient;

    // WebSocket for editor sync (read-only)
    const syncSocket = new SockJS('http://localhost:9090/update-snippet');
    const syncClient = new Client({
      webSocketFactory: () => syncSocket,
      onConnect: () => {
        if (selectedSnippet) {
          syncClient.subscribe(`/topic/editor/${selectedSnippet.id}`, (message) => {
            const update = JSON.parse(message.body);
            setEditorContent(update.content);
          });
        }
      },
      debug: (str) => console.log(str),
      reconnectDelay: 5000
    });
    syncClient.activate();
    editorSyncClient = syncClient;

    return () => {
      runClient.deactivate();
      syncClient.deactivate();
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

  const runCode = () => {
    if (runCodeClient && runCodeClient.connected && selectedSnippet) {
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
              <Button
                size="small"
                variant="contained"
                startIcon={<PlayArrow />}
                onClick={runCode}
              >
                Run
              </Button>
            </Box>
            <Editor
              height="100%"
              language={language}
              value={editorContent}
              options={{
                readOnly: true,
                fontSize: 14,
                fontFamily: 'monospace',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true
              }}
            />
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
              Select a snippet to view
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

export default ViewProjectPage;
