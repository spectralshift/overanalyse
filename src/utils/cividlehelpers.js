import eraData from '../data/eraData.json';

export const convertInputUsingLetterUnitToNumber = (value, unit) => {
  const unitMultipliers = {
    'K': 1e3,
    'M': 1e6,
    'B': 1e9,
    'T': 1e12,
    'Q': 1e15
  };
  return parseFloat(value) * (unitMultipliers[unit] || 1);
};

export const convertNumberToDecimalLetterUnit = (number) => {
  const units = ['', 'K', 'M', 'B', 'T', 'Q'];
  let unitIndex = 0;
  
  while (number >= 1000 && unitIndex < units.length - 1) {
    number /= 1000;
    unitIndex++;
  }
  
  // Determine the number of decimal places
  let decimalPlaces = 2;
  if (number >= 100) decimalPlaces = 1;
  if (number >= 1000) decimalPlaces = 0;
  
  // Format the number
  const formattedNumber = number.toFixed(decimalPlaces);
  
  // Remove trailing zeros after the decimal point
  const trimmedNumber = formattedNumber.replace(/\.?0+$/, '');
  
  return `${trimmedNumber} ${units[unitIndex]}`.trim();
};

export const calculateScienceTime = (values, units) => {


  const [sciencePerSec, scienceSaved, scienceNeeded] = values.map((value, index) => 
    convertInputUsingLetterUnitToNumber(value, units[index])
  );

  if (sciencePerSec <= 0 || isNaN(scienceSaved) || isNaN(scienceNeeded)) {
    return { error: "Invalid input. Please check your values." };
  }

  const timeInTicks = Math.max(0, Math.round((scienceNeeded - scienceSaved) / sciencePerSec));
  
  const timespan = formatTicksToDayHourMinuteSec(timeInTicks)

  return {
    ticks: timeInTicks,
    timespan: timespan
  };
};

const getEVCostFromGPCount = (gpCount) => {
	return parseFloat(Math.pow((gpCount*400), 3));
};

export const calculateGPEfficiency = (currentGP, setupTime, evPerSecond, evUnit) => {
  const currentGPFloat = parseFloat(currentGP);
  const setupTimeSeconds = parseFloat(setupTime) * 3600;
  const evPerSecondValue = convertInputUsingLetterUnitToNumber(evPerSecond, evUnit);

  const currentGPCountEVCost = getEVCostFromGPCount(currentGPFloat);
  const timeToCurrentGPCountSeconds = currentGPCountEVCost / evPerSecondValue;
  const adjustedRunTimeSeconds = setupTimeSeconds - timeToCurrentGPCountSeconds;

  const lineChart1Data = [];
  const lineChart2Data = [];

  let maxGPPerHour = 0;
  let peakFound = false;
  let peakIndex = 0;
  let x = 0;
  
  // First, find the peak
    while (!peakFound && x <= 15000) {
    const futureGPCount = currentGPFloat + x;
    const costDifferenceEVCurrentToFuture = getEVCostFromGPCount(futureGPCount) - currentGPCountEVCost;
    const timeDifferenceCurrentToFutureSeconds = costDifferenceEVCurrentToFuture / evPerSecondValue;
    const projectedTotalRunTimeSecond = adjustedRunTimeSeconds + timeDifferenceCurrentToFutureSeconds;
    const projectedTotalRunTimeHours = projectedTotalRunTimeSecond / 3600;
    const futureGPperHour = futureGPCount / projectedTotalRunTimeHours;

    if (futureGPperHour < maxGPPerHour) {
      peakFound = true;
      peakIndex = x - 5; // The previous value was the peak
    } else {
      maxGPPerHour = futureGPperHour;
    }
    x += 5;
  }

  // Set the maximum to double the peak index
  const maximumX = peakIndex * 2;

  // Now generate the actual data points
  for (let x = 0; x <= maximumX; x += 1) {
    const futureGPCount = currentGPFloat + x;
    const costDifferenceEVCurrentToFuture = getEVCostFromGPCount(futureGPCount) - currentGPCountEVCost;
    const timeDifferenceCurrentToFutureSeconds = costDifferenceEVCurrentToFuture / evPerSecondValue;
    const projectedTotalRunTimeSecond = adjustedRunTimeSeconds + timeDifferenceCurrentToFutureSeconds;
    const projectedTotalRunTimeHours = projectedTotalRunTimeSecond / 3600;
    const futureGPperHour = futureGPCount / projectedTotalRunTimeHours;
    lineChart1Data.push({ x: futureGPCount, y: futureGPperHour });
    lineChart2Data.push({ x: futureGPCount, y: projectedTotalRunTimeHours });
  }

  return {
    lineChart1Data,
    lineChart2Data,
    inputValues: { currentGP, setupTime, evPerSecond, evUnit },
  };
};

export const getEraData = (sciencePerSec) => {
  return eraData.slice(0, 20).map(era => {
    const timeToReach = Math.ceil(era.EraCost / sciencePerSec);
    return {
      ...era,
      TimeToReach: formatTicksToDayHourMinuteSec(timeToReach)
    };
  });
};

const formatTicksToDayHourMinuteSec = (seconds) => {
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

export const eFormatTime = (hours) => {
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return `${days}d ${remainingHours.toFixed(2)}h`;
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