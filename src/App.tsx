import './App.css'
import { ThemeProvider, useTheme } from '@mui/material';
import AppRoutes from './AppRoutes';
import { Suspense } from 'react';

const App:React.FC = () => {
  const theme = useTheme();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeProvider theme={theme}>
        <AppRoutes />
      </ThemeProvider>
    </Suspense>
  );
}

export default App;
