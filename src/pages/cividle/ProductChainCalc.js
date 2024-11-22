import React, { useState, useEffect, useMemo } from 'react';
import { TextField, Select, MenuItem, Grid, Typography, Paper, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, FormControlLabel, Button } from '@mui/material';
import { 
  buildGraph, 
  calculateUniqueResourceFlow, 
  processChainData, 
  calculateBuildings, 
  calculateAdjustedProduction, 
  calculateSubtotal, 
  calculateDividedSubtotal, 
  calculateEstimatedOutput 
} from './productChainUtils';
import buildingsData from '../../data/buildingData.json';
import ProductChainGraph from './ProductChainGraph';
import { Modal } from '@mui/material';
import PageHeader from '../../components/PageHeader';
import Alert from '../../components/Alert';

const PAGE_TITLE = "Production Chain Calculator and Display";
const PAGE_DESCRIPTION = "This page allows you to see the breakdown of the production chain required to generate a good. Select the building you want to build and its dependencies will be calculated. Click on the 'Show Visual Graph' to see a visualization of the chain."





const ProductChainCalc = () => {
	const [state, setState] = useState({
		selectedBuilding: '',
		chain: [],
		multipliers: {},
		globalBuff: 0,
		buildingCount: '',
		buildingLevel: '',
		specificBuildingLevels: {},
		totalBuildingLevels: null,  // Add this if you're using it
		});
	const [showAllItems, setShowAllItems] = useState(false);
	const [showGraph, setShowGraph] = useState(false);
	const [graph, setGraph] = useState(null);
	
	useEffect(() => 
	{
		setGraph(buildGraph(buildingsData));
	}, []);

useEffect(() => {
  if (state.selectedBuilding && graph) {
    const flow = calculateUniqueResourceFlow(
      graph, 
      state.selectedBuilding, 
      state.multipliers, 
      state.globalBuff,
      parseInt(state.buildingCount) || 1,
      parseInt(state.buildingLevel) || 1,
      state.specificBuildingLevels
    );
    const chainData = processChainData(flow, graph, state);
    setState(prevState => ({ ...prevState, chain: chainData }));
  }
}, [
  state.selectedBuilding, 
  state.multipliers, 
  graph, 
  state.globalBuff, 
  state.buildingCount, 
  state.buildingLevel, 
  state.specificBuildingLevels
]);


	const handleMultiplierChange = (buildingId, value) => {
	  
	  setState(prevState => ({
		...prevState,
		multipliers: {
		  ...prevState.multipliers,
		  [buildingId]: value
		}
	  }));
	};

  const sortedBuildings = useMemo(() => {
    return [...buildingsData]
      .filter(building => showAllItems || building.ev)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [showAllItems]);

  const handleSpecificBuildingLevelChange = (buildingId, value) => {
    setState(prevState => ({
      ...prevState,
      specificBuildingLevels: {
        ...prevState.specificBuildingLevels,
        [buildingId]: value === '' ? null : parseInt(value)
      }
    }));
  };

  const handleInputChange = (field, value) => {
    setState(prevState => ({ ...prevState, [field]: value }));
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
	  <Alert 
  title="Big Update!" 
  description="This page has been dramatically overhauled with new logic and improved visualizations. Bugs are likely. Collapsing buildings is currently not implemented, but will be soon." 
	/>
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Select
              value={state.selectedBuilding}
              onChange={(e) => handleInputChange('selectedBuilding', e.target.value)}
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
              value={state.buildingCount}
              onChange={(e) => handleInputChange('buildingCount', e.target.value)}
              fullWidth
              inputProps={{ min: "0", step: "1" }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Main Building Level"
              type="number"
              value={state.buildingLevel}
              onChange={(e) => handleInputChange('buildingLevel', e.target.value)}
              fullWidth
              inputProps={{ min: "0", step: "1" }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
  label="Global Buff"
  type="number"
  value={state.globalBuff}
  onChange={(e) => {
    const value = Math.min(99, Math.max(0, parseInt(e.target.value) || 0));
    handleInputChange('globalBuff', value);
  }}
  fullWidth
  inputProps={{ 
    min: "0", 
    max: "99",
    step: "1" 
  }}
/>
          </Grid>
        </Grid>
      </Box>
      
      {state.chain.length > 0 && (
        <>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => setShowGraph(true)}
            sx={{ mt: 2, mb: 2 }}
          >
            Show Visual Graph
          </Button>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Building</TableCell>
                  <TableCell>Input</TableCell>
                  <TableCell>Output</TableCell>
                  <TableCell>Building Specific Multiplier</TableCell>
                  <TableCell>Specific Building Level</TableCell>
                  <TableCell>Total Building Levels</TableCell>
                  <TableCell>Estimated Buildings</TableCell>
                
                </TableRow>
              </TableHead>
              <TableBody>
                {state.chain.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell style={{ whiteSpace: 'pre-line' }}>{row.input.map(i => `${i.resource}: ${i.amount.toFixed(0)}`).join('\n')}</TableCell>
                    <TableCell style={{ whiteSpace: 'pre-line' }}>{row.output.map(o => `${o.resource}: ${o.amount.toFixed(0)}`).join('\n')}</TableCell>
					<TableCell>
					  <TextField
						type="number"
						value={state.multipliers[row.buildingId] ?? 1}  // Using nullish coalescing
						onChange={(e) => {
						  const value = Math.min(99, Math.max(1, parseFloat(e.target.value) || 1));
						  handleMultiplierChange(row.buildingId, value);
						}}
						inputProps={{ 
						  min: "1", 
						  max: "99",
						  step: "1", 
						  style: { width: '80px' } 
						}}
					  />
					</TableCell>
					<TableCell>
					  <TextField
						type="number"
						value={state.specificBuildingLevels[row.id] || ''}
						onChange={(e) => {
						  const value = e.target.value === '' ? '' : 
							Math.min(99, Math.max(1, parseInt(e.target.value) || 1));
						  handleSpecificBuildingLevelChange(row.id, value);
						}}
						inputProps={{ 
						  min: "1", 
						  max: "99",
						  step: "1", 
						  style: { width: '80px' } 
						}}
					  />
					</TableCell>
                    <TableCell>{row.requiredLevels.toFixed(0)}</TableCell>
                    <TableCell>{row.estimatedBuildings}</TableCell>            
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1">
              {state.selectedBuilding && `${buildingsData.find(b => b.id === state.selectedBuilding)?.name} Estimated Output: ${calculateEstimatedOutput(state.chain.find(node => node.id === state.selectedBuilding), state)}`}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="subtitle1">
                Total Building Levels (Est): {calculateSubtotal(state.chain, state)}
              </Typography>
              <Typography variant="subtitle1">
                Total Buildings (Est): {calculateDividedSubtotal(state.chain, state)}
              </Typography>
            </Box>
          </Box>
        </>
      )}

     <Modal
  open={showGraph}
  onClose={() => setShowGraph(false)}
  aria-labelledby="product-chain-graph-modal"
  aria-describedby="product-chain-graph-description"
>
  <Box sx={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    height: '90%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  }}>
<ProductChainGraph 
  chain={state.chain}
  onClose={() => setShowGraph(false)}
  globalBuff={state.globalBuff}
  multipliers={state.multipliers}
  selectedBuilding={state.selectedBuilding}
  buildingCount={parseInt(state.buildingCount) || 1}
  buildingLevel={parseInt(state.buildingLevel) || 1}
  specificBuildingLevels={state.specificBuildingLevels}
/>
  </Box>
</Modal>
    </Paper>
  );
};

export default ProductChainCalc;