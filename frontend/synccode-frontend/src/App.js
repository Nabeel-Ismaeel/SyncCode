import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';
import UserPage from './pages/UserPage';
import EnvironmentPage from './pages/EnvironmentPage';
import CommentsPage from './pages/CommentsPage';
import ViewProjectPage from './pages/ViewProjectPage';
import AdminPage from './pages/AdminPage';



function App() {
  return (
    <Router>
      <CssBaseline />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/environment/:projectID" element={<EnvironmentPage />} />
        <Route path="/viewProject/:projectID" element={<ViewProjectPage />} />
        <Route path="/comments/:projectID" element={<CommentsPage />} />
      </Routes>
    </Router>
  );
}

export default App;