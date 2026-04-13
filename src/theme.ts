import { alpha, createTheme } from '@mui/material/styles';

const ink = '#0b0e14';
const surface = '#121722';
const elevated = '#1a2130';
const accent = '#5eead4';
const accentMuted = '#2dd4bf';

export const appTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: accent,
      light: '#99f6e4',
      dark: accentMuted,
      contrastText: ink,
    },
    secondary: {
      main: '#a5b4fc',
      light: '#c7d2fe',
      dark: '#818cf8',
    },
    error: {
      main: '#f87171',
    },
    warning: {
      main: '#fbbf24',
    },
    info: {
      main: '#38bdf8',
    },
    success: {
      main: '#4ade80',
    },
    background: {
      default: ink,
      paper: surface,
    },
    text: {
      primary: '#e8ecf4',
      secondary: alpha('#e8ecf4', 0.68),
      disabled: alpha('#e8ecf4', 0.38),
    },
    divider: alpha('#94a3b8', 0.14),
    action: {
      active: alpha('#e8ecf4', 0.9),
      hover: alpha('#94a3b8', 0.08),
      selected: alpha(accent, 0.14),
      disabled: alpha('#e8ecf4', 0.28),
      disabledBackground: alpha('#64748b', 0.12),
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: `${alpha('#94a3b8', 0.35)} ${elevated}`,
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        color: 'default',
      },
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: alpha(theme.palette.background.paper, 0.72),
          backdropFilter: 'saturate(160%) blur(14px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
        }),
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: elevated,
          borderLeft: `1px solid ${theme.palette.divider}`,
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: elevated,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: `0 8px 28px ${alpha('#000', 0.45)}`,
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          fontWeight: 600,
          '&:hover': {
            boxShadow: `0 0 24px ${alpha(accent, 0.35)}`,
          },
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: 'hover',
      },
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
});
