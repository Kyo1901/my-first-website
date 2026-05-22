import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import PostCard from '../components/ui/post-card';
import SortTabs from '../components/ui/sort-tabs';
import LeftSidebar from '../components/common/left-sidebar';
import RightSidebar from '../components/common/right-sidebar';
import { supabase } from '../lib/supabase';
import { usePosts } from '../hooks/use-posts';

function BoardPage() {
  const { boardName } = useParams();
  const [board, setBoard] = useState(null);
  const [boardLoading, setBoardLoading] = useState(true);
  const [sortBy, setSortBy] = useState('hot');

  useEffect(() => {
    async function fetchBoard() {
      setBoardLoading(true);
      const { data } = await supabase
        .from('roundit_boards')
        .select('*')
        .eq('name', decodeURIComponent(boardName))
        .single();
      setBoard(data);
      setBoardLoading(false);
    }
    fetchBoard();
  }, [boardName]);

  const { posts, loading } = usePosts(board?.id, sortBy);

  if (boardLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!board) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          게시판을 찾을 수 없습니다.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* 게시판 헤더 배너 */}
      <Box sx={{ bgcolor: 'primary.main', py: { xs: 3, md: 4 }, mb: 3 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ color: '#fff', fontWeight: 800, mb: 0.5 }}>
            r/{board.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            구독자 {board.member_cnt}명 · {board.description || ''}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: 4 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 3 }} sx={{ display: { xs: 'none', md: 'block' } }}>
            <LeftSidebar />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <SortTabs value={sortBy} onChange={setSortBy} />

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress />
              </Box>
            ) : posts.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 10 }}>
                <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                  아직 게시물이 없습니다
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  이 게시판의 첫 번째 글을 작성해보세요!
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {posts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </Box>
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 3 }} sx={{ display: { xs: 'none', md: 'block' } }}>
            <RightSidebar boardInfo={board} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default BoardPage;
