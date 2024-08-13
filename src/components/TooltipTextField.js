import React from 'react';
import { TextField, Tooltip, IconButton } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const TooltipTextField = ({ tooltip, ...props }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <TextField {...props} />
      <Tooltip title={tooltip} arrow placement="top">
        <IconButton size="small" style={{ marginLeft: '8px' }}>
          <HelpOutlineIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default TooltipTextField;