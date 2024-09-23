import React, { useState } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Tile = ({ title, description, imageSrc, route = '' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    if (route) {
      navigate(route);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: '100%',
        height: '150px',
        display: 'flex',
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.2s ease-out',
        cursor: route ? 'pointer' : 'default',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Image Section */}
      <Box
        sx={{
          width: '33%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img 
          src={imageSrc} 
          alt={title}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
        />
      </Box>

      {/* Content Section */}
      <Box
        sx={{
          width: '67%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 2,
          position: 'relative',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            position: 'absolute',
            top: isHovered ? '2px' : '50%',
            transform: isHovered ? 'translateY(0)' : 'translateY(-50%)',
            transition: 'all 0.2s ease-out',
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            opacity: isHovered ? 1 : 0,
            visibility: isHovered ? 'visible' : 'hidden',
            transition: 'opacity 0.2s ease-out 0.1s',
            position: 'absolute',
            top: '40px',
          }}
        >
          {description}
        </Typography>
      </Box>
    </Paper>
  );
};

export default Tile;