import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import VoteButtons from './vote-buttons';
import { useAuth } from '../../contexts/auth-context';
import { supabase } from '../../lib/supabase';
import { formatTime } from '../../utils/format-time';

/**
 * PostCard 컴포넌트
 * Props:
 * @param {object} post - 게시물 데이터 [Required]
 *
 * Example usage:
 * <PostCard post={post} />
 */
function PostCard({ post }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const boardName = post.boards?.name || '';
  const authorName = post.users?.username || '알 수 없음';
  const timeAgo = formatTime(post.created_at);

  const handleBookmark = async (e) => {
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    if (isBookmarked) {
      await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('post_id', post.id);
      setIsBookmarked(false);
    } else {
      await supabase.from('bookmarks').insert({ user_id: user.id, post_id: post.id });
      setIsBookmarked(true);
    }
  };

  const handleNavigate = () => {
    navigate(`/r/${encodeURIComponent(boardName)}/post/${post.id}`);
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        display: 'flex',
        borderRadius: 2,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color 0.15s',
        '&:hover': { borderColor: 'primary.main' },
      }}
      onClick={handleNavigate}
    >
      {/* 투표 영역 */}
      <Box
        sx={{ bgcolor: 'action.hover', px: 1, py: 1.5, display: 'flex', alignItems: 'flex-start', flexShrink: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <VoteButtons targetType="post" targetId={post.id} initialScore={post.vote_score} direction="column" />
      </Box>

      {/* 콘텐츠 영역 */}
      <Box sx={{ flex: 1, p: 1.5, minWidth: 0 }}>
        {/* 메타 정보 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.8, flexWrap: 'wrap' }}>
          <Chip
            label={`r/${boardName}`}
            size="small"
            onClick={(e) => { e.stopPropagation(); navigate(`/r/${encodeURIComponent(boardName)}`); }}
            sx={{ height: 20, fontSize: '11px', fontWeight: 700, cursor: 'pointer', bgcolor: 'primary.main', color: '#fff' }}
          />
          {post.flair && (
            <Chip
              label={post.flair}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ height: 18, fontSize: '10px' }}
            />
          )}
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            u/{authorName} · {timeAgo}
          </Typography>
        </Box>

        {/* 제목 */}
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, mb: 0.5, lineHeight: 1.35, fontSize: { xs: '0.88rem', md: '0.97rem' } }}
        >
          {post.title}
        </Typography>

        {/* 내용 미리보기 */}
        {post.content && (
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontSize: '0.82rem',
            }}
          >
            {post.content}
          </Typography>
        )}

        {/* 이미지 미리보기 */}
        {post.image_url && (
          <Box
            component="img"
            src={post.image_url}
            alt="post"
            sx={{ maxWidth: '100%', maxHeight: 240, borderRadius: 1, mb: 1, display: 'block', objectFit: 'cover' }}
          />
        )}

        {/* 액션 버튼 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }} onClick={e => e.stopPropagation()}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 0.3, cursor: 'pointer' }}
            onClick={handleNavigate}
          >
            <IconButton size="small" sx={{ color: 'text.secondary', p: 0.4 }}>
              <ModeCommentOutlinedIcon fontSize="small" />
            </IconButton>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {post.comment_cnt} 댓글
            </Typography>
          </Box>

          <IconButton
            size="small"
            onClick={handleBookmark}
            sx={{ color: isBookmarked ? 'primary.main' : 'text.secondary', p: 0.4 }}
          >
            {isBookmarked ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
}

export default PostCard;
