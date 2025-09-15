import { useState } from "react";
import { Board } from "./Board.jsx";

export function GameOfLife() {
  const [showGrid, setShowGrid] = useState(true);
  const [board, setBoard] = useState(() => createBoard(20, 20));
  function createBoard(numRows, numCols) {
    return Array.from({ length: numRows }, () =>
      new Array(numCols).fill(Math.round(Math.random()))
    );
  }

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
