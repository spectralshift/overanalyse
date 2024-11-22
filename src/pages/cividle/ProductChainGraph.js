import React, { useEffect, useCallback, useMemo } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  MarkerType,
  Background,
  Controls,
  Position,
  BezierEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import dagre from 'dagre';
import ProductionNode from '../../components/ProductionNode'; // Import your custom node

const defaultEdgeOptions = {
  type: BezierEdge,
  style: { stroke: '#555' },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#888',
  },
};

// Update nodeTypes to use your imported ProcessNode
const nodeTypes = {
  processNode: ProductionNode,
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
  specificBuildingLevels,
  calculationMode
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const getLayoutedElements = (nodes, edges, direction = 'TB') => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    // Adjust these values based on your ProcessNode dimensions
    const nodeWidth = 200;  // Adjust based on your node's width
    const nodeHeight = 150; // Adjust based on your node's height

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
  return chain.map((item) => ({
    id: item.id, // Use the unique ID directly (no need for additional index)
    type: 'processNode',
    data: { 
      label: `${item.name} (x${item.estimatedBuildings || 1})`,
      inputs: item.input,
      outputs: item.output,
      requiredAmount: item.requiredLevels || 0,
      originalId: item.buildingId, // Store the original building ID if needed
    },
    position: { x: 0, y: 0 },
  }));
}, [chain]);


const createEdges = useMemo(() => {
  return chain
    .filter(node => node.parentId)
    .flatMap(node => {
      // For each output of this node
      return node.output.map((output, outputIndex) => {
        // Find the parent node
        const parent = chain.find(p => p.id === node.parentId);
        if (!parent) return null;

        // Find which input in the parent matches this output's resource
        const parentInputIndex = parent.input.findIndex(
          input => input.resource === output.resource
        );

        if (parentInputIndex === -1) return null;

        return {
          id: `e${node.id}-${node.parentId}-${output.resource}`,
          source: node.id,
          target: node.parentId,
          sourceHandle: 'output', // Single output handle
          targetHandle: `input-${parentInputIndex}`, // Specific input handle
          sourcePosition: Position.Bottom,
          targetPosition: Position.Top,
          type: BezierEdge,
          animated: false,
          //label: `${output.resource}: ${output.amount.toFixed(1)}`,
          style: {
            stroke: '#777',
            strokeWidth: '1.5px',
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#888',
          },
        };
      }).filter(Boolean); // Remove null entries
    });
}, [chain]);

  useEffect(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(createNodes, createEdges);
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [chain, globalBuff, calculationMode, setNodes, setEdges]);

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