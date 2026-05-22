import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ImageIcon from '@mui/icons-material/Image';
import LinkIcon from '@mui/icons-material/Link';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/auth-context';

function CreatePostPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [boards, setBoards] = useState([]);
  const [boardId, setBoardId] = useState('');
  const [postType, setPostType] = useState('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [flair, setFlair] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    supabase.from('roundit_boards').select('id, name').order('name')
      .then(({ data }) => setBoards(data || []));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!boardId || !title.trim()) {
      setError('게시판과 제목을 입력해주세요.');
      return;
    }
    setError('');
    setSubmitting(true);

    const { data, error: err } = await supabase.from('roundit_posts').insert({
      title: title.trim(),
      content: content.trim() || null,
      post_type: postType,
      image_url: postType === 'image' ? imageUrl.trim() || null : null,
      link_url: postType === 'link' ? linkUrl.trim() || null : null,
      flair: flair.trim() || null,
      author_id: user.id,
      board_id: parseInt(boardId),
    }).select().single();

    if (err) {
      setError(err.message);
      setSubmitting(false);
    } else {
      const board = boards.find(b => b.id === parseInt(boardId));
      navigate(`/r/${encodeURIComponent(board?.name || '')}/post/${data.id}`);
    }
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
          게시물 작성
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Paper variant="outlined" sx={{ borderRadius: 2, p: 3 }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* 게시판 선택 */}
            <FormControl size="small" required>
              <InputLabel>게시판 선택</InputLabel>
              <Select value={boardId} onChange={e => setBoardId(e.target.value)} label="게시판 선택">
                {boards.map(b => (
                  <MenuItem key={b.id} value={b.id}>r/{b.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* 게시물 유형 */}
            <Box>
              <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary', fontWeight: 500 }}>
                게시물 유형
              </Typography>
              <ToggleButtonGroup
                value={postType}
                exclusive
                onChange={(_, v) => v && setPostType(v)}
                size="small"
              >
                <ToggleButton value="text">
                  <TextFieldsIcon fontSize="small" sx={{ mr: 0.5 }} />텍스트
                </ToggleButton>
                <ToggleButton value="image">
                  <ImageIcon fontSize="small" sx={{ mr: 0.5 }} />이미지
                </ToggleButton>
                <ToggleButton value="link">
                  <LinkIcon fontSize="small" sx={{ mr: 0.5 }} />링크
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* 제목 */}
            <TextField
              label="제목"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              fullWidth
              inputProps={{ maxLength: 300 }}
              helperText={`${title.length}/300`}
            />

            {/* 내용 (유형별) */}
            {postType === 'text' && (
              <TextField
                label="내용"
                value={content}
                onChange={e => setContent(e.target.value)}
                multiline
                rows={8}
                fullWidth
                placeholder="내용을 작성해주세요..."
              />
            )}
            {postType === 'image' && (
              <TextField
                label="이미지 URL"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                fullWidth
                placeholder="https://..."
              />
            )}
            {postType === 'link' && (
              <TextField
                label="링크 URL"
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                fullWidth
                placeholder="https://..."
              />
            )}

            {/* 플레어 */}
            <TextField
              label="플레어 (선택)"
              value={flair}
              onChange={e => setFlair(e.target.value)}
              size="small"
              placeholder="질문, 정보, 유머 등..."
            />

            {/* 제출 버튼 */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                sx={{ borderRadius: 5, textTransform: 'none', fontWeight: 700, px: 4, py: 1 }}
              >
                {submitting ? <CircularProgress size={20} color="inherit" /> : '게시하기'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                sx={{ borderRadius: 5, textTransform: 'none' }}
              >
                취소
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default CreatePostPage;
