import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import PeopleIcon from '@mui/icons-material/People';
import { useAuth } from '../../contexts/auth-context';

/**
 * RightSidebar 컴포넌트
 * Props:
 * @param {object} boardInfo - 게시판 정보 (보드 페이지에서 전달) [Optional]
 *
 * Example usage:
 * <RightSidebar />
 * <RightSidebar boardInfo={board} />
 */
function RightSidebar({ boardInfo }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ px: 2, py: 1.5, bgcolor: 'primary.main' }}>
          <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 700 }}>
            {boardInfo ? `r/${boardInfo.name}` : 'Roundit 소개'}
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.6 }}>
            {boardInfo?.description ||
              '누구나 원하는 주제의 게시판을 만들고 자유롭게 이야기를 나눌 수 있는 커뮤니티입니다. Reddit처럼 주제별 독립 게시판에서 소통해보세요.'}
          </Typography>
          {boardInfo && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
              <PeopleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                구독자 {boardInfo.member_cnt || 0}명
              </Typography>
            </Box>
          )}
          <Button
            variant="contained"
            fullWidth
            onClick={() => user ? navigate('/create-post') : navigate('/login')}
            sx={{ borderRadius: 5, textTransform: 'none', fontWeight: 600 }}
          >
            글 작성하기
          </Button>
        </Box>
      </Paper>

      <Paper variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.8, display: 'block' }}>
          Roundit는 Reddit 스타일의 커뮤니티입니다.
          <br />게시물에 업보트/다운보트로 평가하고,
          <br />관심 게시판을 구독하여 맞춤 피드를 만들어보세요.
        </Typography>
      </Paper>
    </Box>
  );
}

export default RightSidebar;
