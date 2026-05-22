import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlined';

/**
 * 시간 차이를 한국어로 반환
 * @param {string} dateString
 */
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

/**
 * PostCard 컴포넌트 - 게시물 카드
 * Props:
 * @param {object} post - 게시물 데이터 [Required]
 * @param {boolean} isLiked - 현재 사용자의 좋아요 여부 [Required]
 * @param {function} onLikeToggle - 좋아요 토글 핸들러 [Required]
 */
function PostCard({ post, isLiked, onLikeToggle }) {
  const navigate = useNavigate();
  const author = post.gymstory_users;

  return (
    <Card sx={{ mb: 1.5, borderRadius: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
      {/* 작성자 정보 */}
      <Box
        sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5, cursor: 'pointer' }}
        onClick={() => navigate(`/user/${author?.username}`)}
      >
        <Avatar
          src={author?.profile_image_url}
          sx={{ width: 36, height: 36, mr: 1, bgcolor: 'secondary.main' }}
        >
          {author?.display_name?.[0]?.toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant='body2' sx={{ fontWeight: 600, lineHeight: 1.2 }}>
            {author?.display_name}
          </Typography>
          <Typography variant='caption' sx={{ color: 'text.secondary' }}>
            @{author?.username} · {timeAgo(post.created_at)}
          </Typography>
        </Box>
      </Box>

      {/* 이미지 */}
      <CardMedia
        component='img'
        image={post.image_url}
        alt='게시물 이미지'
        sx={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', cursor: 'pointer' }}
        onClick={() => navigate(`/post/${post.id}`)}
      />

      {/* 좋아요 / 댓글 버튼 */}
      <CardActions sx={{ px: 1, py: 0.5 }}>
        <IconButton
          size='small'
          onClick={() => onLikeToggle(post.id, isLiked)}
          sx={{ color: isLiked ? 'error.main' : 'text.secondary' }}
        >
          {isLiked ? <FavoriteIcon fontSize='small' /> : <FavoriteBorderIcon fontSize='small' />}
        </IconButton>
        <Typography variant='caption' sx={{ mr: 1, color: 'text.secondary' }}>
          {post.likes_count}
        </Typography>
        <IconButton
          size='small'
          sx={{ color: 'text.secondary' }}
          onClick={() => navigate(`/post/${post.id}`)}
        >
          <ChatBubbleOutlineIcon fontSize='small' />
        </IconButton>
        <Typography variant='caption' sx={{ color: 'text.secondary' }}>
          {post.comments_count}
        </Typography>
      </CardActions>

      {/* 캡션 */}
      <CardContent sx={{ pt: 0, pb: '12px !important' }}>
        <Typography variant='body2' sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          <Box component='span' sx={{ fontWeight: 600, mr: 0.5 }}>
            {author?.username}
          </Box>
          {post.caption}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default PostCard;
