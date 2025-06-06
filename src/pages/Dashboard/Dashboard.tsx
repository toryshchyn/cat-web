import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

const Dashboard: React.FC = () => {
    const { user, logout } = useAuth0();

    return (
        <Box sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Dashboard
            </Typography>
            <Typography variant="h2" component="h2" gutterBottom>
                Welcome, {user?.name}
            </Typography>
            <Button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                Logout
            </Button>
        </Box>
    );
};

export default Dashboard;