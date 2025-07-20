// src/components/AdminLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { 
  AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, 
  ListItemButton, ListItemIcon, ListItemText, Box, Avatar, Menu, MenuItem,
  Divider
} from '@mui/material';
import { 
  Dashboard as DashboardIcon, 
  People as PeopleIcon,
  Movie as MovieIcon,
  Theaters as TheatersIcon,
  EventSeat as EventSeatIcon,
  Schedule as ScheduleIcon,
  RateReview as RateReviewIcon,
  Article as ArticleIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon
} from '@mui/icons-material';

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { text: 'Utilisateurs', icon: <PeopleIcon />, path: '/admin/users' },
    { text: 'Films', icon: <MovieIcon />, path: '/admin/films' },
    { text: 'Cinémas', icon: <TheatersIcon />, path: '/admin/cinemas' },
    { text: 'Séances', icon: <ScheduleIcon />, path: '/admin/sessions' },
    { text: 'Tickets', icon: <EventSeatIcon />, path: '/admin/tickets' },
    { text: 'Articles', icon: <ArticleIcon />, path: '/admin/articles' },
    { text: 'Notes', icon: <RateReviewIcon />, path: '/admin/ratings' },
  ];

  const drawer = (
    <div>
      <Toolbar sx={{ justifyContent: 'center', py: 3 }}>
        <Typography variant="h5" fontWeight="bold" color="primary">
          CineSphere Admin
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ overflowY: 'auto', maxHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ width: '100%' }}>
            <ListItemButton onClick={() => navigate(item.path)} sx={{ flexDirection: 'column', alignItems: 'center', py: 2 }}>
              <ListItemIcon sx={{ minWidth: 40, mb: 0.5 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} sx={{ textAlign: 'center', fontSize: '0.95rem' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - 240px)` },
          ml: { sm: `240px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Tableau de Bord Administrateur
          </Typography>
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32 }}>A</Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => navigate('/admin/profile')}>Mon profil</MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Déconnexion
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - 240px)` },
          mt: 8 
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;