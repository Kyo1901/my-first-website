import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const TABS = [
  { id: 'hot', label: '핫', icon: <WhatshotIcon fontSize="small" /> },
  { id: 'new', label: '새글', icon: <NewReleasesIcon fontSize="small" /> },
  { id: 'top', label: '탑', icon: <TrendingUpIcon fontSize="small" /> },
];

/**
 * SortTabs 컴포넌트
 * Props:
 * @param {string} value - 현재 선택된 탭 ID [Required]
 * @param {function} onChange - 탭 변경 함수 [Required]
 *
 * Example usage:
 * <SortTabs value={sortBy} onChange={setSortBy} />
 */
function SortTabs({ value, onChange }) {
  return (
    <Paper variant="outlined" sx={{ display: 'flex', gap: 0.5, p: 0.5, mb: 2, borderRadius: 2 }}>
      {TABS.map(tab => (
        <Button
          key={tab.id}
          size="small"
          startIcon={tab.icon}
          variant={value === tab.id ? 'contained' : 'text'}
          onClick={() => onChange(tab.id)}
          sx={{
            borderRadius: 1.5,
            textTransform: 'none',
            fontWeight: value === tab.id ? 700 : 400,
            color: value === tab.id ? 'primary.contrastText' : 'text.secondary',
          }}
        >
          {tab.label}
        </Button>
      ))}
    </Paper>
  );
}

export default SortTabs;
