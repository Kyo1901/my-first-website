import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '../contexts/auth-context';

function LoginPage() {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isSignUp) {
      const { error: err } = await signUp(email, password, username);
      if (err) {
        setError(err.message);
      } else {
        navigate('/');
      }
    } else {
      const { error: err } = await signIn(email, password);
      if (err) {
        setError(err.message);
      } else {
        navigate('/');
      }
    }
    setLoading(false);
  }

  async function handleGoogleLogin() {
    setError('');
    const { error: err } = await signInWithGoogle();
    if (err) setError(err.message);
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', py: 4 }}>
      <Container maxWidth="xs">
        <Paper variant="outlined" sx={{ p: 4, borderRadius: 3 }}>
          {/* 로고 */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{
              width: 52, height: 52, borderRadius: '50%', bgcolor: 'primary.main',
              display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5,
            }}>
              <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '22px' }}>R</Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main' }}>Roundit</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              {isSignUp ? '새 계정을 만들어 커뮤니티에 참여하세요' : '환영합니다! 다시 오셨군요'}
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {/* 구글 로그인 */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            sx={{ mb: 2, borderRadius: 5, textTransform: 'none', fontWeight: 600, py: 1 }}
          >
            Google로 계속하기
          </Button>

          <Divider sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>또는</Typography>
          </Divider>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {isSignUp && (
              <TextField
                label="닉네임"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                size="small"
                placeholder="커뮤니티에서 표시될 이름"
              />
            )}
            <TextField
              label="이메일"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              size="small"
            />
            <TextField
              label="비밀번호"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              size="small"
              inputProps={{ minLength: 6 }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ borderRadius: 5, textTransform: 'none', fontWeight: 700, py: 1.2 }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : isSignUp ? '가입하기' : '로그인'}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 2.5 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {isSignUp ? '이미 계정이 있으신가요?' : '아직 계정이 없으신가요?'}
              {' '}
              <Button
                variant="text"
                size="small"
                onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                sx={{ textTransform: 'none', fontWeight: 700, p: 0, minWidth: 0 }}
              >
                {isSignUp ? '로그인' : '가입하기'}
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default LoginPage;
