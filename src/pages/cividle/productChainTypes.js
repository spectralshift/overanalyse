export interface BuildingData {
  id: string;
  name: string;
  input: Record<string, number>;
  output: Record<string, number>;
}

export interface ChainNode {
  id: string;
  name: string;
  input: { resource: string; amount: number }[];
  output: { resource: string; amount: number }[];
  requiredAmount: number;
  buildingCount: number;
  multiplier: number;
  specificBuildingLevel: number | null;
}

export interface ProductChainState {
  selectedBuilding: string;
  chain: ChainNode[];
  multipliers: Record<string, number>;
  globalBuff: number;
  buildingCount: number;
  buildingLevel: number;
  totalBuildingLevels: number | null;
  specificBuildingLevels: Record<string, number>;
}