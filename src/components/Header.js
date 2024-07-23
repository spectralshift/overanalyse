// Header.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Header = () => {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#4a90e2' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img src="/path-to-your-logo.png" alt="Site Logo" style={{ height: '40px', marginRight: '16px' }} />
          <Typography variant="h6" noWrap component="div" sx={{ fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', fontWeight: 500 }}>
            OverAnalyse
          </Typography>
        </Box>
        <Box>
          <Button color="inherit" component={RouterLink} to="/">
            Home
          </Button>
          <Button color="inherit" component={RouterLink} to="/about">
            About
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;