import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Fab from '@mui/material/Fab';
import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import PersonIcon from '@mui/icons-material/Person';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';

/**
 * BottomNav 컴포넌트 - 하단 탭 네비게이션
 * Props: 없음
 */
function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const isActive = (route) => path === route;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        zIndex: 1200,
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: 56,
        px: 1,
      }}
    >
      <IconButton onClick={() => navigate('/')} sx={{ color: isActive('/') ? 'primary.main' : 'text.secondary' }}>
        {isActive('/') ? <HomeIcon /> : <HomeOutlinedIcon />}
      </IconButton>

      <IconButton onClick={() => navigate('/explore')} sx={{ color: isActive('/explore') ? 'primary.main' : 'text.secondary' }}>
        <SearchIcon />
      </IconButton>

      <Fab
        color='secondary'
        size='medium'
        onClick={() => navigate('/create')}
        sx={{ width: 46, height: 46, boxShadow: 2 }}
      >
        <AddIcon />
      </Fab>

      <IconButton onClick={() => navigate('/notifications')} sx={{ color: isActive('/notifications') ? 'primary.main' : 'text.secondary' }}>
        {isActive('/notifications') ? <NotificationsIcon /> : <NotificationsOutlinedIcon />}
      </IconButton>

      <IconButton onClick={() => navigate('/profile')} sx={{ color: isActive('/profile') ? 'primary.main' : 'text.secondary' }}>
        {isActive('/profile') ? <PersonIcon /> : <PersonOutlineIcon />}
      </IconButton>
    </Box>
  );
}

export default BottomNav;
