import './App.css'
import { ThemeProvider, useTheme } from '@mui/material';
import AppRoutes from './AppRoutes';
import { Suspense, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { ApiService } from './services/api-service';

const App: React.FC = () => {
  const theme = useTheme();

  const auth = useAuth0();

  useEffect(() => {
    ApiService.setAccessToken(() =>
      auth.getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        },
      })
    );
  }, [auth.getAccessTokenSilently]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeProvider theme={theme}>
        <AppRoutes />
      </ThemeProvider>
    </Suspense>
  );
}

export default App;
