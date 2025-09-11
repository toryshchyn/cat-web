import React, { useState } from 'react';
import { 
    AppBar, 
    Toolbar, 
    IconButton, 
    Typography, 
    Drawer, 
    List, 
    ListItem,
    ListItemButton,
    ListItemIcon, 
    ListItemText, 
    Box, 
    Container
} from '@mui/material';

import Inventory2Icon from '@mui/icons-material/Inventory2';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import ApiIcon from '@mui/icons-material/Api';

import { Outlet, Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const MasterLayout: React.FC = () => {
const [drawerOpen, setDrawerOpen] = useState(false);
const { user, isAuthenticated, isLoading, loginWithPopup, logout } = useAuth0();

const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
};

return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static">
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Inventory2Icon sx={{ mr: 1 }} />
                    <Typography variant="h6" component="div">
                        Inventory catalogue
                    </Typography>
                </Box>
                {isAuthenticated && !isLoading && (
                    <Box display="flex" alignItems="center">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body1" sx={{ mr: 2 }}>
                                {user?.name}
                            </Typography>
                        </Box>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="end"
                            onClick={toggleDrawer}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Box>
                )}
                {!isAuthenticated && !isLoading && (
                    <Box display="flex" alignItems="center">
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="end"
                            size="small"
                            onClick={()=> loginWithPopup()}
                        >
                            Login
                        </IconButton>
                    </Box>
                )}
            </Toolbar>
        </AppBar>

        <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={toggleDrawer}
        >
            <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={toggleDrawer}
            >
                <List>
                    <ListItem>
                        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'block', width: '100%' }}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <HomeIcon />
                                </ListItemIcon>
                                <ListItemText primary="Home" />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem>
                        <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit', display: 'block', width: '100%' }}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <Inventory2Icon />
                                </ListItemIcon>
                                <ListItemText primary="Inventory" />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem>
                        <Link to="/api-tests" style={{ textDecoration: 'none', color: 'inherit', display: 'block', width: '100%' }}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <ApiIcon />
                                </ListItemIcon>
                                <ListItemText primary="API tests" />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem>
                        <ListItemButton onClick={() => {
                            logout({ logoutParams: { returnTo: window.location.origin } });
                        }}>
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Drawer>

        <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
            <Outlet />
        </Container>
    </Box>
);
};

export default MasterLayout;