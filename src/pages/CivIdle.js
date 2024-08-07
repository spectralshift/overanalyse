import React from 'react';
import { Grid, Box } from '@mui/material';
import Tile from './Tile';


const CivIdle = () => {
const civIdleTiles = [
    { 
      title: 'Science Calculator', 
      description: "Quickly calculate how long it will take to generate (x) science at a certain rate. Useful for knowing how long to idle for!",
      imageSrc: '/images/cividle/sci-calc.png',
	  route: 'science'
    },
	{ 
      title: 'GP Efficiency Calculator', 
      description: "Find out when is the best time to rebirth during your Empire Value run!",
      imageSrc: '/images/cividle/gp-eff.png',
	  route: 'gp-efficient'
    },
		{ 
      title: 'Idle Era Time', 
      description: "Want to do a lot of short runs? This tells you the time it takes to get to each era while afk!",
      imageSrc: '/images/cividle/idle-era.png',
	  route: 'eratime'
    },
		{ 
      title: 'Goods: Empire Values', 
      description: "A list of the EV of every item in the game.",
      imageSrc: '/images/cividle/ev-value.png',
	  route: 'ev'
    },
		{ 
      title: 'Product Chain Calculator', 
      description: "Figuring out how many buildings and products you need is hard! Here is a calculator that should help calculate it!",
      imageSrc: '/images/cividle/prodcalc.png',
	  route: 'chaincalc'
    },
		{ 
      title: 'Workers vs Science', 
      description: "Should I go for science buildings or should I go for workers to get science? Covers Aparments and Condos vs Schools, Research Labs, and Computer Labs.",
      imageSrc: '/images/cividle/sci-worker.png',
	  route: '/cividle/scivsworker'
    },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {civIdleTiles.map((tile, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Tile {...tile} />
          </Grid>
        ))}
      </Grid>

      
    </Box>
  );
};

export default CivIdle;