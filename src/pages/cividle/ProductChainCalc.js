import React, { useState, useEffect, useMemo } from 'react';
import { TextField, Select, MenuItem, Grid, Typography, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, FormControlLabel } from '@mui/material';
import { buildGraph, calculateResourceFlow, processChainData } from '../../utils/cividlehelpers';
import buildingsData from '../../data/buildingData.json';

const ProductChainCalc = () => {
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [chain, setChain] = useState([]);
  const [multipliers, setMultipliers] = useState({});
  const [graph, setGraph] = useState(null);
  const [showAllItems, setShowAllItems] = useState(false);
  const [globalBuff, setGlobalBuff] = useState(0);
  const [buildingCount, setBuildingCount] = useState('');
  const [buildingLevel, setBuildingLevel] = useState('');
  const [totalBuildingLevels, setTotalBuildingLevels] = useState('');
  const [specificBuildingLevels, setSpecificBuildingLevels] = useState({});

  useEffect(() => {
    setGraph(buildGraph(buildingsData));
  }, []);

  const calculateChain = () => {
    const flow = calculateResourceFlow(graph, selectedBuilding, multipliers, globalBuff);
    const chainData = processChainData(flow, graph);
    setChain(chainData);
  };

  useEffect(() => {
    if (selectedBuilding && graph) {
      calculateChain();
    }
  }, [selectedBuilding, multipliers, graph, globalBuff, buildingCount, buildingLevel, totalBuildingLevels]);

  const handleMultiplierChange = (buildingId, value) => {
    setMultipliers(prev => ({
      ...prev,
      [buildingId]: parseFloat(value) || 1
    }));
  };

  const sortedBuildings = useMemo(() => {
    return [...buildingsData]
      .filter(building => showAllItems || building.ev)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [showAllItems]);

  const getBuildingLevels = () => {
    if (totalBuildingLevels) return parseInt(totalBuildingLevels);
    if (buildingCount && buildingLevel) return parseInt(buildingCount) * parseInt(buildingLevel);
    return 1;
  };

  const formatRatio = (ratio) => {
    return ratio.toFixed(3).replace(/\.?0+$/, '');
  };

  const calculateSubtotal = () => {
    return Math.ceil(chain.reduce((sum, row) => sum + row.ratio * getBuildingLevels(), 0));
  };

  const calculateDividedSubtotal = () => {
    const subtotal = calculateSubtotal();
    const divisor = buildingLevel ? parseInt(buildingLevel) : 20;
    return Math.ceil(subtotal / divisor);
  };

  const calculateEstimatedOutput = () => {
    if (!selectedBuilding || chain.length === 0) return null;
    
    const selectedBuildingData = chain.find(item => item.id === selectedBuilding);
    if (!selectedBuildingData) return null;

    const buildingLevels = Math.ceil(selectedBuildingData.ratio * getBuildingLevels());
    const buildingMultiplier = multipliers[selectedBuilding] || 1;
    
    return Math.ceil((buildingMultiplier + globalBuff) * buildingLevels);
  };

const handleSpecificBuildingLevelChange = (buildingId, value) => {
    setSpecificBuildingLevels(prev => ({
      ...prev,
      [buildingId]: value === '' ? null : parseInt(value)
    }));
  };

  const getBuildingLevelForCalculation = (buildingId) => {
    if (specificBuildingLevels[buildingId]) return specificBuildingLevels[buildingId];
    if (buildingLevel) return parseInt(buildingLevel);
    return 1;
  };

  const calculateBuildings = (ratio, buildingId) => {
    const levels = Math.ceil(ratio * getBuildingLevels());
    const buildingLevel = getBuildingLevelForCalculation(buildingId);
    return Math.ceil(levels / buildingLevel);
  };


  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>Product Chain Calculator</Typography>
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Select
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value)}
              fullWidth
            >
              <MenuItem value="">
                <em>Select a building</em>
              </MenuItem>
              {sortedBuildings.map(building => (
                <MenuItem key={building.id} value={building.id}>{building.name}</MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showAllItems}
                  onChange={(e) => setShowAllItems(e.target.checked)}
                />
              }
              label="Show All Items"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Main Building Count"
              type="number"
              value={buildingCount}
              onChange={(e) => setBuildingCount(e.target.value)}
              fullWidth
              inputProps={{ min: "0", step: "1" }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Main Building Level"
              type="number"
              value={buildingLevel}
              onChange={(e) => setBuildingLevel(e.target.value)}
              fullWidth
              inputProps={{ min: "0", step: "1" }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="(Override) Total Building Levels"
              type="number"
              value={totalBuildingLevels}
              onChange={(e) => setTotalBuildingLevels(e.target.value)}
              fullWidth
              inputProps={{ min: "0", step: "1" }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Global Buff"
              type="number"
              value={globalBuff}
              onChange={(e) => setGlobalBuff(parseInt(e.target.value) || 0)}
              fullWidth
              inputProps={{ min: "0", step: "1" }}
            />
          </Grid>
        </Grid>
      </Box>
      
      {chain.length > 0 && (
        <>
                  <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Building</TableCell>
                  <TableCell>Input</TableCell>
                  <TableCell>Output</TableCell>
                  <TableCell>Building Specific Multiplier</TableCell>
                  <TableCell>Specific Building Level</TableCell>
                  <TableCell>Buildings</TableCell>
                  <TableCell>Building Levels</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {chain.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell style={{ whiteSpace: 'pre-line' }}>{row.input}</TableCell>
                    <TableCell style={{ whiteSpace: 'pre-line' }}>{row.output}</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={multipliers[row.id] || 1}
                        onChange={(e) => handleMultiplierChange(row.id, e.target.value)}
                        inputProps={{ min: "1", step: "0.1", style: { width: '80px' } }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={specificBuildingLevels[row.id] || ''}
                        onChange={(e) => handleSpecificBuildingLevelChange(row.id, e.target.value)}
                        inputProps={{ min: "1", step: "1", style: { width: '80px' } }}
                      />
                    </TableCell>
                    <TableCell>{calculateBuildings(row.ratio, row.id)}</TableCell>
                    <TableCell>{Math.ceil(row.ratio * getBuildingLevels())}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1">
              {selectedBuilding && `${buildingsData.find(b => b.id === selectedBuilding)?.name} Estimated Output: ${calculateEstimatedOutput()}`}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="subtitle1">
                Total Building Levels (Est): {calculateSubtotal()}
              </Typography>
              <Typography variant="subtitle1">
                Total Buildings (Est): {calculateDividedSubtotal()}
              </Typography>
            </Box>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default ProductChainCalc;