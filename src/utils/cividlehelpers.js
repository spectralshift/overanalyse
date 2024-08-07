import eraData from '../data/eraData.json';

export const calculateScienceTime = (values, units) => {
  const unitMultipliers = {
    'K': 1e3,
    'M': 1e6,
    'B': 1e9,
    'T': 1e12,
    'Q': 1e15
  };

  const [sciencePerSec, scienceSaved, scienceNeeded] = values.map((value, index) => 
    parseFloat(value) * unitMultipliers[units[index]]
  );

  if (sciencePerSec <= 0 || isNaN(scienceSaved) || isNaN(scienceNeeded)) {
    return { error: "Invalid input. Please check your values." };
  }

  const timeInTicks = Math.max(0, Math.round((scienceNeeded - scienceSaved) / sciencePerSec));
  
  const timespan = formatTime(timeInTicks)

  return {
    ticks: timeInTicks,
    timespan: timespan
  };
};

export const calculateGPEfficiency = (currentGP, setupTime, evPerSecond, evUnit) => {
  const unitMultipliers = {
    'K': 1e-3,
    'M': 1,
    'B': 1e3,
    'T': 1e6,
    'Q': 1e9
  };

  const evPerSecondInMillions = parseFloat(evPerSecond) * unitMultipliers[evUnit];
  const setupTimeFloat = parseFloat(setupTime);

  const lineChart1Data = [];
  const lineChart2Data = [];
  const debugData = [];

  let peakEfficiencyX = 0;
  let prevY1 = 0;

  // Generate chart data for the full range
  for (let x = 0; x <= 2000; x += 25) {
    const baseCalculation = (64 * Math.pow(x, 3)) / evPerSecondInMillions / 3600;
    const y1 = x / (baseCalculation + setupTimeFloat);
    const y2 = baseCalculation + setupTimeFloat;

    lineChart1Data.push({ x, y: y1 });
    lineChart2Data.push({ x, y: y2 });

    if (x % 200 === 0) {
      debugData.push({ x, evPerSecondInMillions, baseCalculation, y1, y2 });
    }

    // Check for peak efficiency (only for x > 0 to avoid division by zero)
    if (x > 0 && y1 < prevY1 && peakEfficiencyX === 0) {
      peakEfficiencyX = x;
    }

    prevY1 = y1;
  }

  // Fine-tune the peak efficiency x value
  if (peakEfficiencyX > 0) {

    prevY1 = 0;
    for (let x = (peakEfficiencyX - 25); x < peakEfficiencyX + 25; x++) {
      const baseCalculation = (64 * Math.pow(x, 3)) / evPerSecondInMillions / 3600;
      const y1 = x / (baseCalculation + setupTimeFloat);

      if (y1 < prevY1) {
        peakEfficiencyX = x - 1;
        break;
      }

      prevY1 = y1;
    }
  }

  return {
    lineChart1Data,
    lineChart2Data,
    integerValue: peakEfficiencyX,
    debugData,
    inputValues: { currentGP, setupTime, evPerSecond, evUnit }
  };
};



export const getEraData = (sciencePerSec) => {
  return eraData.slice(0, 20).map(era => {
    const timeToReach = Math.ceil(era.EraCost / sciencePerSec);
    return {
      ...era,
      TimeToReach: formatTime(timeToReach)
    };
  });
};

const formatTime = (seconds) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts = [];

  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds}s`);

  return parts.join(' ');
};

export const buildGraph = (buildings) => {
  const graph = {};

  // Initialize nodes
  for (const building of buildings) {
    graph[building.id] = { building, inEdges: [], outEdges: [] };
  }

  // Connect nodes
  for (const [id, node] of Object.entries(graph)) {
    for (const output in node.building.output) {
      for (const [otherId, otherNode] of Object.entries(graph)) {
        if (otherId !== id && output in otherNode.building.input) {
          node.outEdges.push(otherId);
          otherNode.inEdges.push(id);
        }
      }
    }
  }

  return graph;
};


export const calculateResourceFlow = (graph, startNodeId, multipliers, globalBuff) => {
  const flow = { ratios: {}, relevantBuildings: new Set(), requiredAmounts: {} };
  const visited = new Set();

  const dfs = (nodeId, requiredAmount = 1) => {
    flow.relevantBuildings.add(nodeId);
    
    const node = graph[nodeId];
    const nodeMultiplier = (multipliers[nodeId] || 1) + globalBuff;
    
    // Initialize or update the required amount for this node
    flow.requiredAmounts[nodeId] = (flow.requiredAmounts[nodeId] || 0) + requiredAmount;
    
    // Only process inputs if we haven't visited this node or if we need more of its output
    if (!visited.has(nodeId) || flow.requiredAmounts[nodeId] > flow.ratios[nodeId]) {
      visited.add(nodeId);
      
      // Calculate the ratio for this node
      const outputAmount = Object.values(node.building.output)[0] * nodeMultiplier;
      flow.ratios[nodeId] = flow.requiredAmounts[nodeId] / outputAmount;

      // Recurse through input edges
      for (const [inputResource, inputAmount] of Object.entries(node.building.input)) {
        for (const inNodeId of node.inEdges) {
          const inNode = graph[inNodeId];
          if (inputResource in inNode.building.output) {
            const requiredInputAmount = inputAmount * flow.ratios[nodeId];
            dfs(inNodeId, requiredInputAmount);
          }
        }
      }
    }
  };

  dfs(startNodeId);
  return flow;
};

/*

export const calculateResourceFlow = (graph, startNodeId, multipliers, globalBuff) => {
  const flow = { ratios: {}, relevantBuildings: new Set() };
  const visited = new Set();

  const dfs = (nodeId, requiredAmount = 1) => {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    flow.relevantBuildings.add(nodeId);

    const node = graph[nodeId];
    const nodeMultiplier = (multipliers[nodeId] || 1) + globalBuff;
    
    // Calculate the ratio for this node
    if (nodeId === startNodeId) {
      flow.ratios[nodeId] = 1; // The selected building always has a ratio of 1
    } else {
      const outputAmount = Object.values(node.building.output)[0] * nodeMultiplier;
      flow.ratios[nodeId] = requiredAmount / outputAmount;
    }

    // Recurse through input edges
    for (const [inputResource, inputAmount] of Object.entries(node.building.input)) {
      for (const inNodeId of node.inEdges) {
        const inNode = graph[inNodeId];
        if (inputResource in inNode.building.output) {
          const requiredInputAmount = inputAmount * flow.ratios[nodeId];
          dfs(inNodeId, requiredInputAmount);
        }
      }
    }
  };

  dfs(startNodeId);
  return flow;
};
*/
export const processChainData = (flow, graph) => {
  return Array.from(flow.relevantBuildings).map(buildingId => {
    const building = graph[buildingId].building;
    return {
      id: buildingId,
      name: building.name,
      input: formatResourceObject(building.input),
      output: formatResourceObject(building.output),
      ratio: flow.ratios[buildingId],
      requiredAmount: flow.requiredAmounts[buildingId]
    };
  }).sort((a, b) => a.name.localeCompare(b.name));
};

const formatResourceObject = (obj) => {
  return Object.entries(obj)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
};