// components/Sidebar.js
import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import { useSidebar } from '../hooks/useSidebar';

const Sidebar = () => {
  const { items, currentPath } = useSidebar();

  return (
    <Box sx={{ 
      width: 220, 
      backgroundColor: '#f5f5f5', 
      height: '100%',
      boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
      overflowY: 'auto',
    }}>
      {items.map((group, groupIndex) => (
        <React.Fragment key={group.header}>
          {groupIndex > 0 && <Divider sx={{ my: 1 }} />}
          <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: '#757575', fontSize: '0.75rem' }}>
            {group.header}
          </Typography>
          <List dense>
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <ListItem 
                  button 
                  key={item.text} 
                  component={Link} 
                  to={item.path}
                  sx={{
                    py: 0.5,
                    '&:hover': {
                      backgroundColor: '#e0e0e0',
                    },
                    '&.Mui-selected': {
                      backgroundColor: '#3f51b5',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#303f9f',
                      },
                    },
                  }}
                  selected={currentPath === item.path}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Icon fontSize="small" color={currentPath === item.path ? 'inherit' : 'primary'} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ fontSize: '0.875rem' }}
                  />
                </ListItem>
              );
            })}
          </List>
        </React.Fragment>
      ))}
    </Box>
  );
};

export default Sidebar;