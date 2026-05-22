import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/use-auth';

const FITNESS_IMAGES = [
  'https://images.unsplash.com/photo-1534438327993-b5c3a7ec57f0?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1517836357463-dbc7d52f9dc6?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1583454110551-21f0dc3c8017?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1598971457999-ca4ef48a9a71?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1552508744-1696d4464960?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1571388208497-71bedc66e932?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1574680096145-d05b0d2f3e0e?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1606889464198-fcb235e4e7c9?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1459936402970-04a5cec22f65?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1487956382158-bb926046304a?w=400&h=400&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=400&h=400&fit=crop&auto=format',
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function CreatePostPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [caption, setCaption] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePool, setImagePool] = useState(() => shuffle(FITNESS_IMAGES).slice(0, 9));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRefreshImages = () => {
    setImagePool(shuffle(FITNESS_IMAGES).slice(0, 9));
    setSelectedImage(null);
  };

  const handleSubmit = async () => {
    if (!caption.trim()) { setError('내용을 입력해주세요.'); return; }
    if (!selectedImage) { setError('이미지를 선택해주세요.'); return; }
    setError('');
    setLoading(true);

    const { error: err } = await supabase.from('gymstory_posts').insert({
      user_id: user.id,
      caption: caption.trim(),
      image_url: selectedImage,
    });

    setLoading(false);
    if (err) {
      setError('게시물 작성에 실패했습니다.');
    } else {
      navigate('/');
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 480, minHeight: '100vh', bgcolor: 'background.paper' }}>
      {/* 헤더 */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 1, borderBottom: '1px solid', borderColor: 'divider', position: 'sticky', top: 0, zIndex: 100, bgcolor: 'background.paper' }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant='subtitle1' sx={{ fontWeight: 600, ml: 1, flex: 1 }}>새 게시물</Typography>
        <Button variant='contained' size='small' onClick={handleSubmit} disabled={loading} sx={{ mr: 1 }}>
          {loading ? <CircularProgress size={16} color='inherit' /> : '게시하기'}
        </Button>
      </Box>

      <Box sx={{ p: 2 }}>
        {error && <Alert severity='error' sx={{ mb: 2 }}>{error}</Alert>}

        {/* 선택된 이미지 미리보기 */}
        {selectedImage && (
          <Box component='img' src={selectedImage} alt='선택된 이미지' sx={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: 2, mb: 2 }} />
        )}

        {/* 내용 입력 */}
        <TextField
          multiline
          rows={3}
          fullWidth
          placeholder='운동 스토리를 공유해보세요...'
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* 이미지 선택 */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant='body2' sx={{ fontWeight: 600 }}>이미지 선택</Typography>
          <IconButton size='small' onClick={handleRefreshImages}>
            <RefreshIcon fontSize='small' />
          </IconButton>
        </Box>

        <Grid container spacing={0.5}>
          {imagePool.map((img, idx) => (
            <Grid size={{ xs: 4 }} key={idx}>
              <Box
                onClick={() => setSelectedImage(img)}
                sx={{
                  position: 'relative',
                  aspectRatio: '1/1',
                  cursor: 'pointer',
                  borderRadius: 1,
                  overflow: 'hidden',
                  border: selectedImage === img ? '2.5px solid' : '2.5px solid transparent',
                  borderColor: selectedImage === img ? 'secondary.main' : 'transparent',
                }}
              >
                <Box
                  component='img'
                  src={img}
                  alt={`이미지 ${idx + 1}`}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                {selectedImage === img && (
                  <Box sx={{ position: 'absolute', top: 4, right: 4 }}>
                    <CheckCircleIcon sx={{ color: 'secondary.main', bgcolor: 'white', borderRadius: '50%', fontSize: 20 }} />
                  </Box>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Typography variant='caption' color='text.secondary' sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
          새로고침 버튼을 눌러 다른 이미지를 확인할 수 있습니다
        </Typography>
      </Box>
    </Box>
  );
}

export default CreatePostPage;
