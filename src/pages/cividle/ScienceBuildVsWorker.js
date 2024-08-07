import React, { useState, useEffect } from 'react';
import {
  TextField,
  Checkbox,
  Grid,
  Typography,
  Paper,
  Box,
  FormControlLabel,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ScienceBuildVsWorker = () => {
  const [idleScience, setIdleScience] = useState('');
  const [happinessBudget, setHappinessBudget] = useState('');
  const [schoolBonus, setSchoolBonus] = useState('');
  const [researchLabsBonus, setResearchLabsBonus] = useState('');
  const [computerLabsBonus, setComputerLabsBonus] = useState('');
  const [researchFundsBonus, setResearchFundsBonus] = useState('');
  const [pyramidOfGiza, setPyramidOfGiza] = useState(false);
  const [shendoahTower, setShendoahTower] = useState(false);
  const [cnTower, setCNTower] = useState(false);
  const [unitedNations, setUnitedNations] = useState(false);
  const [socialism, setSocialism] = useState(false);
  const [expansion, setExpansion] = useState(false);

  const [graphData, setGraphData] = useState({
    apartmentsVsSchools: [],
    condosVsResearchLabs: [],
    condosVsResearchFunds: [],
  });

  const [results, setResults] = useState({
    rSchools: 0,
    rLabs: 0,
    cLabs: 0,
    rFunds: 0,
    apartments: 0,
    condos: 0,
  });

  const calculateResults = (increment = 0) => {
    const wonderValues = {
      rSchools: {
        pyramidOfGiza: 0,
        shendoahTower: 2,
        cnTower: 0,
        unitedNations: 1,
        socialism: 0,
        expansion: 0,
      },
      rLabs: {
        pyramidOfGiza: 0,
        shendoahTower: 2,
        cnTower: 0,
        unitedNations: 1,
        socialism: 3,
        expansion: 0,
      },
      cLabs: {
        pyramidOfGiza: 0,
        shendoahTower: 2,
        cnTower: 4,
        unitedNations: 1,
        socialism: 0,
        expansion: 0,
      },
      rFunds: {
        pyramidOfGiza: 0,
        shendoahTower: 2,
        cnTower: 4,
        unitedNations: 1,
        socialism: 0,
        expansion: 0,
      },
      apartments: {
        pyramidOfGiza: 1,
        shendoahTower: 2,
        cnTower: 0,
        unitedNations: 0,
        socialism: 0,
        expansion: 1,
      },
      condos: {
        pyramidOfGiza: 1,
        shendoahTower: 2,
        cnTower: 4,
        unitedNations: 1,
        socialism: 0,
        expansion: 0,
      },
    };

    const calculateWonderBonus = (type) => {
      return (pyramidOfGiza ? wonderValues[type].pyramidOfGiza : 0) +
             (shendoahTower ? wonderValues[type].shendoahTower : 0) +
             (cnTower ? wonderValues[type].cnTower : 0) +
             (unitedNations ? wonderValues[type].unitedNations : 0) +
             (socialism ? wonderValues[type].socialism : 0) +
             (expansion ? wonderValues[type].expansion : 0);
    };
    const happinessBudgetValue = parseFloat(happinessBudget) || 100;
    const happiness = Math.max(-50, Math.min(50, happinessBudgetValue - increment));
    const happinessMultiplier = 1 + (0.02 * happiness);
	
    return {
      rSchools: (parseFloat(schoolBonus) + 3 + calculateWonderBonus('rSchools')) * 400 * increment,
      rLabs: (parseFloat(researchLabsBonus) + 2 + calculateWonderBonus('rLabs')) * 5000 * increment,
      cLabs: (parseFloat(computerLabsBonus) + 1 + calculateWonderBonus('cLabs')) * 79930 * increment,
      rFunds: (parseFloat(researchFundsBonus) + 2 + calculateWonderBonus('rFunds')) * 25940 * increment,
      apartments: ( 1 + calculateWonderBonus('apartments')) * 84 * parseFloat(idleScience) * happinessMultiplier * increment,
      condos: ( 1 + calculateWonderBonus('condos')) * 510 * parseFloat(idleScience) * happinessMultiplier * increment,
    };
  };

  useEffect(() => {
   setResults(calculateResults(1)); // Set initial results for 1 building

    const happinessBudgetValue = parseFloat(happinessBudget) || 100;
    const maxBuildings = happinessBudgetValue + 50;
    const newGraphData = {
      apartmentsVsSchools: [],
      condosVsResearchLabs: [],
      condosVsComputerLabs: [],
	  condosVsResearchFunds: [],
    };

for (let i = 0; i <= maxBuildings; i++) {
      const results = calculateResults(i);

      newGraphData.apartmentsVsSchools.push({
        buildings: i,
        apartments: results.apartments,
        schools: results.rSchools,
      });

      newGraphData.condosVsResearchLabs.push({
        buildings: i,
        condos: results.condos,
        researchLabs: results.rLabs,
      });
	  
	  newGraphData.condosVsComputerLabs.push({
        buildings: i,
        condos: results.condos,
        computerLabs: results.cLabs,
      });
	  

      newGraphData.condosVsResearchFunds.push({
        buildings: i,
        condos: results.condos,
        researchFunds: results.rFunds,
      });
    }

    setGraphData(newGraphData);
  }, [idleScience, happinessBudget, schoolBonus, researchLabsBonus, computerLabsBonus, researchFundsBonus, pyramidOfGiza, shendoahTower, cnTower, unitedNations, socialism, expansion]);

  const renderGraph = (data, title, line1Name, line2Name) => (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 15 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="buildings" 
            label={{ value: 'Building Count', position: 'insideBottom', offset: -5 }} 
			interval = {24}
          />
          <YAxis label={{ value: 'Total Science', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend verticalAlign="top" height={36}/>
          <Line type="monotone" dataKey={line1Name} stroke="#8884d8" dot={false}/>
          <Line type="monotone" dataKey={line2Name} stroke="#82ca9d" dot={false}/>
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>Science Build vs Worker Calculator</Typography>
      <Box sx={{ mb: 3, bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={6}>
                <Typography variant="subtitle1" fontWeight="medium">Idle Science / sec</Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type="number"
                  value={idleScience}
                  onChange={(e) => setIdleScience(e.target.value)}
                  variant="outlined"
                  size="small"
                  fullWidth
                  inputProps={{ step: 0.1, min: 0, max: 9999.9 }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={6}>
                <Typography variant="subtitle1" fontWeight="medium">Happiness Budget</Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type="number"
                  value={happinessBudget}
                  onChange={(e) => setHappinessBudget(e.target.value)}
                  variant="outlined"
                  size="small"
                  fullWidth
                  inputProps={{ step: 1, min: 0, max: 999 }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={6}>
                <Typography variant="subtitle1" fontWeight="medium">School Bonus</Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type="number"
                  value={schoolBonus}
                  onChange={(e) => setSchoolBonus(e.target.value)}
                  variant="outlined"
                  size="small"
                  fullWidth
                  inputProps={{ step: 0.1, min: 0, max: 99.9 }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={6}>
                <Typography variant="subtitle1" fontWeight="medium">Research Labs Bonus</Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type="number"
                  value={researchLabsBonus}
                  onChange={(e) => setResearchLabsBonus(e.target.value)}
                  variant="outlined"
                  size="small"
                  fullWidth
                  inputProps={{ step: 0.1, min: 0, max: 99.9 }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={6}>
                <Typography variant="subtitle1" fontWeight="medium">Computer Labs Bonus</Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type="number"
                  value={computerLabsBonus}
                  onChange={(e) => setComputerLabsBonus(e.target.value)}
                  variant="outlined"
                  size="small"
                  fullWidth
                  inputProps={{ step: 0.1, min: 0, max: 99.9 }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={6}>
                <Typography variant="subtitle1" fontWeight="medium">Research Funds Bonus</Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type="number"
                  value={researchFundsBonus}
                  onChange={(e) => setResearchFundsBonus(e.target.value)}
                  variant="outlined"
                  size="small"
                  fullWidth
                  inputProps={{ step: 0.1, min: 0, max: 99.9 }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>Wonders and Policies</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControlLabel
                control={<Checkbox checked={pyramidOfGiza} onChange={(e) => setPyramidOfGiza(e.target.checked)} />}
                label="Pyramid of Giza"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={<Checkbox checked={shendoahTower} onChange={(e) => setShendoahTower(e.target.checked)} />}
                label="Shendoah/Tower of Babel"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={<Checkbox checked={cnTower} onChange={(e) => setCNTower(e.target.checked)} />}
                label="CN Tower"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={<Checkbox checked={unitedNations} onChange={(e) => setUnitedNations(e.target.checked)} />}
                label="United Nations"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={<Checkbox checked={socialism} onChange={(e) => setSocialism(e.target.checked)} />}
                label="Ideology: Socialism"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={<Checkbox checked={expansion} onChange={(e) => setExpansion(e.target.checked)} />}
                label="Tradition: Expansion"
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>Calculation Results (for 1 building)</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography>Schools: {results.rSchools.toFixed(0)}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Research Labs: {results.rLabs.toFixed(0)}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Computer Labs: {results.cLabs.toFixed(0)}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Research Funds: {results.rFunds.toFixed(0)}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Apartments: {results.apartments.toFixed(0)}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Condos: {results.condos.toFixed(0)}</Typography>
          </Grid>
        </Grid>
      </Box>
      {renderGraph(graphData.apartmentsVsSchools, "Apartments vs Schools", "apartments", "schools")}
      {renderGraph(graphData.condosVsResearchLabs, "Condos vs Research Labs", "condos", "researchLabs")}
	  {renderGraph(graphData.condosVsComputerLabs, "Condos vs Computer Labs", "condos", "computerLabs")}
      {renderGraph(graphData.condosVsResearchFunds, "Condos vs Research Funds", "condos", "researchFunds")}
	  
    </Paper>
  );
};

export default ScienceBuildVsWorker;