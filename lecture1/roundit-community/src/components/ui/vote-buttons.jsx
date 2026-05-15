import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useVote } from '../../hooks/use-vote';
import { useAuth } from '../../contexts/auth-context';

/**
 * VoteButtons 컴포넌트
 * Props:
 * @param {string} targetType - 투표 대상 유형 ('post' | 'comment') [Required]
 * @param {number} targetId - 투표 대상 ID [Required]
 * @param {number} initialScore - 초기 투표 점수 [Required]
 * @param {string} direction - 버튼 방향 ('column' | 'row') [Optional, 기본값: 'column']
 *
 * Example usage:
 * <VoteButtons targetType="post" targetId={post.id} initialScore={post.vote_score} />
 */
function VoteButtons({ targetType, targetId, initialScore, direction = 'column' }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userVote, vote } = useVote(targetType, targetId, user?.id);
  const [score, setScore] = useState(initialScore);

  useEffect(() => {
    setScore(initialScore);
  }, [initialScore]);

  const handleVote = async (voteType) => {
    if (!user) { navigate('/login'); return; }

    let delta = 0;
    if (userVote === voteType) {
      delta = voteType === 'up' ? -1 : 1;
    } else if (userVote) {
      delta = voteType === 'up' ? 2 : -2;
    } else {
      delta = voteType === 'up' ? 1 : -1;
    }

    setScore(s => s + delta);
    await vote(voteType);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: direction, alignItems: 'center', gap: 0.2 }}>
      <IconButton
        size="small"
        onClick={() => handleVote('up')}
        sx={{ color: userVote === 'up' ? 'secondary.main' : 'text.secondary', p: 0.4 }}
      >
        <ArrowUpwardIcon fontSize="small" />
      </IconButton>
      <Typography
        variant="caption"
        sx={{
          fontWeight: 700,
          color: userVote ? 'primary.main' : 'text.secondary',
          minWidth: 24,
          textAlign: 'center',
          fontSize: '12px',
        }}
      >
        {score}
      </Typography>
      <IconButton
        size="small"
        onClick={() => handleVote('down')}
        sx={{ color: userVote === 'down' ? 'primary.main' : 'text.secondary', p: 0.4 }}
      >
        <ArrowDownwardIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}

export default VoteButtons;
