import type { FruitType } from './fruit';

export interface SelectedArea {
  row: number;
  col: number;
  fruits: FruitType[][];
  score: number;
  timestamp: number;
}

export type GameState = 'menu' | 'playing' | 'paused' | 'result' | 'shop' | 'gameover';

export interface GameSelection {
  row: number;
  col: number;
}
