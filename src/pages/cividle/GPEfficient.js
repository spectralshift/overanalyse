import React, { useState, useEffect, useCallback } from 'react';
import { Select, MenuItem, Grid, Typography, Paper, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculateGPEfficiency } from '../../utils/cividlehelpers';
import TooltipTextField from '../../components/TooltipTextField';
import PageHeader from '../../components/PageHeader';

const PAGE_TITLE = "GP Efficiency Calculator";
const PAGE_DESCRIPTION = "This calculator helps you determine the most efficient GP (Great People) target for your current setup. You are looking for the peak of the curve, which shows when you start to hit diminishing returns, or you can look at how long it will take to get to a certain number of GPs."


const GPEfficient = () => {
  const [currentGP, setCurrentGP] = useState('0');
  const [setupTime, setSetupTime] = useState('');
  const [evPerSecond, setEvPerSecond] = useState('');
  const [evUnit, setEvUnit] = useState('K');
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState('');

	const EfficiencyTooltip = ({ active, payload, label }) => {
	  if (active && payload && payload.length) {
		return (
		  <div style={{ backgroundColor: 'white', color: '#202020', padding: '10px', border: '1px solid #ccc' }}>
			<p>{`GP Count: ${label}`}</p>
			<p>{`Efficiency: ${payload[0].value.toFixed(2)} GP/Hour`}</p>
		  </div>
		);
	  }
	  return null;
	};

	const TimeTooltip = ({ active, payload, label }) => {
	  if (active && payload && payload.length) {
		return (
		  <div style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}>
			<p>{`GP Count: ${label}`}</p>
			<p>{`Time: ${payload[0].value.toFixed(2)} Hours`}</p>
		  </div>
		);
	  }
	  return null;
	};


  const updateChartData = useCallback(() => {
    if (setupTime && evPerSecond) {
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
      <PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />  
      <Box sx={{ mb: 3, bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1" fontWeight="medium">Setup Time (hours)</Typography>
          </Grid>
          <Grid item xs={12} sm={8}>
            <TooltipTextField
              tooltip="Enter the time spent setting up your production in hours. This can be found on your capital. Most accurate if the number is from right before the EV start up."
              type="number"
              value={setupTime}
              onChange={(e) => setSetupTime(e.target.value)}
              variant="outlined"
              size="small"
              fullWidth
              inputProps={{ step: 'any' }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1" fontWeight="medium">EV/second</Typography>
          </Grid>
          <Grid item xs={8} sm={5}>
            <TooltipTextField
              tooltip="Enter your current EV production per second. Can be found at the top info bar, right side."
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
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1" fontWeight="medium">Current GP Count</Typography>
          </Grid>
          <Grid item xs={12} sm={8}>
            <TooltipTextField
              tooltip="(Optional) Enter your current GP count. This will increase the accuracy if you are already in your EV run."
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
      </Box>

      {error && (
        <Box sx={{ mt: 2, color: 'error.main' }}>
          <Typography>{error}</Typography>
        </Box>
      )}

      {chartData && (
        <>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>Efficiency Chart</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.lineChart1Data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" type="number" label={{ value: 'GP Count', position: 'insideBottom', offset: -5 }} />
                <YAxis domain={['auto', 'auto']} label={{ value: 'GP/Hour', angle: -90, position: 'insideLeft' }} />
                <Tooltip content={<EfficiencyTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="y" name="Efficiency" stroke="#8884d8" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>Time to Reach GP Chart</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.lineChart2Data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" type="number" label={{ value: 'GP Count', position: 'insideBottom', offset: -5 }} />
                <YAxis domain={[0, 'auto']} label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                <Tooltip content={<TimeTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="y" name="Time" stroke="#82ca9d" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default GPEfficient;