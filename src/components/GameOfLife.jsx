import { useState, useRef, useEffect } from "react";
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
  const [isRunning, setIsRunning] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [speed, setSpeed] = useState(10);

  const numRows = 150;
  const numCols = 150;
  const [board, setBoard] = useImmer(() => createBoard(numRows, numCols));
  const initBoardRef = useRef(board);
  const speedRef = useRef(null);
  const updateBoardRef = useRef(null);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    updateBoardRef.current = () =>
      setBoard((draft) => {
        for (let i = 0; i < numCols; i++) {
          for (let j = 0; j < numCols; j++) {
            let numNeighbors = 0;
            for (const [x, y] of neighborPositions) {
              if (
                i + x > 0 &&
                i + x < numCols &&
                j + y > 0 &&
                j + y < numRows
              ) {
                numNeighbors += board[i + x][j + y];
              }
            }
            if (board[i][j] === 1) {
              if (numNeighbors > 3 || numNeighbors < 2) {
                draft[i][j] = 0;
              }
            }
            if (board[i][j] === 0) {
              if (numNeighbors === 3) {
                draft[i][j] = 1;
              }
            }
          }
        }
        return draft;
      });
  }, [setBoard, board]);

  useEffect(() => {
    if (!isRunning) return;
    let timeoutId;

    const tick = () => {
      updateBoardRef.current();
      timeoutId = setTimeout(tick, speedRef.current);
    };
    tick();
    return () => clearTimeout(timeoutId);
  }, [isRunning]);

  function createBoard(numRows, numCols) {
    return Array.from({ length: numRows }, () =>
      Array.from({ length: numCols }, () => Math.round(Math.random()))
    );
  }

  return (
    <>
      <div className="flex justify-center">
        <Board board={board} showGrid={showGrid} />
        <Controls
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          showGrid={showGrid}
          setShowGrid={setShowGrid}
          setSpeed={setSpeed}
          resetBoard={() => setBoard(initBoardRef.current)}
        />
      </div>
    </>
  );
}
