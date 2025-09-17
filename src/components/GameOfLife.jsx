import { useState, useRef, useEffect, useCallback } from "react";
import { useImmer } from "use-immer";

import { Board } from "./Board.jsx";
import { Controls } from "./Controls.jsx";

const neighborPositions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

export function GameOfLife() {
  const [isRunning, setIsRunning] = useState(false);
  const [gridSize, setGridSize] = useState(100);
  const [showGrid, setShowGrid] = useState(false);
  const [speed, setSpeed] = useState(147.5);
  const [wrapWalls, setWrapWalls] = useState(false);
  const [board, setBoard] = useImmer(() => createBoard(gridSize));
  const initBoardRef = useRef(board);
  const speedRef = useRef(null);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const updateBoard = useCallback(() => {
    setBoard((draft) => {
      const prevBoard = draft.map((row) => [...row]);
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const numNeighbors = neighborPositions.reduce((count, [dx, dy]) => {
            let ni = i + dx;
            let nj = j + dy;
            if (wrapWalls) {
              ni = wrap(ni, gridSize);
              nj = wrap(nj, gridSize);
            }
            if (ni >= 0 && ni < gridSize && nj >= 0 && nj < gridSize) {
              count += prevBoard[ni][nj];
            }
            return count;
          }, 0);

          if (prevBoard[i][j] === 1) {
            if (numNeighbors > 3 || numNeighbors < 2) {
              draft[i][j] = 0;
            }
          }
          if (prevBoard[i][j] === 0) {
            if (numNeighbors === 3) {
              draft[i][j] = 1;
            }
          }
        }
      }
      return draft;
    });
  }, [setBoard, wrapWalls, gridSize]);

  useEffect(() => {
    if (!isRunning) return;
    let timeoutId;

    const tick = () => {
      updateBoard();
      timeoutId = setTimeout(tick, speedRef.current);
    };
    tick();
    return () => clearTimeout(timeoutId);
  }, [updateBoard, isRunning]);

  function createBoard(gridSize, { blank = false } = {}) {
    if (blank)
      return Array.from({ length: gridSize }, () =>
        Array.from({ length: gridSize }, () => 0)
      );
    return Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => Math.round(Math.random()))
    );
  }

  function wrap(val, max) {
    return (val + max) % max;
  }

  const MIN_DELAY = 30;
  const MAX_DELAY = 500;
  function handleSpeedChange(value) {
    const pct = Number(value) / 100; // 0 → 1
    const delay = MIN_DELAY + (MAX_DELAY - MIN_DELAY) * (1 - pct);
    setSpeed(delay);
  }

  const handleGridSizeChange = (val) => {
    const size = Number(val);
    setIsRunning(false);
    setGridSize(size);
    const newBoard = createBoard(size);
    setBoard(newBoard); // immediately create a new board
    initBoardRef.current = newBoard; // update initial snapshot if needed
  };

  return (
    <>
      <div className="flex justify-center">
        <Board
          board={board}
          setBoard={setBoard}
          showGrid={showGrid}
          initBoardRef={initBoardRef}
          setIsRunning={setIsRunning}
        />
        <Controls
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          showGrid={showGrid}
          setShowGrid={setShowGrid}
          handleSpeedChange={handleSpeedChange}
          handleGridSizeChange={handleGridSizeChange}
          resetBoard={() => setBoard(initBoardRef.current)}
          clearBoard={() => setBoard(createBoard(gridSize, { blank: true }))}
          wrapWalls={wrapWalls}
          setWrapWalls={setWrapWalls}
        />
      </div>
    </>
  );
}
