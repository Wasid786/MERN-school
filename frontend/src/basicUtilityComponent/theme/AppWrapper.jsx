import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function AppWrapper({ children }) {
  const { dark } = useContext(AuthContext);

  const theme = createTheme({
    palette: {
      mode: dark ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
