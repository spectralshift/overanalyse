import React from 'react';
import { Handle, Position } from 'reactflow';
import { Typography } from '@mui/material';

const INPUT_BOX_HEIGHT = 50;
const CENTER_ROW_HEIGHT = 40;
const OUTPUT_ROW_HEIGHT = 40;

const CustomNode = ({ data }) => {
  const {
    inputs = [],
    label = '',
    outputs = []
  } = data;

  return (
    <div
      style={{
        position: 'relative',
        minWidth: '200px',
      }}
    >
      {/* Semi-transparent background container */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white
          border: '1px solid #ccc',
          borderRadius: '5px',
          zIndex: -1, // Places it behind the handles
        }}
      />

      {/* Content container with minimal spacing */}
	  
	  
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {/* Input Row - Modified with minWidth */}
        {inputs.length > 0 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '2px',
            }}
          >
            {inputs.map((input, index) => (
              <div
                key={index}
                style={{
                  position: 'relative',
                  flex: 1,
                  minWidth: '90px', // Added minimum width
                  height: INPUT_BOX_HEIGHT,
                  border: '1px solid #ccc',
                  borderRadius: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'white',
                }}
              >
                <Handle
                  type="target"
                  position={Position.Top}
                  id={`input-${index}`}
                  style={{
                    background: '#555',
                    width: 8,
                    height: 8,
                    zIndex: 1,
                  }}
                />
                <Typography variant="caption" component="div" align="center">
                  {`${input.resource}: ${Math.ceil(input.amount)}`} {/* Ceiling the number */}
                </Typography>
              </div>
            ))}
          </div>
        )}

        {/* Center Row */}
        <div
          style={{
            height: CENTER_ROW_HEIGHT,
            border: '1px solid #ccc',
            borderRadius: '3px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'white',
          }}
        >
          <Typography variant="subtitle2" component="div">
            {label}
          </Typography>
        </div>

        {/* Output Row */}
        <div
          style={{
            position: 'relative',
            height: OUTPUT_ROW_HEIGHT,
            border: '1px solid #ccc',
            borderRadius: '3px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'white',
          }}
        >
          <Typography variant="caption" component="div">
            {outputs.map(output => 
              `${output.resource}: ${Math.ceil(output.amount)}`
            ).join(', ')}
          </Typography>
          <Handle
            type="source"
            position={Position.Bottom}
            style={{
              background: '#555',
              width: 8,
              height: 8,
              zIndex: 1,
            }}
            isConnectable={true}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomNode;