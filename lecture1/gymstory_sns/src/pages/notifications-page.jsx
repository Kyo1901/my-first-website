import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import BottomNav from '../components/common/bottom-nav';

function NotificationsPage() {
  return (
    <Box sx={{ width: '100%', maxWidth: 480, minHeight: '100vh', bgcolor: 'background.default', pb: 8 }}>
      <Box sx={{ px: 2, py: 1.5, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant='h6' sx={{ fontWeight: 700 }}>알림</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 120px)', gap: 1 }}>
        <NotificationsNoneIcon sx={{ fontSize: 56, color: 'text.disabled' }} />
        <Typography color='text.secondary'>알림이 없습니다.</Typography>
        <Typography variant='body2' color='text.disabled'>새로운 활동이 생기면 알려드립니다.</Typography>
      </Box>
      <BottomNav />
    </Box>
  );
}

export default NotificationsPage;
