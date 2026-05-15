import { useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import PostCard from '../components/ui/post-card';
import SortTabs from '../components/ui/sort-tabs';
import LeftSidebar from '../components/common/left-sidebar';
import RightSidebar from '../components/common/right-sidebar';
import { usePosts } from '../hooks/use-posts';

function HomePage() {
  const [sortBy, setSortBy] = useState('hot');
  const { posts, loading } = usePosts(null, sortBy);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* 왼쪽 사이드바 */}
          <Grid size={{ xs: 12, md: 3 }} sx={{ display: { xs: 'none', md: 'block' } }}>
            <LeftSidebar />
          </Grid>

          {/* 메인 피드 */}
          <Grid size={{ xs: 12, md: 6 }}>
            <SortTabs value={sortBy} onChange={setSortBy} />

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress color="primary" />
              </Box>
            ) : posts.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 10 }}>
                <Typography variant="h5" sx={{ color: 'text.secondary', mb: 1 }}>
                  아직 게시물이 없습니다
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  첫 번째 글을 작성해보세요!
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

          {/* 오른쪽 사이드바 */}
          <Grid size={{ xs: 12, md: 3 }} sx={{ display: { xs: 'none', md: 'block' } }}>
            <RightSidebar />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default HomePage;
