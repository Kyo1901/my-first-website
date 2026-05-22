import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/use-auth';
import BottomNav from '../components/common/bottom-nav';

function UserProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [targetUser, setTargetUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [counts, setCounts] = useState({ followers: 0, following: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data: userData } = await supabase
      .from('gymstory_users')
      .select('*')
      .eq('username', username)
      .single();

    if (!userData) { setLoading(false); return; }
    setTargetUser(userData);

    const [{ data: myPosts }, { count: followers }, { count: following }, { data: followRow }] = await Promise.all([
      supabase.from('gymstory_posts').select('id, image_url').eq('user_id', userData.id).order('created_at', { ascending: false }),
      supabase.from('gymstory_follows').select('id', { count: 'exact', head: true }).eq('following_id', userData.id),
      supabase.from('gymstory_follows').select('id', { count: 'exact', head: true }).eq('follower_id', userData.id),
      supabase.from('gymstory_follows').select('id').match({ follower_id: user.id, following_id: userData.id }).single(),
    ]);

    setPosts(myPosts || []);
    setCounts({ followers: followers || 0, following: following || 0 });
    setIsFollowing(!!followRow);
    setLoading(false);
  }, [username, user.id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleFollowToggle = async () => {
    if (!targetUser) return;
    if (isFollowing) {
      await supabase.from('gymstory_follows').delete().match({ follower_id: user.id, following_id: targetUser.id });
      setIsFollowing(false);
      setCounts((prev) => ({ ...prev, followers: Math.max(0, prev.followers - 1) }));
    } else {
      await supabase.from('gymstory_follows').insert({ follower_id: user.id, following_id: targetUser.id });
      setIsFollowing(true);
      setCounts((prev) => ({ ...prev, followers: prev.followers + 1 }));
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <CircularProgress />
    </Box>
  );

  if (!targetUser) return (
    <Box sx={{ textAlign: 'center', py: 10 }}>
      <Typography color='text.secondary'>사용자를 찾을 수 없습니다.</Typography>
    </Box>
  );

  const isOwnProfile = targetUser.id === user.id;

  return (
    <Box sx={{ width: '100%', maxWidth: 480, minHeight: '100vh', bgcolor: 'background.default', pb: 8 }}>
      {/* 헤더 */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 1, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant='h6' sx={{ fontWeight: 700, ml: 1 }}>@{targetUser.username}</Typography>
      </Box>

      {/* 프로필 */}
      <Box sx={{ bgcolor: 'background.paper', px: 2, pt: 2, pb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
          <Avatar src={targetUser.profile_image_url} sx={{ width: 72, height: 72, bgcolor: 'secondary.main', fontSize: 28 }}>
            {targetUser.display_name?.[0]?.toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-around' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant='h6' sx={{ fontWeight: 700, lineHeight: 1 }}>{posts.length}</Typography>
              <Typography variant='caption' color='text.secondary'>게시물</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant='h6' sx={{ fontWeight: 700, lineHeight: 1 }}>{counts.followers}</Typography>
              <Typography variant='caption' color='text.secondary'>팔로워</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant='h6' sx={{ fontWeight: 700, lineHeight: 1 }}>{counts.following}</Typography>
              <Typography variant='caption' color='text.secondary'>팔로잉</Typography>
            </Box>
          </Box>
        </Box>

        <Typography variant='body2' sx={{ fontWeight: 600 }}>{targetUser.display_name}</Typography>
        {targetUser.bio && (
          <Typography variant='body2' color='text.secondary' sx={{ mt: 0.25 }}>{targetUser.bio}</Typography>
        )}

        {!isOwnProfile && (
          <Button
            variant={isFollowing ? 'outlined' : 'contained'}
            fullWidth
            size='small'
            sx={{ mt: 1.5, mb: 1 }}
            onClick={handleFollowToggle}
          >
            {isFollowing ? '팔로잉' : '팔로우'}
          </Button>
        )}
        {isOwnProfile && (
          <Button variant='outlined' fullWidth size='small' sx={{ mt: 1.5, mb: 1 }} onClick={() => navigate('/profile/edit')}>
            프로필 수정
          </Button>
        )}
      </Box>

      {/* 게시물 그리드 */}
      {posts.length === 0 ? (
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

export default UserProfilePage;
