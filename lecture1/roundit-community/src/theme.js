import { createTheme } from '@mui/material/styles';

/**
 * 앱 테마 생성 함수
 * @param {string} mode - 'light' | 'dark'
 */
export function createAppTheme(mode) {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#26A69A',
        light: '#80CBC4',
        dark: '#00796B',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#FF7043',
      },
      background: {
        default: mode === 'light' ? '#F5F7FA' : '#121212',
        paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
      },
    },
    shape: { borderRadius: 8 },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  });
}
