import { Player, FarmPlot, AnimalPen, InventoryItem } from '@/types/game';
import { FARM_LEVELS, CROPS, ANIMALS } from '@/types/gameConfig';

const STORAGE_KEY = 'farm_game_player';

// Create a new player with initial resources
export function createNewPlayer(name: string): Player {
  const now = Date.now();
  const farmPlots: FarmPlot[] = Array.from({ length: 6 }, (_, i) => ({
    id: `plot_${i}`,
    cropId: null,
    plantedAt: null,
    readyAt: null,
    isReady: false,
  }));

  const animalPens: AnimalPen[] = Array.from({ length: 3 }, (_, i) => ({
    id: `pen_${i}`,
    animalId: i === 0 ? 'chicken' : i === 1 ? 'duck' : 'chicken',
    lastProducedAt: now,
    readyAt: now + (ANIMALS[i === 0 ? 'chicken' : i === 1 ? 'duck' : 'chicken'].productionTime * 1000),
    isReady: false,
  }));

  const inventory: InventoryItem[] = [
    { id: 'tomato_seed', name: 'Hạt Cà Chua', quantity: 5, type: 'seed', sellPrice: 10 },
    { id: 'corn_seed', name: 'Hạt Bắp', quantity: 5, type: 'seed', sellPrice: 10 },
  ];

  return {
    id: `player_${Date.now()}`,
    name,
    farmLevel: 1,
    experience: 0,
    gold: 1000,
    inventory,
    farmPlots,
    animalPens,
    createdAt: now,
    lastUpdated: now,
  };
}

// Save player to localStorage
export function savePlayer(player: Player): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
}

// Load player from localStorage
export function loadPlayer(): Player | null {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

// Clear player data
export function clearPlayer(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// Add experience and check for level up
export function addExperience(player: Player, amount: number): { player: Player; leveledUp: boolean; newLevel?: number } {
  const oldLevel = player.farmLevel;
  player.experience += amount;

  // Check for level up
  for (let i = FARM_LEVELS.length - 1; i >= 0; i--) {
    if (player.experience >= FARM_LEVELS[i].requiredExp && player.farmLevel !== FARM_LEVELS[i].level) {
      player.farmLevel = FARM_LEVELS[i].level;
      
      // Add new farm plots and animal pens when leveling up
      const newLevel = FARM_LEVELS[i];
      const oldLevel = i > 0 ? FARM_LEVELS[i - 1] : FARM_LEVELS[0];
      
      const newPlotsCount = newLevel.maxSlots - oldLevel.maxSlots;
      for (let j = 0; j < newPlotsCount; j++) {
        const plotId = `plot_${player.farmPlots.length}`;
        player.farmPlots.push({
          id: plotId,
          cropId: null,
          plantedAt: null,
          readyAt: null,
          isReady: false,
        });
      }

      // Add new animals when leveling up
      const newAnimals = newLevel.availableAnimals.filter(animal => !oldLevel.availableAnimals.includes(animal));
      newAnimals.forEach((animalId, index) => {
        const penId = `pen_${player.animalPens.length}`;
        player.animalPens.push({
          id: penId,
          animalId: animalId,
          lastProducedAt: Date.now(),
          readyAt: Date.now() + (ANIMALS[animalId].productionTime * 1000),
          isReady: false,
        });
      });

      // Add new seeds when leveling up
      const newCrops = newLevel.availableCrops.filter(crop => !oldLevel.availableCrops.includes(crop));
      newCrops.forEach(cropId => {
        const seedItem = player.inventory.find(item => item.id === `${cropId}_seed`);
        if (seedItem) {
          seedItem.quantity += 5; // Add 5 seeds of new crop
        } else {
          player.inventory.push({
            id: `${cropId}_seed`,
            name: `Hạt ${CROPS[cropId].name}`,
            quantity: 5,
            type: 'seed',
            sellPrice: 10,
          });
        }
      });

      player.lastUpdated = Date.now();
      return { player, leveledUp: true, newLevel: player.farmLevel };
    }
  }

  player.lastUpdated = Date.now();
  return { player, leveledUp: false };
}

// Add gold
export function addGold(player: Player, amount: number): Player {
  player.gold += amount;
  player.lastUpdated = Date.now();
  return player;
}

// Subtract gold
export function subtractGold(player: Player, amount: number): boolean {
  if (player.gold >= amount) {
    player.gold -= amount;
    player.lastUpdated = Date.now();
    return true;
  }
  return false;
}

// Plant a crop
export function plantCrop(player: Player, plotId: string, cropId: string): boolean {
  const plot = player.farmPlots.find(p => p.id === plotId);
  if (!plot || plot.cropId) return false;

  const crop = CROPS[cropId];
  if (!crop) return false;

  const currentFarmLevel = FARM_LEVELS.find(f => f.level === player.farmLevel);
  if (!currentFarmLevel || !currentFarmLevel.availableCrops.includes(cropId)) return false;

  const now = Date.now();
  plot.cropId = cropId;
  plot.plantedAt = now;
  plot.readyAt = now + crop.growthTime * 1000;
  plot.isReady = false;
  player.lastUpdated = now;

  return true;
}

// Harvest a crop
export function harvestCrop(player: Player, plotId: string): { success: boolean; expGained: number; goldGained: number; player: Player } {
  const plot = player.farmPlots.find(p => p.id === plotId);
  if (!plot || !plot.cropId || !plot.isReady) return { success: false, expGained: 0, goldGained: 0, player };

  const crop = CROPS[plot.cropId];
  if (!crop) return { success: false, expGained: 0, goldGained: 0, player };

  // Add gold directly
  player = addGold(player, crop.sellPrice);

  plot.cropId = null;
  plot.plantedAt = null;
  plot.readyAt = null;
  plot.isReady = false;

  return { success: true, expGained: crop.expReward, goldGained: crop.sellPrice, player };
}

// Collect animal product
export function collectAnimalProduct(player: Player, penId: string): { success: boolean; expGained: number; goldGained: number; productName: string; player: Player } {
  const pen = player.animalPens.find(p => p.id === penId);
  if (!pen || !pen.isReady) return { success: false, expGained: 0, goldGained: 0, productName: '', player };

  const animal = ANIMALS[pen.animalId];
  if (!animal) return { success: false, expGained: 0, goldGained: 0, productName: '', player };

  // Add gold directly
  player = addGold(player, animal.sellPrice);

  const now = Date.now();
  pen.lastProducedAt = now;
  pen.readyAt = now + animal.productionTime * 1000;
  pen.isReady = false;

  return { success: true, expGained: animal.expReward, goldGained: animal.sellPrice, productName: animal.productName, player };
}

// Update farm state (check if crops/animals are ready)
export function updateFarmState(player: Player): Player {
  const now = Date.now();

  player.farmPlots.forEach(plot => {
    if (plot.readyAt && now >= plot.readyAt) {
      plot.isReady = true;
    }
  });

  player.animalPens.forEach(pen => {
    if (pen.readyAt && now >= pen.readyAt) {
      pen.isReady = true;
    }
  });

  return player;
}

// Get current farm level info
export function getCurrentFarmLevelInfo(farmLevel: number) {
  return FARM_LEVELS.find(f => f.level === farmLevel);
}

// Get next farm level info
export function getNextFarmLevelInfo(farmLevel: number) {
  return FARM_LEVELS.find(f => f.level === farmLevel + 1);
}