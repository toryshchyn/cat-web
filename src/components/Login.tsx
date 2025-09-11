import React from 'react';
import { Button, Container, Box } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

const Login: React.FC = () => {
    const { loginWithPopup } = useAuth0();

    const handleLogin = () => {
        loginWithPopup();
    };

    return (
        <Container maxWidth="sm">
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <Button 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    onClick={handleLogin}
                >
                    Log In
                </Button>
            </Box>
        </Container>
    );
};

export default Login;