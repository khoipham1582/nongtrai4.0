// Farm Levels and their properties
export interface FarmLevel {
  level: number;
  name: string;
  requiredExp: number;
  availableCrops: string[];
  availableAnimals: string[];
  maxSlots: number;
}

// Crop types
export interface Crop {
  id: string;
  name: string;
  icon: string;
  growthTime: number; // in seconds
  expReward: number;
  sellPrice: number;
  requiredLevel: number;
}

// Animal types
export interface Animal {
  id: string;
  name: string;
  icon: string;
  productionTime: number; // in seconds
  expReward: number;
  productName: string;
  sellPrice: number;
  requiredLevel: number;
}

// Player inventory item
export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  type: 'crop' | 'animal' | 'seed' | 'product';
  sellPrice: number;
}

// Farm plot (for crops)
export interface FarmPlot {
  id: string;
  cropId: string | null;
  plantedAt: number | null;
  readyAt: number | null;
  isReady: boolean;
}

// Animal pen
export interface AnimalPen {
  id: string;
  animalId: string;
  lastProducedAt: number;
  readyAt: number | null;
  isReady: boolean;
}

// Player/Farm data
export interface Player {
  id: string;
  name: string;
  farmLevel: number;
  experience: number;
  gold: number;
  inventory: InventoryItem[];
  farmPlots: FarmPlot[];
  animalPens: AnimalPen[];
  createdAt: number;
  lastUpdated: number;
}

// Game data
export interface GameData {
  players: Player[];
}
