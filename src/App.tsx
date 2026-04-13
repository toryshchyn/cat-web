import './App.css'
import { CssBaseline, ThemeProvider } from '@mui/material';
import AppRoutes from './AppRoutes';
import { Suspense, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { ApiService } from './services/api-service';
import { appTheme } from './theme';

const App: React.FC = () => {
  const auth = useAuth0();

  useEffect(() => {
    ApiService.setAccessToken(() =>
      auth.getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        },
      })
    );
  }, []);

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Suspense
        fallback={
          <div style={{ padding: 24, color: appTheme.palette.text.secondary }}>
            Loading…
          </div>
        }
      >
        <AppRoutes />
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
