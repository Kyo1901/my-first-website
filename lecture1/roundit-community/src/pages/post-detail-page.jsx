import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CommentItem from '../components/ui/comment-item';
import VoteButtons from '../components/ui/vote-buttons';
import RightSidebar from '../components/common/right-sidebar';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/auth-context';
import { formatTime } from '../utils/format-time';

function PostDetailPage() {
  const { boardName, postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPost = useCallback(async () => {
    const { data } = await supabase
      .from('roundit_posts')
      .select('*, roundit_users!author_id(id, username), roundit_boards!board_id(id, name, description, member_cnt)')
      .eq('id', postId)
      .single();
    setPost(data);
  }, [postId]);

  const fetchComments = useCallback(async () => {
    const { data } = await supabase
      .from('roundit_comments')
      .select('*, roundit_users!author_id(id, username)')
      .eq('post_id', postId)
      .order('vote_score', { ascending: false });
    setComments(data || []);
  }, [postId]);

  useEffect(() => {
    async function init() {
      setLoading(true);
      await Promise.all([fetchPost(), fetchComments()]);
      setLoading(false);
    }
    init();
  }, [fetchPost, fetchComments]);

  async function handleSubmitComment() {
    if (!newComment.trim() || !user) return;
    setSubmitting(true);
    await supabase.from('roundit_comments').insert({
      content: newComment.trim(),
      author_id: user.id,
      post_id: parseInt(postId),
    });
    setNewComment('');
    await fetchComments();
    setSubmitting(false);
  }

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;
  }

  if (!post) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>게시물을 찾을 수 없습니다.</Typography>
      </Box>
    );
  }

  const rootComments = comments.filter(c => !c.parent_id);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 9 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{ mb: 2, textTransform: 'none', color: 'text.secondary' }}
            >
              돌아가기
            </Button>

            {/* 게시물 본문 */}
            <Paper variant="outlined" sx={{ borderRadius: 2, mb: 2 }}>
              <Box sx={{ display: 'flex' }}>
                <Box sx={{ bgcolor: 'action.hover', px: 1, py: 2, display: 'flex', alignItems: 'flex-start', flexShrink: 0 }}>
                  <VoteButtons targetType="post" targetId={post.id} initialScore={post.vote_score} />
                </Box>
                <Box sx={{ flex: 1, p: 2, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={`r/${post.roundit_boards?.name}`}
                      size="small"
                      onClick={() => navigate(`/r/${encodeURIComponent(post.roundit_boards?.name || '')}`)}
                      sx={{ cursor: 'pointer', fontWeight: 700, bgcolor: 'primary.main', color: '#fff', height: 20, fontSize: '11px' }}
                    />
                    {post.flair && (
                      <Chip label={post.flair} size="small" color="primary" variant="outlined" sx={{ height: 18, fontSize: '10px' }} />
                    )}
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      u/{post.roundit_users?.username || '알 수 없음'} · {formatTime(post.created_at)}
                    </Typography>
                  </Box>

                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, lineHeight: 1.3 }}>
                    {post.title}
                  </Typography>

                  {post.content && (
                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2, whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                      {post.content}
                    </Typography>
                  )}

                  {post.image_url && (
                    <Box component="img" src={post.image_url} alt=""
                      sx={{ maxWidth: '100%', borderRadius: 1, mb: 2, display: 'block' }} />
                  )}

                  {post.link_url && (
                    <Button
                      variant="outlined"
                      href={post.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      startIcon={<OpenInNewIcon />}
                      sx={{ textTransform: 'none', mb: 2 }}
                    >
                      링크 열기
                    </Button>
                  )}

                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    댓글 {post.comment_cnt}개
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* 댓글 작성 */}
            <Paper variant="outlined" sx={{ borderRadius: 2, p: 2, mb: 2 }}>
              {user ? (
                <>
                  <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary', fontWeight: 500 }}>
                    u/{user.email?.split('@')[0]}로 댓글 작성
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="댓글을 작성해주세요..."
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    sx={{ mb: 1 }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleSubmitComment}
                    disabled={submitting || !newComment.trim()}
                    sx={{ textTransform: 'none', borderRadius: 5, fontWeight: 600 }}
                  >
                    댓글 작성
                  </Button>
                </>
              ) : (
                <Box sx={{ textAlign: 'center', py: 1 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
                    댓글을 작성하려면 로그인이 필요합니다.
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/login')}
                    sx={{ textTransform: 'none', borderRadius: 5 }}
                  >
                    로그인하기
                  </Button>
                </Box>
              )}
            </Paper>

            {/* 댓글 목록 */}
            <Paper variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                댓글 {comments.length}개
              </Typography>
              <Divider sx={{ mb: 1 }} />

              {rootComments.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    첫 번째 댓글을 작성해보세요!
                  </Typography>
                </Box>
              ) : (
                rootComments.map(comment => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    allComments={comments}
                    depth={0}
                    onReply={fetchComments}
                  />
                ))
              )}
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 3 }} sx={{ display: { xs: 'none', md: 'block' } }}>
            <RightSidebar boardInfo={post.boards} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default PostDetailPage;
