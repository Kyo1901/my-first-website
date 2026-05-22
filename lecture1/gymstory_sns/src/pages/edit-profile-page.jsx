import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/use-auth';

const PROFILE_IMAGES = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=200&h=200&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=200&h=200&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=200&h=200&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&h=200&fit=crop&auto=format',
];

function EditProfilePage() {
  const navigate = useNavigate();
  const { profile, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [selectedImage, setSelectedImage] = useState(profile?.profile_image_url || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!displayName.trim()) { setError('표시 이름을 입력해주세요.'); return; }
    setError('');
    setLoading(true);

    const { error: err } = await supabase
      .from('gymstory_users')
      .update({
        display_name: displayName.trim(),
        bio: bio.trim() || null,
        profile_image_url: selectedImage,
      })
      .eq('id', profile.id);

    setLoading(false);
    if (err) {
      setError('저장에 실패했습니다.');
    } else {
      refreshProfile();
      navigate('/profile');
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 480, minHeight: '100vh', bgcolor: 'background.paper' }}>
      {/* 헤더 */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 1, borderBottom: '1px solid', borderColor: 'divider', position: 'sticky', top: 0, zIndex: 100, bgcolor: 'background.paper' }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant='subtitle1' sx={{ fontWeight: 600, ml: 1, flex: 1 }}>프로필 수정</Typography>
        <Button variant='contained' size='small' onClick={handleSave} disabled={loading} sx={{ mr: 1 }}>
          {loading ? <CircularProgress size={16} color='inherit' /> : '저장'}
        </Button>
      </Box>

      <Box sx={{ p: 2 }}>
        {error && <Alert severity='error' sx={{ mb: 2 }}>{error}</Alert>}

        {/* 현재 선택된 프로필 이미지 */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Avatar
            src={selectedImage}
            sx={{ width: 80, height: 80, bgcolor: 'secondary.main', fontSize: 32 }}
          >
            {profile?.display_name?.[0]?.toUpperCase()}
          </Avatar>
        </Box>

        {/* 프로필 이미지 선택 */}
        <Typography variant='body2' sx={{ fontWeight: 600, mb: 1 }}>프로필 사진 선택</Typography>
        <Grid container spacing={0.75} sx={{ mb: 2 }}>
          {PROFILE_IMAGES.map((img, idx) => (
            <Grid size={{ xs: 3 }} key={idx}>
              <Box
                onClick={() => setSelectedImage(img)}
                sx={{
                  position: 'relative',
                  aspectRatio: '1/1',
                  cursor: 'pointer',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: selectedImage === img ? '2.5px solid' : '2.5px solid transparent',
                  borderColor: selectedImage === img ? 'secondary.main' : 'transparent',
                }}
              >
                <Box component='img' src={img} alt={`프로필 ${idx + 1}`} sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                {selectedImage === img && (
                  <Box sx={{ position: 'absolute', bottom: 0, right: 0 }}>
                    <CheckCircleIcon sx={{ color: 'secondary.main', bgcolor: 'white', borderRadius: '50%', fontSize: 16 }} />
                  </Box>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* 입력 필드 */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label='표시 이름'
            fullWidth
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <TextField
            label='소개글'
            fullWidth
            multiline
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder='자신을 소개해보세요...'
          />
        </Box>
      </Box>
    </Box>
  );
}

export default EditProfilePage;
