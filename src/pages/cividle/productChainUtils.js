import { BuildingData, ChainNode, ProductChainState } from './productChainTypes';

export function buildGraph(buildingsData: BuildingData[]): Map<string, BuildingData> {
  return new Map(buildingsData.map(building => [building.id, building]));
}

export function calculateUniqueResourceFlow(
  graph,
  selectedBuilding,
  multipliers,
  globalBuff,
  buildingCount,
  buildingLevel,
  specificBuildingLevels = {}
) {
  const result = [];
  const queue = [[selectedBuilding, buildingCount * buildingLevel, null, 0]];
  const visited = new Map();

  function calculateRequiredInput(amount, buildingId) {
    const buildingMultiplier = multipliers[buildingId] ?? 1;
    const totalMultiplier = buildingMultiplier + globalBuff;
    return amount / totalMultiplier;
  }

  while (queue.length > 0) {
    const [currentBuildingId, requiredLevels, parentId, pathIndex] = queue.shift();
    const uniqueNodeId = `${currentBuildingId}_${parentId ?? 'root'}_${pathIndex}`;
    
    if (visited.has(uniqueNodeId)) continue;
    visited.set(uniqueNodeId, true);

    const building = graph.get(currentBuildingId);
    if (!building) continue;

    // First, establish the required output
    const outputAmounts = Object.entries(building.output).map(([resource, amount]) => ({
      resource,
      amount: amount * requiredLevels
    }));

    // Then, calculate the required inputs based on building efficiency
    const inputAmounts = Object.entries(building.input).map(([resource, amount]) => ({
      resource,
      amount: calculateRequiredInput(
        amount * requiredLevels,
        currentBuildingId
      )
    }));

    const node = {
      id: uniqueNodeId,
      buildingId: currentBuildingId,
      name: building.name,
      input: inputAmounts,
      output: outputAmounts,
      requiredLevels,
      parentId,
      buildingCount: 1,
      multiplier: multipliers[currentBuildingId] ?? 1
    };

    result.push(node);

    let childPathIndex = pathIndex + 1;

    // Process child nodes using the adjusted input requirements
    inputAmounts.forEach(({ resource, amount }) => {
      const inputBuilding = Array.from(graph.values()).find(b => 
        Object.keys(b.output).includes(resource)
      );
      if (inputBuilding) {
        const inputBuildingOutput = inputBuilding.output[resource];
        // Don't apply multiplier here as it will be handled in the next iteration
        const inputRequiredLevels = amount / inputBuildingOutput;
        queue.push([
          inputBuilding.id, 
          inputRequiredLevels, 
          uniqueNodeId,
          childPathIndex++
        ]);
      }
    });
  }

  return result;
}

export function processChainData(flow, graph, state) {
  return flow.map(node => {
    const building = graph.get(node.buildingId);
    if (!building) return node;

    const isSelectedBuilding = node.buildingId === state.selectedBuilding;
    const buildingMultiplier = state.multipliers[node.buildingId] ?? 1;
    const outputAmount = Object.values(building.output)[0];
    
    // Only apply multiplier if it's not the selected building
    const totalMultiplier = isSelectedBuilding 
      ? 1  // Selected building doesn't get multiplier
      : buildingMultiplier + state.globalBuff;
    
    const outputPerLevel = outputAmount * totalMultiplier;

    const estimatedBuildings = Math.ceil(node.requiredLevels / 
      (state.specificBuildingLevels[node.buildingId] || state.buildingLevel || 1));

    return {
      ...node,
      buildingCount: estimatedBuildings,
      multiplier: buildingMultiplier,
      outputPerLevel,
      totalOutput: outputPerLevel * node.requiredLevels,
      estimatedBuildings,
      isSelectedBuilding
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
  const buildingMultiplier = Math.min(99, Math.max(1, state.multipliers[node.id] || 1));
  const globalBuff = Math.min(99, Math.max(0, state.globalBuff));
  return baseProduction * buildingLevels * (buildingMultiplier + globalBuff);
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
  const buildingMultiplier = Math.min(99, Math.max(1, state.multipliers[selectedNode.id] || 1));
  const globalBuff = Math.min(99, Math.max(0, state.globalBuff));
  return Math.ceil((buildingMultiplier + globalBuff) * selectedNode.requiredAmount);
}