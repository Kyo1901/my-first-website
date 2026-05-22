import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Alert from '@mui/material/Alert';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../hooks/use-auth';
import { supabase } from '../lib/supabase';

function AuthPage() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    email: '', password: '', confirmPassword: '', username: '', displayName: '',
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: err } = await signIn(loginForm.email, loginForm.password);
    setLoading(false);
    if (err) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    } else {
      navigate('/');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (registerForm.password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(registerForm.username)) {
      setError('사용자명은 영문, 숫자, _ 만 사용 가능합니다 (3~30자).');
      return;
    }

    setLoading(true);

    // 사용자명 중복 확인
    const { data: existing } = await supabase
      .from('gymstory_users')
      .select('id')
      .eq('username', registerForm.username)
      .single();

    if (existing) {
      setError('이미 사용 중인 사용자명입니다.');
      setLoading(false);
      return;
    }

    const { data, error: err } = await signUp(
      registerForm.email,
      registerForm.password,
      registerForm.username,
      registerForm.displayName || registerForm.username
    );

    setLoading(false);
    if (err) {
      const msg = err.message?.toLowerCase() || '';
      if (msg.includes('rate limit') || msg.includes('email rate')) {
        setError('이메일 전송 한도를 초과했습니다. Supabase 대시보드에서 "Confirm email" 설정을 OFF로 변경하거나, 1시간 후 다시 시도해주세요.');
      } else if (msg.includes('already registered') || msg.includes('already been registered')) {
        setError('이미 가입된 이메일입니다. 로그인 탭을 이용해주세요.');
      } else if (msg.includes('invalid email')) {
        setError('올바른 이메일 형식이 아닙니다.');
      } else {
        setError(err.message);
      }
    } else if (data.session) {
      navigate('/');
    } else {
      setMessage('가입 확인 이메일을 보냈습니다. 이메일을 확인하거나, Supabase에서 "Confirm email"을 OFF로 설정하면 바로 로그인할 수 있습니다.');
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth='xs' sx={{ py: 4 }}>
        {/* 로고 */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <FitnessCenterIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 1 }} />
          <Typography variant='h4' sx={{ fontWeight: 700, color: 'primary.main', letterSpacing: -1 }}>
            GymStory
          </Typography>
          <Typography variant='body2' sx={{ color: 'text.secondary', mt: 0.5 }}>
            운동 기록을 공유하세요
          </Typography>
        </Box>

        {/* 탭 */}
        <Tabs value={tab} onChange={(_, v) => { setTab(v); setError(''); setMessage(''); }} centered sx={{ mb: 3 }}>
          <Tab label='로그인' />
          <Tab label='회원가입' />
        </Tabs>

        {error && <Alert severity='error' sx={{ mb: 2 }}>{error}</Alert>}
        {message && <Alert severity='info' sx={{ mb: 2 }}>{message}</Alert>}

        {/* 로그인 폼 */}
        {tab === 0 && (
          <Box component='form' onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label='이메일'
              type='email'
              required
              fullWidth
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
            />
            <TextField
              label='비밀번호'
              type='password'
              required
              fullWidth
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            />
            <Button
              type='submit'
              variant='contained'
              fullWidth
              size='large'
              disabled={loading}
              sx={{ mt: 1 }}
            >
              {loading ? <CircularProgress size={22} color='inherit' /> : '로그인'}
            </Button>
          </Box>
        )}

        {/* 회원가입 폼 */}
        {tab === 1 && (
          <Box component='form' onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label='이메일'
              type='email'
              required
              fullWidth
              value={registerForm.email}
              onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
            />
            <TextField
              label='사용자명 (@아이디)'
              required
              fullWidth
              value={registerForm.username}
              onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
              helperText='영문, 숫자, _ 사용 가능 (3~30자)'
            />
            <TextField
              label='표시 이름'
              fullWidth
              value={registerForm.displayName}
              onChange={(e) => setRegisterForm({ ...registerForm, displayName: e.target.value })}
            />
            <TextField
              label='비밀번호'
              type='password'
              required
              fullWidth
              value={registerForm.password}
              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              helperText='6자 이상'
            />
            <TextField
              label='비밀번호 확인'
              type='password'
              required
              fullWidth
              value={registerForm.confirmPassword}
              onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
            />
            <Button
              type='submit'
              variant='contained'
              fullWidth
              size='large'
              disabled={loading}
              sx={{ mt: 1 }}
            >
              {loading ? <CircularProgress size={22} color='inherit' /> : '회원가입'}
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default AuthPage;
