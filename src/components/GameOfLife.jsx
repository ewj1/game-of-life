import { useState, useCallback, useEffect } from "react";
import { useImmer } from "use-immer";
import { Board } from "./Board.jsx";

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
  const [showGrid, setShowGrid] = useState(false);
  const [speed, setSpeed] = useState(10);
  const numRows = 150;
  const numCols = 150;
  const [board, setBoard] = useImmer(() => createBoard(numRows, numCols));

  function createBoard(numRows, numCols) {
    return Array.from({ length: numRows }, () =>
      Array.from({ length: numCols }, () => Math.round(Math.random()))
    );
  }

  const updateBoard = useCallback(
    (board) => {
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
    },
    [setBoard]
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateBoard(board);
    }, speed);
    return () => clearInterval(intervalId);
  }, [speed, updateBoard, board]);

  return (
    <>
      <div className="flex justify-center">
        <Board board={board} showGrid={showGrid} />
      </div>
      <button onClick={() => setShowGrid(!showGrid)}>
        {showGrid ? "hide grid" : "show grid"}
      </button>
    </>
  );
}
