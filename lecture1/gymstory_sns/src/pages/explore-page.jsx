import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import InputAdornment from '@mui/material/InputAdornment';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import SearchIcon from '@mui/icons-material/Search';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/use-auth';
import BottomNav from '../components/common/bottom-nav';

function ExplorePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const { data } = await supabase
        .from('gymstory_posts')
        .select('id, image_url')
        .order('created_at', { ascending: false })
        .limit(30);
      setPosts(data || []);
      setLoading(false);
    };
    fetchAll();
  }, []);

  useEffect(() => {
    if (!search.trim()) { setUsers([]); return; }
    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from('gymstory_users')
        .select('id, username, display_name, profile_image_url')
        .ilike('username', `%${search}%`)
        .neq('id', user.id)
        .limit(10);
      setUsers(data || []);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, user.id]);

  return (
    <Box sx={{ width: '100%', maxWidth: 480, minHeight: '100vh', bgcolor: 'background.default', pb: 8 }}>
      {/* 헤더 */}
      <Box sx={{ px: 2, py: 1.5, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', position: 'sticky', top: 0, zIndex: 100 }}>
        <TextField
          fullWidth
          size='small'
          placeholder='사용자명으로 검색...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon fontSize='small' />
              </InputAdornment>
            ),
          }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 6 } }}
        />
      </Box>

      {/* 유저 검색 결과 */}
      {search.trim() && (
        <Box sx={{ bgcolor: 'background.paper', mb: 0.5 }}>
          {users.length === 0 ? (
            <Typography variant='body2' color='text.secondary' sx={{ px: 2, py: 2, textAlign: 'center' }}>
              검색 결과가 없습니다.
            </Typography>
          ) : (
            users.map((u) => (
              <Box
                key={u.id}
                sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5, gap: 1.5, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                onClick={() => navigate(`/user/${u.username}`)}
              >
                <Avatar src={u.profile_image_url} sx={{ width: 40, height: 40, bgcolor: 'secondary.main' }}>
                  {u.display_name?.[0]?.toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant='body2' sx={{ fontWeight: 600 }}>{u.display_name}</Typography>
                  <Typography variant='caption' color='text.secondary'>@{u.username}</Typography>
                </Box>
              </Box>
            ))
          )}
        </Box>
      )}

      {/* 전체 게시물 그리드 */}
      {!search.trim() && (
        loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
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
        )
      )}

      <BottomNav />
    </Box>
  );
}

export default ExplorePage;
