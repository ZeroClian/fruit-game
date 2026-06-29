import type { FruitType } from './fruit';

export interface Restriction {
  id: string;
  name: string;
  description: string;
  icon: string;
  intensity: number;
  minBigLevel: number;
}

export interface LevelConfig {
  levelNumber: number;
  bigLevel: number;
  subLevel: number;
  targetScore: number;
  availableFruits: FruitType[];
  fruitProbabilities: Record<string, number>;
  restrictions: Restriction[];
  maxSelections: number;
}
