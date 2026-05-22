import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/use-auth';

function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000);
  if (seconds < 60) return '방금 전';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일 전`;
  return new Date(dateString).toLocaleDateString('ko-KR');
}

function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      const [{ data: postData }, { data: commentsData }, { data: likeData }] = await Promise.all([
        supabase.from('gymstory_posts').select('*, gymstory_users(id, username, display_name, profile_image_url)').eq('id', id).single(),
        supabase.from('gymstory_comments').select('*, gymstory_users(id, username, display_name, profile_image_url)').eq('post_id', id).order('created_at', { ascending: true }),
        supabase.from('gymstory_likes').select('id').match({ post_id: id, user_id: user.id }).single(),
      ]);
      setPost(postData);
      setComments(commentsData || []);
      setIsLiked(!!likeData);
      setLoading(false);
    };
    fetchPost();
  }, [id, user.id]);

  const handleLikeToggle = async () => {
    if (isLiked) {
      await supabase.from('gymstory_likes').delete().match({ post_id: id, user_id: user.id });
      setIsLiked(false);
      setPost((p) => ({ ...p, likes_count: Math.max(0, p.likes_count - 1) }));
    } else {
      await supabase.from('gymstory_likes').insert({ post_id: id, user_id: user.id });
      setIsLiked(true);
      setPost((p) => ({ ...p, likes_count: p.likes_count + 1 }));
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    setSubmitting(true);
    const { data } = await supabase
      .from('gymstory_comments')
      .insert({ post_id: Number(id), user_id: user.id, content: commentText.trim() })
      .select('*, gymstory_users(id, username, display_name, profile_image_url)')
      .single();
    if (data) {
      setComments((prev) => [...prev, data]);
      setPost((p) => ({ ...p, comments_count: p.comments_count + 1 }));
      setCommentText('');
    }
    setSubmitting(false);
  };

  const handleDeleteComment = async (commentId) => {
    await supabase.from('gymstory_comments').delete().eq('id', commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    setPost((p) => ({ ...p, comments_count: Math.max(0, p.comments_count - 1) }));
  };

  const handleDeletePost = async () => {
    if (!window.confirm('게시물을 삭제하시겠습니까?')) return;
    await supabase.from('gymstory_posts').delete().eq('id', id);
    navigate('/');
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <CircularProgress />
    </Box>
  );

  if (!post) return null;
  const author = post.gymstory_users;

  return (
    <Box sx={{ width: '100%', maxWidth: 480, minHeight: '100vh', bgcolor: 'background.paper' }}>
      {/* 헤더 */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 1, borderBottom: '1px solid', borderColor: 'divider', position: 'sticky', top: 0, zIndex: 100, bgcolor: 'background.paper' }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant='subtitle1' sx={{ fontWeight: 600, ml: 1 }}>게시물</Typography>
        {post.user_id === user.id && (
          <IconButton sx={{ ml: 'auto', color: 'error.main' }} onClick={handleDeletePost}>
            <DeleteOutlineIcon />
          </IconButton>
        )}
      </Box>

      {/* 작성자 */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5, cursor: 'pointer' }} onClick={() => navigate(`/user/${author?.username}`)}>
        <Avatar src={author?.profile_image_url} sx={{ width: 38, height: 38, mr: 1.5, bgcolor: 'secondary.main' }}>
          {author?.display_name?.[0]?.toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant='body2' sx={{ fontWeight: 600 }}>{author?.display_name}</Typography>
          <Typography variant='caption' color='text.secondary'>@{author?.username} · {timeAgo(post.created_at)}</Typography>
        </Box>
      </Box>

      {/* 이미지 */}
      <Box component='img' src={post.image_url} alt='게시물' sx={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }} />

      {/* 좋아요 */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 0.5 }}>
        <IconButton onClick={handleLikeToggle} sx={{ color: isLiked ? 'error.main' : 'text.secondary' }}>
          {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <Typography variant='body2' color='text.secondary'>{post.likes_count}개</Typography>
      </Box>

      {/* 캡션 */}
      <Box sx={{ px: 2, pb: 1.5 }}>
        <Typography variant='body2'>
          <Box component='span' sx={{ fontWeight: 600, mr: 0.5 }}>{author?.username}</Box>
          {post.caption}
        </Typography>
      </Box>

      <Divider />

      {/* 댓글 목록 */}
      <Box sx={{ px: 2, py: 1 }}>
        {comments.map((comment) => (
          <Box key={comment.id} sx={{ display: 'flex', alignItems: 'flex-start', py: 1, gap: 1 }}>
            <Avatar src={comment.gymstory_users?.profile_image_url} sx={{ width: 30, height: 30, bgcolor: 'primary.main', flexShrink: 0 }}>
              {comment.gymstory_users?.display_name?.[0]?.toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant='caption' sx={{ fontWeight: 600 }}>{comment.gymstory_users?.username}</Typography>
              <Typography variant='caption' color='text.secondary' sx={{ ml: 0.5 }}>{timeAgo(comment.created_at)}</Typography>
              <Typography variant='body2' sx={{ mt: 0.25 }}>{comment.content}</Typography>
            </Box>
            {comment.user_id === user.id && (
              <IconButton size='small' onClick={() => handleDeleteComment(comment.id)} sx={{ color: 'text.disabled' }}>
                <DeleteOutlineIcon fontSize='small' />
              </IconButton>
            )}
          </Box>
        ))}
      </Box>

      {/* 댓글 입력 */}
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', position: 'sticky', bottom: 0, gap: 1 }}>
        <TextField
          variant='outlined'
          size='small'
          fullWidth
          placeholder='댓글 달기...'
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleCommentSubmit()}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 6 } }}
        />
        <Button variant='contained' size='small' onClick={handleCommentSubmit} disabled={submitting || !commentText.trim()} sx={{ flexShrink: 0 }}>
          게시
        </Button>
      </Box>
    </Box>
  );
}

export default PostDetailPage;
