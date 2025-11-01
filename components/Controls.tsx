import React from 'react';
import { THEMES, BOARD_SIZES } from '../constants';
import { BoardSize, Theme, ThemeName, TileValue } from '../types';
import Tile from './Tile';

interface ControlsProps {
  score: number;
  highestTile: TileValue;
  nextTile: TileValue;
  currentTheme: Theme;
  currentBoardSize: BoardSize;
  onNewGame: (size: BoardSize) => void;
  onUndo: () => void;
  onShowHint: () => void;
  onThemeChange: (theme: ThemeName) => void;
  onBoardSizeChange: (size: BoardSize) => void;
}

const Controls: React.FC<ControlsProps> = ({
  score,
  highestTile,
  nextTile,
  currentTheme,
  currentBoardSize,
  onNewGame,
  onUndo,
  onShowHint,
  onThemeChange,
  onBoardSizeChange,
}) => {
  return (
    <div className="w-full md:w-80 lg:w-96 p-4 bg-slate-800/50 rounded-xl shadow-lg flex flex-col gap-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-cyan-300">Merge Evolution</h2>
      </div>

      <div className="flex justify-around bg-slate-900/50 p-3 rounded-lg">
        <div className="text-center">
          <p className="text-sm text-slate-400">Score</p>
          <p className="text-2xl font-bold text-white">{score}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-slate-400">Next Tile</p>
          <div className="w-12 h-12 mx-auto mt-1">
             <Tile level={nextTile} theme={currentTheme} />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm text-slate-400">Highest Tile</p>
          <div className="w-12 h-12 mx-auto mt-1">
             <Tile level={highestTile} theme={currentTheme} />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-sm">
          <button
              onClick={() => onNewGame(currentBoardSize)}
              className="px-2 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-bold transition-colors"
            >
              New Game
          </button>
           <button
              onClick={onUndo}
              className="px-2 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg font-bold transition-colors"
            >
              Undo
          </button>
          <button
              onClick={onShowHint}
              className="px-2 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg font-bold transition-colors"
            >
              Hint
          </button>
      </div>

      <div className="flex flex-col gap-2">
        <div>
          <label htmlFor="board-size" className="block text-sm font-medium text-slate-400 mb-1">Board Size</label>
          <select
            id="board-size"
            value={JSON.stringify(currentBoardSize)}
            onChange={(e) => onBoardSizeChange(JSON.parse(e.target.value) as BoardSize)}
            className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-cyan-500 focus:border-cyan-500"
          >
            {BOARD_SIZES.map(size => (
              <option key={`${size.rows}x${size.cols}`} value={JSON.stringify(size)}>
                {size.rows} x {size.cols}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="theme" className="block text-sm font-medium text-slate-400 mb-1">Theme</label>
          <select
            id="theme"
            value={Object.keys(THEMES).find(key => THEMES[key as ThemeName].name === currentTheme.name)}
            onChange={(e) => onThemeChange(e.target.value as ThemeName)}
            className="w-full p-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-cyan-500 focus:border-cyan-500"
          >
            {Object.entries(THEMES).map(([key, theme]) => (
              <option key={key} value={key}>{theme.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Controls;