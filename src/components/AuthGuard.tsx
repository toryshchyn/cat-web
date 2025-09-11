import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { CircularProgress, Box } from '@mui/material';
import Login from './Login';

interface AuthGuardProps {
    component: React.ReactElement;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
    component
}) => {
    const { isAuthenticated, isLoading, error } = useAuth0();

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!isAuthenticated) {
        console.log('User is not authenticated, redirecting to login');
        return <Login />;
    }

    if (error) {
        return <div>Oops... {error.message}</div>;
    }   

    return <>{component}</>;
};

export default AuthGuard;