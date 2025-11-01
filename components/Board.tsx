import React from 'react';
import { Board as BoardType, Theme, BoardSize } from '../types';
import Tile from './Tile';

interface BoardProps {
  board: BoardType;
  boardSize: BoardSize;
  theme: Theme;
  onTileClick: (row: number, col: number) => void;
  mergingCells: Set<string>;
  newCell: string | null;
  hintCell: { row: number, col: number } | null;
  disabled: boolean;
}

const Board: React.FC<BoardProps> = ({ board, boardSize, theme, onTileClick, mergingCells, newCell, hintCell, disabled }) => {
  const gridTemplateColumns = `repeat(${boardSize.cols}, minmax(0, 1fr))`;

  return (
    <div
      className="p-2 md:p-4 bg-slate-800/50 rounded-xl shadow-inner shadow-black/30"
    >
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns }}
      >
        {board.map((row, rowIndex) =>
          row.map((level, colIndex) => {
            const cellKey = `${rowIndex},${colIndex}`;
            const isMerging = mergingCells.has(cellKey);
            const isNew = newCell === cellKey;
            const isHint = hintCell !== null && hintCell.row === rowIndex && hintCell.col === colIndex;

            return (
              <button
                key={cellKey}
                onClick={() => onTileClick(rowIndex, colIndex)}
                disabled={level !== 0 || disabled}
                className={`
                  focus:outline-none rounded-lg disabled:cursor-not-allowed
                  transition-all duration-200
                  ${isHint ? 'ring-4 ring-amber-400 ring-inset animate-pulse' : 'focus:ring-2 focus:ring-cyan-400'}
                `}
              >
                <Tile level={level} theme={theme} isMerging={isMerging} isNew={isNew}/>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Board;