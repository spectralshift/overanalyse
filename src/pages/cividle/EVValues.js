import React, { useState, useEffect } from 'react';
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { csv } from 'd3-fetch';
import PageHeader from '../../components/PageHeader';

const PAGE_TITLE = "Empire Value Table";
const PAGE_DESCRIPTION = "A simple sortable table showing the Value of all items in the game."


const EVValues = () => {
  const [data, setData] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('Resource');

  useEffect(() => {
    csv('/data/evValues.csv').then(data => {
      const parsedData = data.map(row => ({
        ...row,
        Value: parseInt(row.Value, 10)
      }));
      setData(parsedData);
    });
  }, []);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedData = React.useMemo(() => {
    const comparator = (a, b) => {
      if (b[orderBy] < a[orderBy]) {
        return order === 'desc' ? -1 : 1;
      }
      if (b[orderBy] > a[orderBy]) {
        return order === 'desc' ? 1 : -1;
      }
      return 0;
    };
    return [...data].sort(comparator);
  }, [data, order, orderBy]);

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <PageHeader title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {['Resource', 'Tier', 'Value'].map((headCell) => (
                <TableCell key={headCell}>
                  <TableSortLabel
                    active={orderBy === headCell}
                    direction={orderBy === headCell ? order : 'asc'}
                    onClick={() => handleRequestSort(headCell)}
                  >
                    {headCell}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((row) => (
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