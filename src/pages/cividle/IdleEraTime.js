import React, { useState, useEffect } from 'react';
import { TextField, Typography, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid } from '@mui/material';
import { getEraData } from '../../utils/cividlehelpers';
import PageHeader from '../../components/PageHeader';
import TooltipTextField from '../../components/TooltipTextField';

const PAGE_TITLE = "Idle to Era Calculator";
const PAGE_DESCRIPTION = "This calculates the amount of time it takes to get to each Era based on your starting science."




const IdleEraTime = () => {
  const [sciencePerSec, setSciencePerSec] = useState('');
  const [eraData, setEraData] = useState([]);

  useEffect(() => {
    if (sciencePerSec && !isNaN(parseFloat(sciencePerSec))) {
      const data = getEraData(parseFloat(sciencePerSec));
      setEraData(data);
    } else {
      setEraData([]);
    }
  }, [sciencePerSec]);

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
      <Box sx={{ mb: 3, bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
          <Grid item xs={12} sm={8}>
            <TooltipTextField
			tooltip="Enter the amount of science you have on rebirth."
          label="Science/sec"
          type="number"
          value={sciencePerSec}
          onChange={(e) => setSciencePerSec(e.target.value)}
          variant="outlined"
          fullWidth
          inputProps={{ step: 'any' }}
            />
          </Grid>
      </Box>
      {eraData.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Era</TableCell>
                <TableCell>Era Title</TableCell>
                <TableCell>Era Cost</TableCell>
                <TableCell>Time to Reach</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {eraData.map((row) => (
                <TableRow key={row.Era}>
                  <TableCell>{row.Era}</TableCell>
                  <TableCell>{row.EraTitle}</TableCell>
                  <TableCell>{row.EraCost}</TableCell>
                  <TableCell>{row.TimeToReach}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default IdleEraTime;