import { useState, useCallback, useEffect } from 'react';
import { Board, TileValue, BoardSize, GameStatus, HistoryEntry } from '../types';

export const useGameLogic = (initialSize: BoardSize) => {
  const [board, setBoard] = useState<Board>([]);
  const [boardSize, setBoardSize] = useState<BoardSize>(initialSize);
  const [nextTile, setNextTile] = useState<TileValue>(1);
  const [score, setScore] = useState(0);
  const [highestTile, setHighestTile] = useState(1);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.Playing);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [mergingCells, setMergingCells] = useState<Set<string>>(new Set());
  const [newCell, setNewCell] = useState<string | null>(null);
  const [hintCell, setHintCell] = useState<{ row: number; col: number } | null>(null);

  const createEmptyBoard = useCallback((size: BoardSize): Board => {
    return Array.from({ length: size.rows }, () => Array(size.cols).fill(0));
  }, []);

  const generateNextTile = useCallback(() => {
    // Always generate a level 1 tile
    setNextTile(1);
  }, []);
  
  const startNewGame = useCallback((size: BoardSize) => {
    setBoardSize(size);
    const newBoard = createEmptyBoard(size);

    // Helper to place tiles randomly on the board
    const placeRandomTile = (board: Board, value: TileValue): boolean => {
      const emptyCells: { row: number; col: number }[] = [];
      board.forEach((row, r) => {
        row.forEach((_, c) => {
          if (board[r][c] === 0) {
            emptyCells.push({ row: r, col: c });
          }
        });
      });

      if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const { row, col } = emptyCells[randomIndex];
        board[row][col] = value;
        return true;
      }
      return false; // No space left
    };

    // Place one level 2 and one level 3 tile at the start
    placeRandomTile(newBoard, 2);
    placeRandomTile(newBoard, 3);
    
    setBoard(newBoard);
    setScore(0);
    setHighestTile(3); // The highest tile on the board is now 3
    setGameStatus(GameStatus.Playing);
    setHistory([]);
    setHintCell(null);
    generateNextTile();
  }, [createEmptyBoard, generateNextTile]);

  useEffect(() => {
    startNewGame(boardSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const findMergeCluster = (currentBoard: Board, startRow: number, startCol: number, tileValue: TileValue) => {
    if (tileValue === 0) return [];

    const cluster: { row: number; col: number }[] = [];
    const queue = [{ row: startRow, col: startCol }];
    const visited = new Set<string>([`${startRow},${startCol}`]);
    cluster.push({ row: startRow, col: startCol });

    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    while (queue.length > 0) {
      const { row, col } = queue.shift()!;
      for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        const key = `${newRow},${newCol}`;
        if (
          newRow >= 0 && newRow < boardSize.rows &&
          newCol >= 0 && newCol < boardSize.cols &&
          currentBoard[newRow][newCol] === tileValue &&
          !visited.has(key)
        ) {
          visited.add(key);
          queue.push({ row: newRow, col: newCol });
          cluster.push({ row: newRow, col: newCol });
        }
      }
    }
    return cluster;
  };

  const handleTilePlacement = useCallback(async (row: number, col: number) => {
    if (gameStatus !== GameStatus.Playing || board[row]?.[col] !== 0) {
      return;
    }
    setHintCell(null); // Clear hint on move

    setHistory(prev => [...prev, { board, score, highestTile }]);

    let currentBoard = board.map(r => [...r]);
    currentBoard[row][col] = nextTile;
    
    setBoard(currentBoard); // Show initial placement

    let placedTileLevel = nextTile;
    let placedRow = row;
    let placedCol = col;
    let comboMultiplier = 1;
    let scoreToAdd = 0;

    while (true) {
        const cluster = findMergeCluster(currentBoard, placedRow, placedCol, placedTileLevel);
        
        if (cluster.length >= 3) {
            scoreToAdd += cluster.length * placedTileLevel * comboMultiplier;
            
            const clusterKeys = new Set(cluster.map(c => `${c.row},${c.col}`));
            setMergingCells(clusterKeys);
            
            await new Promise(resolve => setTimeout(resolve, 200)); // Animation delay

            const newBoard = currentBoard.map(r => [...r]);
            cluster.forEach(cell => {
                newBoard[cell.row][cell.col] = 0;
            });
            
            placedTileLevel++;
            newBoard[placedRow][placedCol] = placedTileLevel;
            currentBoard = newBoard;

            setBoard(currentBoard);
            setMergingCells(new Set());
            setNewCell(`${placedRow},${placedCol}`);
            await new Promise(resolve => setTimeout(resolve, 100)); // New tile pop animation
            setNewCell(null);

            comboMultiplier++;
        } else {
            break; // No more merges in this chain
        }
    }
    
    setScore(s => s + scoreToAdd);
    const newHighest = Math.max(highestTile, placedTileLevel);
    setHighestTile(newHighest);

    generateNextTile();

    // Check for game over
    const isBoardFull = !currentBoard.flat().some(cell => cell === 0);
    if (isBoardFull) {
        setGameStatus(GameStatus.GameOver);
    }

  }, [board, nextTile, gameStatus, score, highestTile, boardSize, generateNextTile]);
  
  const undoMove = useCallback(() => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setBoard(lastState.board);
      setScore(lastState.score);
      setHighestTile(lastState.highestTile);
      setHistory(h => h.slice(0, -1));
      setGameStatus(GameStatus.Playing);
      setHintCell(null);
    }
  }, [history]);

  const showHint = useCallback(() => {
    let bestMove: { move: { row: number; col: number } | null, clusterSize: number } = { move: null, clusterSize: 0 };

    for (let r = 0; r < boardSize.rows; r++) {
        for (let c = 0; c < boardSize.cols; c++) {
            if (board[r][c] === 0) { // Check only empty cells
                const tempBoard = board.map(row => [...row]);
                tempBoard[r][c] = nextTile;

                const cluster = findMergeCluster(tempBoard, r, c, nextTile);

                if (cluster.length >= 3 && cluster.length > bestMove.clusterSize) {
                    bestMove = { move: { row: r, col: c }, clusterSize: cluster.length };
                }
            }
        }
    }

    if (bestMove.move) {
        setHintCell(bestMove.move);
    }
    // If no move is found, do nothing. The user can try placing anywhere.
  }, [board, boardSize.rows, boardSize.cols, nextTile, findMergeCluster]);

  return {
    board,
    boardSize,
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
  };
};