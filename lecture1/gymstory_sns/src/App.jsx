import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { AuthProvider, useAuth } from './hooks/use-auth';

import AuthPage from './pages/auth-page';
import HomePage from './pages/home-page';
import PostDetailPage from './pages/post-detail-page';
import CreatePostPage from './pages/create-post-page';
import MyPage from './pages/my-page';
import EditProfilePage from './pages/edit-profile-page';
import ExplorePage from './pages/explore-page';
import UserProfilePage from './pages/user-profile-page';
import NotificationsPage from './pages/notifications-page';

/**
 * 인증이 필요한 라우트를 보호하는 컴포넌트
 */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) return <Navigate to='/auth' replace />;
  return children;
}

function AppRoutes() {
  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <Routes>
        <Route path='/auth' element={<AuthPage />} />
        <Route path='/' element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path='/post/:id' element={<ProtectedRoute><PostDetailPage /></ProtectedRoute>} />
        <Route path='/create' element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />
        <Route path='/explore' element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} />
        <Route path='/notifications' element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path='/profile' element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
        <Route path='/profile/edit' element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
        <Route path='/user/:username' element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </Box>
  );
}

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
