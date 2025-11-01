
export type TileValue = number;
export type Board = TileValue[][];

export enum ThemeName {
  Animals = 'animals',
  Plants = 'plants',
  Crystals = 'crystals',
  Elements = 'elements',
}

export type Theme = {
  name: string;
  emojis: Record<number, string>;
  colors: Record<number, string>;
};

export type BoardSize = {
  rows: number;
  cols: number;
};

export enum GameStatus {
  Playing = 'playing',
  GameOver = 'gameover',
}

export type HistoryEntry = {
  board: Board;
  score: number;
  highestTile: number;
};
