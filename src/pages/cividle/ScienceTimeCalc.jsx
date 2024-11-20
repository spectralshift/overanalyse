import React, { useState } from 'react';
import { TextField, Select, MenuItem, Grid, Typography, Paper, Box } from '@mui/material';
import { calculateScienceTime } from '../../utils/cividlehelpers';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PageHeader from '../../components/PageHeader';

const PAGE_TITLE = "Science Time Calculator";
const PAGE_DESCRIPTION = "This calculator tells you how long it will take to get to the required science."



const ScienceTimeCalc = () => {
  const [values, setValues] = useState(['', '', '']);
  const [units, setUnits] = useState(['K', 'K', 'K']);
  const [result, setResult] = useState(null);

  const labels = ["Science/sec", "Science Saved", "Science Needed"];

  const handleValueChange = (index, newValue) => {
    const newValues = [...values];
    newValues[index] = newValue;
    setValues(newValues);
    updateResult(newValues, units);
  };

  const handleUnitChange = (index, newUnit) => {
    const newUnits = [...units];
    newUnits[index] = newUnit;
    setUnits(newUnits);
    updateResult(values, newUnits);
  };

  const updateResult = (newValues, newUnits) => {
    const calculatedResult = calculateScienceTime(newValues, newUnits);
    setResult(calculatedResult);
  };
  
  const handleKeyPress = (event, index) => {
	  const key = event.key.toUpperCase();
	  const validKeys = ['K', 'M', 'B', 'T', 'Q'];
	  
	  if (validKeys.includes(key)) {
		handleUnitChange(index, key);
		event.preventDefault();
	  }
	};

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
      <Box sx={{ mb: 3, bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
        {[0, 1, 2].map((index) => (
          <Grid container spacing={2} key={index} alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle1" fontWeight="medium">{labels[index]}</Typography>
            </Grid>
            <Grid item xs={8} sm={5}>
              <TextField
                type="number"
                value={values[index]}
                onChange={(e) => handleValueChange(index, e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
                inputProps={{ step: 'any' }}
              />
            </Grid>
            <Grid item xs={4} sm={3}>
              <Select
				  value={units[index]}
				  onChange={(e) => handleUnitChange(index, e.target.value)}
				  onKeyPress={(e) => handleKeyPress(e, index)}
				  variant="outlined"
				  size="small"
				  fullWidth
				>
                {['K', 'M', 'B', 'T', 'Q'].map((unit) => (
                  <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        ))}
      </Box>
      <Box sx={{ bgcolor: 'primary.light', p: 2, borderRadius: 1, color: 'primary.contrastText' }}>
        {result && !result.error ? (
          <>
            <Typography variant="h6" gutterBottom>Results</Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <AccessTimeIcon />
              </Grid>
              <Grid item xs>
                <Typography>
                  It will take <Box component="span" sx={{ color: '#FF4136', fontWeight: 'bold' }}>{result.ticks}</Box> ticks
                </Typography>
                <Typography variant="body2">
                  Time: {result.timespan}
                </Typography>
              </Grid>
            </Grid>
          </>
        ) : (
          <Typography color="error">
            {result?.error || 'Enter values to calculate'}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default ScienceTimeCalc;