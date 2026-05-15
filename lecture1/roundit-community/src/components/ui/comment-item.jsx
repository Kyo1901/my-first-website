import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import VoteButtons from './vote-buttons';
import { useAuth } from '../../contexts/auth-context';
import { supabase } from '../../lib/supabase';
import { formatTime } from '../../utils/format-time';

/**
 * CommentItem 컴포넌트 (재귀적 대댓글 지원)
 * Props:
 * @param {object} comment - 댓글 데이터 [Required]
 * @param {array} allComments - 전체 댓글 배열 [Required]
 * @param {number} depth - 현재 댓글 깊이 [Optional, 기본값: 0]
 * @param {function} onReply - 댓글 작성 후 콜백 [Required]
 *
 * Example usage:
 * <CommentItem comment={comment} allComments={comments} onReply={refetch} />
 */
function CommentItem({ comment, allComments, depth = 0, onReply }) {
  const { user } = useAuth();
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const replies = allComments.filter(c => c.parent_id === comment.id);
  const authorName = comment.users?.username || '알 수 없음';

  async function handleSubmitReply() {
    if (!replyContent.trim() || !user) return;
    setSubmitting(true);
    await supabase.from('comments').insert({
      content: replyContent.trim(),
      author_id: user.id,
      post_id: comment.post_id,
      parent_id: comment.id,
    });
    setReplyContent('');
    setShowReply(false);
    setSubmitting(false);
    onReply();
  }

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        ml: depth > 0 ? 3 : 0,
        borderLeft: depth > 0 ? '2px solid' : 'none',
        borderColor: 'divider',
        pl: depth > 0 ? 1.5 : 0,
        mt: 1.5,
      }}
    >
      <Avatar
        sx={{ width: 26, height: 26, fontSize: '12px', bgcolor: 'primary.light', flexShrink: 0, mt: 0.2 }}
      >
        {authorName[0].toUpperCase()}
      </Avatar>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.3 }}>
          <Typography variant="caption" sx={{ fontWeight: 700 }}>
            u/{authorName}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {formatTime(comment.created_at)}
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ mb: 0.5, lineHeight: 1.6 }}>
          {comment.content}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box onClick={e => e.stopPropagation()}>
            <VoteButtons
              targetType="comment"
              targetId={comment.id}
              initialScore={comment.vote_score}
              direction="row"
            />
          </Box>
          {depth < 5 && (
            <Button
              size="small"
              sx={{ textTransform: 'none', fontSize: '11px', p: 0.3, color: 'text.secondary', minWidth: 0 }}
              onClick={() => setShowReply(!showReply)}
            >
              답글
            </Button>
          )}
        </Box>

        {showReply && (
          <Box sx={{ mt: 1 }}>
            <TextField
              fullWidth
              multiline
              rows={2}
              size="small"
              placeholder="답글을 작성해주세요..."
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
            />
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
              <Button
                size="small"
                variant="contained"
                onClick={handleSubmitReply}
                disabled={submitting || !replyContent.trim()}
                sx={{ textTransform: 'none', borderRadius: 5, fontWeight: 600 }}
              >
                작성
              </Button>
              <Button
                size="small"
                onClick={() => setShowReply(false)}
                sx={{ textTransform: 'none', borderRadius: 5 }}
              >
                취소
              </Button>
            </Box>
          </Box>
        )}

        {replies.map(reply => (
          <CommentItem
            key={reply.id}
            comment={reply}
            allComments={allComments}
            depth={depth + 1}
            onReply={onReply}
          />
        ))}
      </Box>
    </Box>
  );
}

export default CommentItem;
