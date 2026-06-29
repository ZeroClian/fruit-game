export interface ShopItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  category: 'permanent' | 'probability' | 'consumable' | 'unlock';
  maxPurchases: number;
  currentPurchases: number;
}

export interface SaveData {
  version: string;
  currentLevel: number;
  coins: number;
  lives: number;
  permanentUpgrades: Record<string, number>;
  unlockedFruits: string[];
  consumables: Record<string, number>;
  completedLevels: number[];
  highScores: Record<number, number>;
  lastSaved: number;
}
