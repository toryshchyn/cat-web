import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Container, Tooltip, ClickAwayListener, useMediaQuery, useTheme } from '@mui/material';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import ApiIcon from '@mui/icons-material/Api';
import AddIcon from '@mui/icons-material/Add';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Outlet, Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const MasterLayout: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [emailTooltipOpen, setEmailTooltipOpen] = useState(false);
    const { user, isAuthenticated, isLoading, loginWithPopup, logout } = useAuth0();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static">
                <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: 48, sm: 64 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Inventory2Icon sx={{ mr: isMobile ? 0 : 1 }} />
                        {!isMobile && (
                            <Typography variant="h6" component="div">
                                Inventory catalogue
                            </Typography>
                        )}
                    </Box>
                    {isAuthenticated && !isLoading && (
                        <Box display="flex" alignItems="center">
                            <ClickAwayListener onClickAway={() => setEmailTooltipOpen(false)}>
                                <Tooltip
                                    title={user?.email ?? 'No email'}
                                    open={emailTooltipOpen}
                                    disableFocusListener
                                    disableHoverListener
                                    disableTouchListener
                                >
                                    <IconButton
                                        color="inherit"
                                        aria-label="show user email"
                                        onClick={() => setEmailTooltipOpen((prev) => !prev)}
                                        sx={{ mr: 1 }}
                                    >
                                        <AccountCircleIcon />
                                    </IconButton>
                                </Tooltip>
                            </ClickAwayListener>
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
                                onClick={() => loginWithPopup()}
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
                            <Link to="/new-item" style={{ textDecoration: 'none', color: 'inherit', display: 'block', width: '100%' }}>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <AddIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="New Item" />
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

            <Container id="main-container" component="main" sx={{ flexGrow: 1, pt: 0.5, pb: 3 }}>
                <Outlet />
            </Container>
        </Box>
    );
};

export default MasterLayout;
