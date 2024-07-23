import React from 'react';
import { Grid, Box } from '@mui/material';
import Tile from './Tile';

const HomePage = () => {
const gameTiles = [
    { 
      title: 'CivIdle', 
      description: "The game made by FishPond.",
      imageSrc: '/images/cividle.webp'
    },
    { 
      title: 'Terraforming Mars', 
      description: "The board game made by FryxGames",
      imageSrc: '/images/tfmars.png'
    },
  ];

  const financeTiles = [
    { 
      title: '???', 
      description: "TBA",
      imageSrc: '/images/sq1.png'
    },
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

      <Box
        component="img"
        src="/images/header-test.png"
        alt="Header"
        sx={{
          width: '100%',
          height: '50px',
          objectFit: 'cover',
          mb: 4,
        }}
      />

      <Grid container spacing={3}>
        {financeTiles.map((tile, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Tile {...tile} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HomePage;