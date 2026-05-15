import { useState, useMemo } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/auth-context';
import { createAppTheme } from './theme';
import Header from './components/common/header';
import HomePage from './pages/home-page';
import LoginPage from './pages/login-page';
import PostDetailPage from './pages/post-detail-page';
import BoardPage from './pages/board-page';
import CreatePostPage from './pages/create-post-page';

function App() {
  const [mode, setMode] = useState(() => localStorage.getItem('roundit-theme') || 'light');

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('roundit-theme', newMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <HashRouter>
          <Header toggleTheme={toggleTheme} mode={mode} />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/r/:boardName" element={<BoardPage />} />
            <Route path="/r/:boardName/post/:postId" element={<PostDetailPage />} />
            <Route path="/create-post" element={<CreatePostPage />} />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
