import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import RefreshIcon from '@mui/icons-material/Refresh';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/use-auth';
import PostCard from '../components/ui/post-card';
import BottomNav from '../components/common/bottom-nav';

function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [likedSet, setLikedSet] = useState(new Set());
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeed = useCallback(async () => {
    setLoading(true);

    const [{ data: follows }, { data: likes }] = await Promise.all([
      supabase.from('gymstory_follows').select('following_id, gymstory_users!following_id(id, username, display_name, profile_image_url)').eq('follower_id', user.id),
      supabase.from('gymstory_likes').select('post_id').eq('user_id', user.id),
    ]);

    const followingIds = follows?.map((f) => f.following_id) || [];
    setFollowing(follows?.map((f) => f.gymstory_users).filter(Boolean) || []);
    setLikedSet(new Set(likes?.map((l) => l.post_id) || []));

    let query = supabase
      .from('gymstory_posts')
      .select('*, gymstory_users(id, username, display_name, profile_image_url)')
      .order('created_at', { ascending: false })
      .limit(30);

    if (followingIds.length > 0) {
      query = query.in('user_id', [...followingIds, user.id]);
    }

    const { data } = await query;
    setPosts(data || []);
    setLoading(false);
  }, [user.id]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const handleLikeToggle = async (postId, isLiked) => {
    if (isLiked) {
      await supabase.from('gymstory_likes').delete().match({ post_id: postId, user_id: user.id });
      setLikedSet((prev) => { const next = new Set(prev); next.delete(postId); return next; });
      setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, likes_count: Math.max(0, p.likes_count - 1) } : p));
    } else {
      await supabase.from('gymstory_likes').insert({ post_id: postId, user_id: user.id });
      setLikedSet((prev) => new Set([...prev, postId]));
      setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, likes_count: p.likes_count + 1 } : p));
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 480, minHeight: '100vh', bgcolor: 'background.default', pb: 8 }}>
      {/* 헤더 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', position: 'sticky', top: 0, zIndex: 100 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FitnessCenterIcon sx={{ color: 'secondary.main' }} />
          <Typography variant='h6' sx={{ fontWeight: 700, color: 'primary.main' }}>
            GymStory
          </Typography>
        </Box>
        <IconButton onClick={fetchFeed} disabled={loading}>
          <RefreshIcon />
        </IconButton>
      </Box>

      {/* 팔로잉 아바타 행 */}
      {following.length > 0 && (
        <Box sx={{ px: 2, py: 1.5, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', overflowX: 'auto', display: 'flex', gap: 2 }}>
          {following.map((u) => (
            <Box
              key={u.id}
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, cursor: 'pointer', flexShrink: 0 }}
              onClick={() => navigate(`/user/${u.username}`)}
            >
              <Avatar
                src={u.profile_image_url}
                sx={{ width: 52, height: 52, border: '2px solid', borderColor: 'secondary.main', bgcolor: 'secondary.main' }}
              >
                {u.display_name?.[0]?.toUpperCase()}
              </Avatar>
              <Typography variant='caption' sx={{ fontSize: '0.65rem', maxWidth: 52, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {u.username}
              </Typography>
            </Box>
          ))}
        </Box>
      )}

      {/* 피드 */}
      <Box sx={{ p: 1.5 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <FitnessCenterIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography color='text.secondary'>아직 게시물이 없습니다.</Typography>
            <Typography variant='body2' color='text.disabled' sx={{ mt: 0.5 }}>
              첫 번째 운동 스토리를 공유해보세요!
            </Typography>
          </Box>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              isLiked={likedSet.has(post.id)}
              onLikeToggle={handleLikeToggle}
            />
          ))
        )}
      </Box>

      <BottomNav />
    </Box>
  );
}

export default HomePage;
