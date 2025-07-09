import { createTheme } from '@mui/material/styles';
import { typography } from './typography';

export const theme = createTheme({
  typography,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: "'Inter', sans-serif",
        },
      },
    },
  },
}); 