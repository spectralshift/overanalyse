import React from 'react';
import { Grid, Box } from '@mui/material';
import Tile from './Tile';

const HomePage = () => {
const gameTiles = [
    { 
      title: 'CivIdle', 
      description: "The game made by FishPond.",
      imageSrc: '/images/cividle.webp',
	  route: '/cividle'
    }
  ];


  return (
    <Box sx={{ padding: 4 }}>
<Box
  component="img"
  src="/images/game_banner_001.png"
  alt="Header"
  sx={{
    width: '100%',
    height: 'auto',
    maxHeight: '64px',
    objectFit: 'contain',
    objectPosition: 'left',
    mb: 2,
  }}
/>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {gameTiles.map((tile, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Tile {...tile} />
          </Grid>
        ))}
      </Grid>




    </Box>
  );
};

export default HomePage;