import React, { useState, useCallback } from 'react';
import Board from './components/Board';
import Controls from './components/Controls';
import GameOverModal from './components/GameOverModal';
import { useGameLogic } from './hooks/useGameLogic';
import { ThemeName, BoardSize, GameStatus } from './types';
import { THEMES } from './constants';

const App: React.FC = () => {
  const [themeName, setThemeName] = useState<ThemeName>(ThemeName.Animals);
  const [currentBoardSize, setCurrentBoardSize] = useState<BoardSize>({ rows: 6, cols: 6 });

  const {
    board,
    nextTile,
    score,
    highestTile,
    gameStatus,
    mergingCells,
    newCell,
    hintCell,
    handleTilePlacement,
    startNewGame,
    undoMove,
    showHint,
  } = useGameLogic(currentBoardSize);

  const handleThemeChange = (newTheme: ThemeName) => {
    setThemeName(newTheme);
  };

  const handleBoardSizeChange = (newSize: BoardSize) => {
    setCurrentBoardSize(newSize);
    startNewGame(newSize);
  };

  const handlePlayAgain = useCallback(() => {
    startNewGame(currentBoardSize);
  }, [startNewGame, currentBoardSize]);

  const currentTheme = THEMES[themeName];
  const isBoardDisabled = mergingCells.size > 0 || gameStatus === GameStatus.GameOver;

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row items-center justify-center gap-4 lg:gap-8 p-4">
      {gameStatus === GameStatus.GameOver && (
        <GameOverModal score={score} onPlayAgain={handlePlayAgain} />
      )}
      <div className="w-full md:w-auto flex justify-center">
        <Controls
          score={score}
          highestTile={highestTile}
          nextTile={nextTile}
          currentTheme={currentTheme}
          currentBoardSize={currentBoardSize}
          onNewGame={startNewGame}
          onUndo={undoMove}
          onShowHint={showHint}
          onThemeChange={handleThemeChange}
          onBoardSizeChange={handleBoardSizeChange}
        />
      </div>
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
        {board.length > 0 && (
          <Board
            board={board}
            boardSize={currentBoardSize}
            theme={currentTheme}
            onTileClick={handleTilePlacement}
            mergingCells={mergingCells}
            newCell={newCell}
            hintCell={hintCell}
            disabled={isBoardDisabled}
          />
        )}
      </div>
    </div>
  );
};

export default App;