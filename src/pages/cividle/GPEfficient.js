import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Select, MenuItem, Grid, Typography, Paper, Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { calculateGPEfficiency } from '../../utils/cividlehelpers';

const GPEfficient = () => {
  const [currentGP, setCurrentGP] = useState('');
  const [setupTime, setSetupTime] = useState('');
  const [evPerSecond, setEvPerSecond] = useState('');
  const [evUnit, setEvUnit] = useState('K');
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState('');

   const updateChartData = useCallback(() => {
    if (currentGP && setupTime && evPerSecond) {
      try {
        const result = calculateGPEfficiency(currentGP, setupTime, evPerSecond, evUnit);
        setChartData(result);
        setError('');
      } catch (err) {
        setError('Error in calculation. Please check your inputs.');
      }
    } else {
      setChartData(null);
      setError('');
    }
  }, [currentGP, setupTime, evPerSecond, evUnit]);

  useEffect(() => {
    updateChartData();
  }, [updateChartData]);

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>GP Efficiency Calculator</Typography>
      <Box sx={{ mb: 3, bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1" fontWeight="medium">Current GP Count</Typography>
          </Grid>
          <Grid item xs={12} sm={8}>
            <TextField
              type="number"
              value={currentGP}
              onChange={(e) => setCurrentGP(e.target.value)}
              variant="outlined"
              size="small"
              fullWidth
              inputProps={{ step: 'any' }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1" fontWeight="medium">Setup Time (hours)</Typography>
          </Grid>
          <Grid item xs={12} sm={8}>
            <TextField
              type="number"
              value={setupTime}
              onChange={(e) => setSetupTime(e.target.value)}
              variant="outlined"
              size="small"
              fullWidth
              inputProps={{ step: 'any' }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1" fontWeight="medium">EV/second</Typography>
          </Grid>
          <Grid item xs={8} sm={5}>
            <TextField
              type="number"
              value={evPerSecond}
              onChange={(e) => setEvPerSecond(e.target.value)}
              variant="outlined"
              size="small"
              fullWidth
              inputProps={{ step: 'any' }}
            />
          </Grid>
          <Grid item xs={4} sm={3}>
            <Select
              value={evUnit}
              onChange={(e) => setEvUnit(e.target.value)}
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
      </Box>
{error && (
        <Box sx={{ mt: 2, color: 'error.main' }}>
          <Typography>{error}</Typography>
        </Box>
      )}
	  
      {chartData && (
        <>
		          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Optimal GPs: <Box component="span" sx={{ color: '#FF4136', fontWeight: 'bold' }}>{chartData.integerValue}</Box> </Typography>
			
          </Box>
<Box sx={{ mt: 4 }}>
  <Typography variant="h6" gutterBottom>Efficiency Chart</Typography>
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={chartData.lineChart1Data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="x" type="number" label={{ value: 'GP Count', position: 'insideBottom', offset: -5 }} />
      <YAxis domain={['auto', 'auto']} label={{ value: 'GP/Hour', angle: -90, position: 'insideLeft' }} />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="y" name="Efficiency" stroke="#8884d8" dot={false} />
      <ReferenceLine x={chartData.integerValue} stroke="red" label="Peak"/>
    </LineChart>
  </ResponsiveContainer>
</Box>
          
<Box sx={{ mt: 4 }}>
  <Typography variant="h6" gutterBottom>Time to Reach GP Chart</Typography>
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={chartData.lineChart2Data}>
      <CartesianGrid 
        strokeDasharray="3 3" 
        yAxis={{ ticks: [0, 24, 48, 72, 96, 120, 144, 168, 336, 504, 672, 840, 1008, 1176, 1344] }}
      />
      <XAxis 
        dataKey="x" 
		type="number"
        label={{ value: 'GP Count', position: 'insideBottom', offset: -5 }}
      />
      <YAxis 
        domain={[0, 'auto']}
        label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}
        /*ticks={[0, 168, 336, 504, 672, 840, 1008, 1176, 1344]}
        tickFormatter={(value) => value.toString()}*/
        allowDataOverflow={true}
      />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="y" name="Time" stroke="#82ca9d" dot={false} />
    </LineChart>
  </ResponsiveContainer>
</Box>
		  
		  <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Output Details</Typography>
            <Typography variant="subtitle1">Input Values:</Typography>
            <Typography>
              Current GP: {chartData.inputValues.currentGP},
              Setup Time: {chartData.inputValues.setupTime},
              EV/Second: {chartData.inputValues.evPerSecond},
              EV Unit: {chartData.inputValues.evUnit}
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>x</TableCell>
                  <TableCell>EV/s (M)</TableCell>
                  <TableCell>Base Calc</TableCell>
                  <TableCell>Y1 (Efficiency)</TableCell>
                  <TableCell>Y2 (Time)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {chartData.debugData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.x}</TableCell>
                    <TableCell>{row.evPerSecondInMillions.toExponential(4)}</TableCell>
                    <TableCell>{row.baseCalculation.toFixed(4)}</TableCell>
                    <TableCell>{row.y1.toFixed(4)}</TableCell>
                    <TableCell>{row.y2.toFixed(4)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default GPEfficient;