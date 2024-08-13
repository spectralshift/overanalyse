import { BuildingData, ChainNode, ProductChainState } from './productChainTypes';

export function buildGraph(buildingsData: BuildingData[]): Map<string, BuildingData> {
  return new Map(buildingsData.map(building => [building.id, building]));
}

export function calculateUniqueResourceFlow(graph, selectedBuilding, multipliers, globalBuff, buildingCount, buildingLevel) {
  const result = [];
  const queue = [[selectedBuilding, buildingCount * buildingLevel, null]];
  const visited = new Set();

  while (queue.length > 0) {
    const [currentBuildingId, requiredLevels, parentId] = queue.shift();
    if (visited.has(currentBuildingId)) continue;
    visited.add(currentBuildingId);

    const building = graph.get(currentBuildingId);
    if (!building) continue;

    const node = {
      id: building.id,
      name: building.name,
      input: Object.entries(building.input).map(([resource, amount]) => ({ resource, amount: amount * requiredLevels })),
      output: Object.entries(building.output).map(([resource, amount]) => ({ resource, amount: amount * requiredLevels })),
      requiredLevels,
      parentId,
      buildingCount: 1,
      multiplier: multipliers[building.id] || 1,
      specificBuildingLevel: null,
    };

    result.push(node);

    Object.entries(building.input).forEach(([inputResource, inputAmount]) => {
      const inputBuilding = Array.from(graph.values()).find(b => Object.keys(b.output).includes(inputResource));
      if (inputBuilding) {
        const inputRequiredAmount = requiredLevels * inputAmount;
        const inputBuildingOutput = inputBuilding.output[inputResource];
        const inputBuildingMultiplier = (multipliers[inputBuilding.id] || 1) + globalBuff;
        const inputRequiredLevels = inputRequiredAmount / (inputBuildingOutput * inputBuildingMultiplier);
        queue.push([inputBuilding.id, inputRequiredLevels, currentBuildingId]);
      }
    });
  }

  return result;
}

export function calculateCombinedResourceFlow(graph, selectedBuilding, multipliers, globalBuff, buildingCount, buildingLevel) {
  const result = new Map();
  const queue = [[selectedBuilding, buildingCount * buildingLevel, null]];

  while (queue.length > 0) {
    const [currentBuildingId, requiredLevels, parentId] = queue.shift();
    const building = graph.get(currentBuildingId);
    if (!building) continue;

    let node = result.get(currentBuildingId);
    if (!node) {
      node = {
        id: building.id,
        name: building.name,
        input: {},
        output: {},
        requiredLevels: 0,
        parentIds: new Set(),
        buildingCount: 0,
        multiplier: multipliers[building.id] || 1,
        specificBuildingLevel: null,
      };
      result.set(currentBuildingId, node);
    }

    node.requiredLevels += requiredLevels;
    node.buildingCount += 1;
    if (parentId) node.parentIds.add(parentId);

    Object.entries(building.input).forEach(([resource, amount]) => {
      node.input[resource] = (node.input[resource] || 0) + amount * requiredLevels;
    });

    Object.entries(building.output).forEach(([resource, amount]) => {
      node.output[resource] = (node.output[resource] || 0) + amount * requiredLevels;
    });

    Object.entries(building.input).forEach(([inputResource, inputAmount]) => {
      const inputBuilding = Array.from(graph.values()).find(b => Object.keys(b.output).includes(inputResource));
      if (inputBuilding) {
        const inputRequiredAmount = requiredLevels * inputAmount;
        const inputBuildingOutput = inputBuilding.output[inputResource];
        const inputBuildingMultiplier = (multipliers[inputBuilding.id] || 1) + globalBuff;
        const inputRequiredLevels = inputRequiredAmount / (inputBuildingOutput * inputBuildingMultiplier);
        queue.push([inputBuilding.id, inputRequiredLevels, currentBuildingId]);
      }
    });
  }

  return Array.from(result.values()).map(node => ({
    ...node,
    input: Object.entries(node.input).map(([resource, amount]) => ({ resource, amount })),
    output: Object.entries(node.output).map(([resource, amount]) => ({ resource, amount })),
    parentId: Array.from(node.parentIds)[0] || null,
  }));
}


export function processChainData(
  flow,
  graph,
  state
) {
  return flow.map(node => {
    const building = graph.get(node.id);
    if (!building) return node;

    const getBuildingLevel = (nodeId) => {
      if (state.specificBuildingLevels[nodeId]) {
        return state.specificBuildingLevels[nodeId];
      } else if (state.buildingLevel) {
        return parseInt(state.buildingLevel);
      } else {
        return 1;
      }
    };

    const buildingLevel = getBuildingLevel(node.id);
    const outputAmount = Object.values(building.output)[0]; // Assuming single output for simplicity
    const totalMultiplier = (state.multipliers[node.id] || 1) + state.globalBuff;
    const outputPerLevel = outputAmount * totalMultiplier;

    const estimatedBuildings = Math.ceil(node.requiredLevels / buildingLevel);

    return {
      ...node,
      buildingCount: estimatedBuildings,
      specificBuildingLevel: state.specificBuildingLevels[node.id] || null,
      outputPerLevel,
      totalOutput: outputPerLevel * node.requiredLevels,
      estimatedBuildings: estimatedBuildings
    };
  });
}

export function calculateBuildings(
  node: ChainNode,
  state: ProductChainState
): number {
  const buildingLevel = getBuildingLevelForCalculation(node.id, state);
  return Math.ceil(node.requiredAmount / buildingLevel);
}

export function calculateAdjustedProduction(
  baseProduction: number,
  node: ChainNode,
  state: ProductChainState
): number {
  const buildingLevels = Math.ceil(node.requiredAmount * getBuildingLevels(state));
  const buildingMultiplier = state.multipliers[node.id] || 1;
  return baseProduction * buildingLevels * (buildingMultiplier + state.globalBuff);
}

export function getBuildingLevelForCalculation(
  buildingId,
  state = {}  // Provide a default empty object
) {
  if (state.specificBuildingLevels && state.specificBuildingLevels[buildingId]) return state.specificBuildingLevels[buildingId];
  if (state.buildingLevel) return parseInt(state.buildingLevel);
  return 1;
}

export function getBuildingLevels(state: ProductChainState): number {
  if (state.totalBuildingLevels) return state.totalBuildingLevels;
  if (state.buildingCount && state.buildingLevel) return state.buildingCount * state.buildingLevel;
  return 1;
}

export function calculateSubtotal(chain: ChainNode[], state: ProductChainState): number {
  return Math.ceil(chain.reduce((sum, node) => sum + node.requiredAmount * getBuildingLevels(state), 0));
}

export function calculateDividedSubtotal(chain: ChainNode[], state: ProductChainState): number {
  const subtotal = calculateSubtotal(chain, state);
  const divisor = state.buildingLevel || 20;
  return Math.ceil(subtotal / divisor);
}

export function calculateEstimatedOutput(selectedNode: ChainNode | null, state: ProductChainState): number | null {
  if (!selectedNode) return null;
  const buildingMultiplier = state.multipliers[selectedNode.id] || 1;
  return Math.ceil((buildingMultiplier + state.globalBuff) * selectedNode.requiredAmount);
}