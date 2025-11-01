
import { Theme, ThemeName, BoardSize } from './types';

const TILE_COLORS: Record<number, string> = {
  0: 'bg-slate-800/50 hover:bg-slate-700/60',
  1: 'bg-sky-500',
  2: 'bg-emerald-500',
  3: 'bg-amber-500',
  4: 'bg-rose-500',
  5: 'bg-indigo-500',
  6: 'bg-pink-500',
  7: 'bg-teal-500',
  8: 'bg-orange-500',
  9: 'bg-purple-600',
  10: 'bg-cyan-400',
  11: 'bg-lime-400',
  12: 'bg-red-600',
  // Add more colors if needed
};

export const THEMES: Record<ThemeName, Theme> = {
  [ThemeName.Animals]: {
    name: 'Animals',
    emojis: {
      1: '🐭', 2: '🐰', 3: '🦊', 4: '🐻', 5: '🦁', 6: '🐯', 7: '🦄', 8: '🐲', 9: '🐼', 10: '🐨', 11: '🐘', 12: '🦍',
    },
    colors: TILE_COLORS,
  },
  [ThemeName.Plants]: {
    name: 'Plants',
    emojis: {
      1: '🌱', 2: '🌿', 3: '🌳', 4: '🌲', 5: '🌴', 6: '🌸', 7: '🌻', 8: '🍄', 9: '🌵', 10: '🌷', 11: '🌹', 12: '🍁'
    },
    colors: TILE_COLORS,
  },
  [ThemeName.Crystals]: {
    name: 'Crystals',
    emojis: {
      1: '💎', 2: '🔮', 3: '🌟', 4: '✨', 5: '💠', 6: '⭐', 7: '💫', 8: '☄️', 9: '🌠', 10: '🎇', 11: '🎆', 12: '🌈'
    },
    colors: TILE_COLORS,
  },
  [ThemeName.Elements]: {
    name: 'Elements',
    emojis: {
      1: '🔥', 2: '💧', 3: '💨', 4: '⚡', 5: '🌎', 6: '☀️', 7: '🌙', 8: '❄️', 9: '🌪️', 10: '🌊', 11: '🌋', 12: '🌀'
    },
    colors: TILE_COLORS,
  },
};

export const BOARD_SIZES: BoardSize[] = [
  { rows: 5, cols: 5 },
  { rows: 6, cols: 4 },
  { rows: 6, cols: 6 },
  { rows: 8, cols: 6 },
  { rows: 8, cols: 8 },
];
