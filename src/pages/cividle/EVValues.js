import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TableSortLabel,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  Popover,
  IconButton,
  InputAdornment
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { csv } from 'd3-fetch';
import PageHeader from '../../components/PageHeader';

const PAGE_TITLE = "Empire Value Table";
const PAGE_DESCRIPTION = "A simple sortable table showing the Value of all items in the game."

const EVValues = () => {
  const [data, setData] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('Resource');
  
  const [resourceFilter, setResourceFilter] = useState('');
  const [selectedTiers, setSelectedTiers] = useState(new Set());
  const [valueFilter, setValueFilter] = useState({ min: '', max: '' });
  const [uniqueTiers, setUniqueTiers] = useState([]);

  // Popover states
  const [anchorEls, setAnchorEls] = useState({
    tier: null,
    value: null
  });

  useEffect(() => {
    csv('/data/evValues.csv').then(data => {
      const parsedData = data.map(row => ({
        ...row,
        Value: parseInt(row.Value, 10)
      }));
      setData(parsedData);
      const tiers = [...new Set(parsedData.map(item => item.Tier))]
  .sort((a, b) => romanToInt(a) - romanToInt(b));
setUniqueTiers(tiers);
      setUniqueTiers(tiers);
    });
  }, []);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleTierChange = (tier) => {
    const newSelectedTiers = new Set(selectedTiers);
    if (newSelectedTiers.has(tier)) {
      newSelectedTiers.delete(tier);
    } else {
      newSelectedTiers.add(tier);
    }
    setSelectedTiers(newSelectedTiers);
  };

  const handlePopoverOpen = (event, filterType) => {
    setAnchorEls(prev => ({
      ...prev,
      [filterType]: event.currentTarget
    }));
  };

  const handlePopoverClose = (filterType) => {
    setAnchorEls(prev => ({
      ...prev,
      [filterType]: null
    }));
  };

  const filteredAndSortedData = React.useMemo(() => {
    return [...data]
      .filter(row => 
        row.Resource.toLowerCase().includes(resourceFilter.toLowerCase())
      )
      .filter(row => 
        selectedTiers.size === 0 || selectedTiers.has(row.Tier)
      )
      .filter(row => 
        (!valueFilter.min || row.Value >= Number(valueFilter.min)) &&
        (!valueFilter.max || row.Value <= Number(valueFilter.max))
      )
      .sort((a, b) => {
        if (b[orderBy] < a[orderBy]) {
          return order === 'desc' ? -1 : 1;
        }
        if (b[orderBy] > a[orderBy]) {
          return order === 'desc' ? 1 : -1;
        }
        return 0;
      });
  }, [data, order, orderBy, resourceFilter, selectedTiers, valueFilter]);
  
  const romanToInt = (roman) => {
  const romanMap = {
    'I': 1,
    'II': 2,
    'III': 3,
    'IV': 4,
    'V': 5,
    'VI': 6,
    'VII': 7,
    'VIII': 8,
    'IX': 9,
    'X': 10
  };
  return romanMap[roman] || roman; // fallback to original value if not a roman numeral
};

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TableSortLabel
                    active={orderBy === 'Resource'}
                    direction={orderBy === 'Resource' ? order : 'asc'}
                    onClick={() => handleRequestSort('Resource')}
                  >
                    Resource
                  </TableSortLabel>
                  <TextField
                    size="small"
                    variant="standard"
                    placeholder="Filter..."
                    value={resourceFilter}
                    onChange={(e) => setResourceFilter(e.target.value)}
                    sx={{ ml: 1 }}
                  />
                </Box>
              </TableCell>

              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TableSortLabel
                    active={orderBy === 'Tier'}
                    direction={orderBy === 'Tier' ? order : 'asc'}
                    onClick={() => handleRequestSort('Tier')}
                  >
                    Tier
                  </TableSortLabel>
                  <IconButton
                    size="small"
                    onClick={(e) => handlePopoverOpen(e, 'tier')}
                    sx={{ ml: 1 }}
                  >
                    <FilterListIcon />
                  </IconButton>
                </Box>
                <Popover
                  open={Boolean(anchorEls.tier)}
                  anchorEl={anchorEls.tier}
                  onClose={() => handlePopoverClose('tier')}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                >
                  <Box sx={{ p: 2 }}>
                    <FormGroup>
                      {uniqueTiers.map((tier) => (
                        <FormControlLabel
                          key={tier}
                          control={
                            <Checkbox
                              size="small"
                              checked={selectedTiers.has(tier)}
                              onChange={() => handleTierChange(tier)}
                            />
                          }
                          label={tier}
                        />
                      ))}
                    </FormGroup>
                  </Box>
                </Popover>
              </TableCell>

              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TableSortLabel
                    active={orderBy === 'Value'}
                    direction={orderBy === 'Value' ? order : 'asc'}
                    onClick={() => handleRequestSort('Value')}
                  >
                    Value
                  </TableSortLabel>
                  <IconButton
                    size="small"
                    onClick={(e) => handlePopoverOpen(e, 'value')}
                    sx={{ ml: 1 }}
                  >
                    <FilterListIcon />
                  </IconButton>
                </Box>
                <Popover
                  open={Boolean(anchorEls.value)}
                  anchorEl={anchorEls.value}
                  onClose={() => handlePopoverClose('value')}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                >
                  <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <TextField
                      label="Min"
                      type="number"
                      size="small"
                      value={valueFilter.min}
                      onChange={(e) => setValueFilter(prev => ({ ...prev, min: e.target.value }))}
                    />
                    <TextField
                      label="Max"
                      type="number"
                      size="small"
                      value={valueFilter.max}
                      onChange={(e) => setValueFilter(prev => ({ ...prev, max: e.target.value }))}
                    />
                  </Box>
                </Popover>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedData.map((row) => (
              <TableRow key={row.Resource}>
                <TableCell>{row.Resource}</TableCell>
                <TableCell>{row.Tier}</TableCell>
                <TableCell>{row.Value.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default EVValues;