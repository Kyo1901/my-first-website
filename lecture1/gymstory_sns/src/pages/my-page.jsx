import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/use-auth';
import BottomNav from '../components/common/bottom-nav';

function StatBox({ label, value }) {
  return (
    <Box sx={{ textAlign: 'center', flex: 1 }}>
      <Typography variant='h6' sx={{ fontWeight: 700, lineHeight: 1 }}>{value}</Typography>
      <Typography variant='caption' color='text.secondary'>{label}</Typography>
    </Box>
  );
}

function MyPage() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [posts, setPosts] = useState([]);
  const [counts, setCounts] = useState({ followers: 0, following: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [{ data: myPosts }, { count: followers }, { count: following }] = await Promise.all([
      supabase.from('gymstory_posts').select('id, image_url').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('gymstory_follows').select('id', { count: 'exact', head: true }).eq('following_id', user.id),
      supabase.from('gymstory_follows').select('id', { count: 'exact', head: true }).eq('follower_id', user.id),
    ]);
    setPosts(myPosts || []);
    setCounts({ followers: followers || 0, following: following || 0 });
    setLoading(false);
  }, [user.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 480, minHeight: '100vh', bgcolor: 'background.default', pb: 8 }}>
      {/* 헤더 */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant='h6' sx={{ fontWeight: 700, flex: 1 }}>
          @{profile?.username || '...'}
        </Typography>
        <IconButton onClick={handleSignOut}>
          <SettingsIcon />
        </IconButton>
      </Box>

      {/* 프로필 정보 */}
      <Box sx={{ bgcolor: 'background.paper', px: 2, pt: 2, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
          <Avatar
            src={profile?.profile_image_url}
            sx={{ width: 72, height: 72, bgcolor: 'secondary.main', fontSize: 28 }}
          >
            {profile?.display_name?.[0]?.toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-around' }}>
            <StatBox label='게시물' value={posts.length} />
            <StatBox label='팔로워' value={counts.followers} />
            <StatBox label='팔로잉' value={counts.following} />
          </Box>
        </Box>

        <Typography variant='body2' sx={{ fontWeight: 600 }}>{profile?.display_name}</Typography>
        {profile?.bio && (
          <Typography variant='body2' color='text.secondary' sx={{ mt: 0.25 }}>{profile.bio}</Typography>
        )}

        <Button
          variant='outlined'
          fullWidth
          size='small'
          sx={{ mt: 1.5, mb: 1 }}
          onClick={() => navigate('/profile/edit')}
        >
          프로필 수정
        </Button>
      </Box>

      <Divider />

      {/* 게시물 격자 */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : posts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color='text.secondary'>아직 게시물이 없습니다.</Typography>
        </Box>
      ) : (
        <Grid container spacing={0.25}>
          {posts.map((post) => (
            <Grid size={{ xs: 4 }} key={post.id}>
              <Box
                component='img'
                src={post.image_url}
                alt='게시물'
                onClick={() => navigate(`/post/${post.id}`)}
                sx={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', cursor: 'pointer', display: 'block' }}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <BottomNav />
    </Box>
  );
}

export default MyPage;
