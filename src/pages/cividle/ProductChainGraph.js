import React, { useEffect, useCallback, useMemo } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  MarkerType,
  Background,
  Controls,
  Handle,
  Position,
  BezierEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { IconButton, Box, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import dagre from 'dagre';

const defaultEdgeOptions = {
  type: BezierEdge,
  style: { stroke: '#555' },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#888',
  },
};

const CustomNode = ({ data }) => (
  <div style={{
    background: '#eee',
    border: '1px solid #ddd',
    borderRadius: '50%',
    padding: '10px',
    width: '150px',
    height: '150px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '11px',
    textAlign: 'center',
  }}>
    <Handle type="target" position={Position.Top} style={{ background: '#555' }} isConnectable={true} />
    <div>
      {data.inputs && data.inputs.length > 0 && (
        <Typography variant="caption" component="div">
          In: {data.inputs.map(input => `${input.resource}: ${Math.round(input.amount)}`).join(', ')}
        </Typography>
      )}
    </div>
    <Typography variant="subtitle2" component="div">{data.label}</Typography>
    <div>
      <Typography variant="caption" component="div">
        Out: {data.outputs.map(output => `${output.resource}: ${Math.round(output.amount)}`).join(', ')}
      </Typography>
    </div>
    <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} isConnectable={true} />
  </div>
);

const nodeTypes = {
  custom: CustomNode,
};

const ProductChainGraph = ({ 
  chain, 
  onClose, 
  calculateBuildings, 
  calculateAdjustedProduction, 
  globalBuff, 
  multipliers, 
  requiredAmounts,
  selectedBuilding,
  buildingCount,
  buildingLevel,
  totalBuildingLevels,
  specificBuildingLevels
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const getLayoutedElements = (nodes, edges, direction = 'TB') => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    const nodeWidth = 150;
    const nodeHeight = 150;

    //const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    return {
      nodes: nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
          ...node,
          position: {
            x: nodeWithPosition.x - nodeWidth / 2,
            y: nodeWithPosition.y - nodeHeight / 2,
          },
        };
      }),
      edges,
    };
  };

  const createNodes = useMemo(() => {
  return chain.map((item) => {
    const buildingMultiplier = item.multiplier || 1;
    const totalMultiplier = buildingMultiplier + globalBuff;
    let requiredAmount = item.requiredLevels || 0;  // Use requiredLevels instead of requiredAmount

    const buildingCount = Math.ceil(item.estimatedBuildings || 0);

    const formattedInputs = item.input.map(input => ({
      resource: input.resource,
      amount: (input.amount * buildingCount).toFixed(2)
    }));
    
    const formattedOutputs = item.output.map(output => ({
      resource: output.resource,
      amount: (output.amount * buildingCount * totalMultiplier).toFixed(2)
    }));

    return {
      id: item.id,
      type: 'custom',
      data: { 
        label: `${item.name} (x${buildingCount})`,
        inputs: formattedInputs,
        outputs: formattedOutputs,
        requiredAmount: requiredAmount,
      },
      position: { x: 0, y: 0 },
    };
  });
}, [chain, globalBuff]);



  const createEdges = useMemo(() => {
    return chain.flatMap(item => {
      return item.input.flatMap(input => {
        const sourceNode = chain.find(node => 
          node.output.some(output => output.resource === input.resource)
        );

        if (sourceNode) {
          return [{
            id: `e${sourceNode.id}-${item.id}-${input.resource}`,
            source: sourceNode.id,
            target: item.id,
            sourcePosition: Position.Bottom,
            targetPosition: Position.Top,
            type: BezierEdge,
            animated: false,
            label: input.resource,
            style: {
              stroke: '#777',
              strokeWidth: '1.5px',
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#888',
            },
          }];
        }
        return [];
      });
    });
  }, [chain]);

  useEffect(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(createNodes, createEdges);
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [chain, globalBuff, setNodes, setEdges]);

  const onConnect = useCallback((params) => setEdges((eds) => [...eds, params]), [setEdges]);

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 10,
          bgcolor: 'background.paper',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
        aria-label="close"
      >
        <CloseIcon />
      </IconButton>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </Box>
  );
};

export default ProductChainGraph;