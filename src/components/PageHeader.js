// src/components/PageHeader.js
import React from 'react';
import { Typography, Box } from '@mui/material';

const PageHeader = ({ title, description }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography 
          variant="subtitle1" 
          sx={{ 
            mb: 3, 
            fontStyle: 'italic',
            color: 'text.secondary',
            borderLeft: '4px solid',
            borderColor: 'primary.main',
            pl: 2
          }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
};

export default PageHeader;