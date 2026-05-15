import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { alpha, useTheme } from '@mui/material/styles';
import { useAuth } from '../../contexts/auth-context';

/**
 * Header 컴포넌트
 * Props:
 * @param {function} toggleTheme - 다크/라이트 모드 전환 함수 [Required]
 * @param {string} mode - 현재 테마 모드 ('light' | 'dark') [Required]
 *
 * Example usage:
 * <Header toggleTheme={toggleTheme} mode={mode} />
 */
function Header({ toggleTheme, mode }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user, profile, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleSignOut = async () => {
    handleMenuClose();
    await signOut();
    navigate('/');
  };

  const displayName = profile?.username || user?.email?.split('@')[0] || '';

  return (
    <AppBar position="sticky" elevation={1}
      sx={{ bgcolor: 'background.paper', color: 'text.primary', zIndex: 1200 }}>
      <Toolbar sx={{ gap: 2, minHeight: { xs: 56, sm: 64 } }}>
        {/* 로고 */}
        <Box
          onClick={() => navigate('/')}
          sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', flexShrink: 0 }}
        >
          <Box sx={{
            width: 34, height: 34, borderRadius: '50%',
            bgcolor: 'primary.main',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>R</Typography>
          </Box>
          <Typography variant="h6" sx={{
            fontWeight: 800, color: 'primary.main',
            display: { xs: 'none', sm: 'block' },
            letterSpacing: '-0.5px',
          }}>
            Roundit
          </Typography>
        </Box>

        {/* 검색바 */}
        <Box sx={{
          flex: 1,
          maxWidth: 560,
          bgcolor: alpha(theme.palette.text.primary, 0.06),
          borderRadius: 5,
          display: 'flex',
          alignItems: 'center',
          px: 2,
          py: 0.5,
          border: '1px solid transparent',
          '&:hover': { border: '1px solid', borderColor: 'primary.main' },
          transition: 'border 0.2s',
        }}>
          <SearchIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
          <InputBase placeholder="Roundit 검색..." sx={{ flex: 1, fontSize: '0.875rem' }} />
        </Box>

        {/* 우측 액션 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto', flexShrink: 0 }}>
          {user && (
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => navigate('/create-post')}
              sx={{
                borderRadius: 5, textTransform: 'none',
                display: { xs: 'none', sm: 'flex' },
                fontWeight: 600,
              }}
            >
              글쓰기
            </Button>
          )}

          <IconButton onClick={toggleTheme} size="small" sx={{ color: 'text.secondary' }}>
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          {user ? (
            <>
              <IconButton onClick={handleMenuOpen} size="small">
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '14px', fontWeight: 700 }}>
                  {displayName[0]?.toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                <MenuItem disabled sx={{ opacity: '1 !important' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>u/{displayName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => { handleMenuClose(); navigate('/create-post'); }}>
                  글쓰기
                </MenuItem>
                <MenuItem onClick={handleSignOut} sx={{ color: 'error.main' }}>
                  로그아웃
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" size="small" onClick={() => navigate('/login')}
                sx={{ borderRadius: 5, textTransform: 'none', fontWeight: 600, borderColor: 'primary.main' }}>
                로그인
              </Button>
              <Button variant="contained" size="small" onClick={() => navigate('/login')}
                sx={{ borderRadius: 5, textTransform: 'none', fontWeight: 600, display: { xs: 'none', sm: 'flex' } }}>
                가입하기
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
