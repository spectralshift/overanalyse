// src/pages/cividle/IdleEraTime.js

import React, { useState, useEffect } from 'react';
import { TextField, Typography, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { getEraData } from '../../utils/cividlehelpers';

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
      <Typography variant="h4" gutterBottom>CivIdle Era Time Calculator</Typography>
      <Box sx={{ mb: 3, bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
        <TextField
          label="Science/sec"
          type="number"
          value={sciencePerSec}
          onChange={(e) => setSciencePerSec(e.target.value)}
          variant="outlined"
          fullWidth
          inputProps={{ step: 'any' }}
        />
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