// src/components/Alert.js
import React from 'react';
import { Typography, Box } from '@mui/material';

const Alert = ({ title, description }) => {
  return (
    <Box sx={{ 
      mb: 4, 
      backgroundColor: '#fff3e0',  // Light yellow background
      padding: 0,
      borderRadius: 1
    }}>
      {title && (
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
      )}
      {description && (
        <Typography 
          variant="subtitle1" 
          sx={{ 
            mb: 3, 
            fontStyle: 'italic',
            color: 'text.secondary',
            borderLeft: '4px solid',
            borderColor: '#d32f2f',  // Red border
            pl: 2
          }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
};

export default Alert;