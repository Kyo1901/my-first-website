import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/auth-context';

function LeftSidebar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [boards, setBoards] = useState([]);
  const [subscribedBoards, setSubscribedBoards] = useState(new Set());

  useEffect(() => {
    fetchBoards();
  }, []);

  useEffect(() => {
    if (user) fetchSubscribedBoards();
    else setSubscribedBoards(new Set());
  }, [user]);

  async function fetchBoards() {
    const { data } = await supabase
      .from('roundit_boards')
      .select('*')
      .order('member_cnt', { ascending: false });
    setBoards(data || []);
  }

  async function fetchSubscribedBoards() {
    const { data } = await supabase
      .from('roundit_board_members')
      .select('board_id')
      .eq('user_id', user.id);
    setSubscribedBoards(new Set((data || []).map(m => m.board_id)));
  }

  async function toggleSubscribe(boardId, e) {
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }

    if (subscribedBoards.has(boardId)) {
      await supabase.from('roundit_board_members')
        .delete()
        .eq('user_id', user.id)
        .eq('board_id', boardId);
      setSubscribedBoards(prev => {
        const s = new Set(prev);
        s.delete(boardId);
        return s;
      });
    } else {
      await supabase.from('roundit_board_members')
        .insert({ user_id: user.id, board_id: boardId });
      setSubscribedBoards(prev => new Set(prev).add(boardId));
    }
  }

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', position: 'sticky', top: 76 }}>
      <Box sx={{ px: 2, py: 1.5, bgcolor: 'primary.main' }}>
        <Typography variant='subtitle2' sx={{ color: '#fff', fontWeight: 700, letterSpacing: 0.5 }}>
          게시판 목록
        </Typography>
      </Box>
      <Divider />
      <List disablePadding dense>
        {boards.map(board => (
          <ListItem
            key={board.id}
            disablePadding
            secondaryAction={
              <Button
                size="small"
                variant={subscribedBoards.has(board.id) ? 'outlined' : 'contained'}
                onClick={(e) => toggleSubscribe(board.id, e)}
                sx={{ fontSize: '11px', px: 1, py: 0.2, minWidth: 0, borderRadius: 5, height: 24 }}
              >
                {subscribedBoards.has(board.id) ? '구독중' : '구독'}
              </Button>
            }
          >
            <ListItemButton
              onClick={() => navigate(`/r/${encodeURIComponent(board.name)}`)}
              sx={{ py: 0.8, pr: 8 }}
            >
              <ListItemText
                primary={`r/${board.name}`}
                secondary={`${board.member_cnt}명`}
                primaryTypographyProps={{ fontSize: '13px', fontWeight: 500 }}
                secondaryTypographyProps={{ fontSize: '11px' }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default LeftSidebar;
