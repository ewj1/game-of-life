import { useRef, useEffect, useReducer } from "react";

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

function createBoard(gridSize, { blank = false } = {}) {
  if (blank) {
    return Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => 0)
    );
  }
  return Array.from({ length: gridSize }, () =>
    Array.from({ length: gridSize }, () => Math.round(Math.random()))
  );
}

function wrap(val, max) {
  return (val + max) % max;
}

const initialState = {
  board: createBoard(100),
  nextBoard: createBoard(100, { blank: true }),
  gridSize: 100,
  isRunning: false,
  showGrid: false,
  delay: 147.5,
  wrapWalls: false,
  shouldUpdateInitBoard: false,
  shouldResetBoard: false,
};

function gameReducer(state, action) {
  switch (action.type) {
    case "toggle_running":
      return { ...state, isRunning: action.value };

    case "set_grid_size": {
      const size = Number(action.value);
      return {
        ...state,
        isRunning: false,
        gridSize: size,
        board: createBoard(size),
        nextBoard: createBoard(size, { blank: true }),
        shouldUpdateInitBoard: true,
      };
    }

    case "user_finished_editing":
      return { ...state, shouldUpdateInitBoard: true };

    case "clear_update_flag":
      return { ...state, shouldUpdateInitBoard: false };

    case "set_board":
      return { ...state, board: action.board };

    case "set_speed": {
      const MIN_DELAY = 5;
      const MAX_DELAY = 500;
      const pct = Number(action.value) / 100; // 0 → 1
      const delay = MIN_DELAY + (MAX_DELAY - MIN_DELAY) * (1 - pct);
      return { ...state, delay };
    }

    case "toggle_wrap":
      return { ...state, wrapWalls: !state.wrapWalls };

    case "toggle_grid":
      return { ...state, showGrid: !state.showGrid };

    case "update_board": {
      const prevBoard = state.board;
      const nextBoard = state.nextBoard.map((row) => [...row]); // copy if immutable

      for (let i = 0; i < state.gridSize; i++) {
        for (let j = 0; j < state.gridSize; j++) {
          const numNeighbors = neighborPositions.reduce((count, [dx, dy]) => {
            let ni = i + dx;
            let nj = j + dy;
            if (state.wrapWalls) {
              ni = wrap(ni, state.gridSize);
              nj = wrap(nj, state.gridSize);
            }
            if (
              ni >= 0 &&
              ni < state.gridSize &&
              nj >= 0 &&
              nj < state.gridSize
            ) {
              count += prevBoard[ni][nj];
            }
            return count;
          }, 0);

          if (prevBoard[i][j] === 1) {
            nextBoard[i][j] = numNeighbors === 2 || numNeighbors === 3 ? 1 : 0;
          } else {
            nextBoard[i][j] = numNeighbors === 3 ? 1 : 0;
          }
        }
      }

      return { ...state, board: nextBoard, nextBoard: prevBoard };
    }

    case "reset_board":
      return { ...state, isRunning: false, shouldResetBoard: true };

    case "clear_reset_flag":
      return { ...state, shouldResetBoard: false };

    case "clear_board":
      return {
        ...state,
        isRunning: false,
        board: createBoard(state.gridSize, { blank: true }),
        nextBoard: createBoard(state.gridSize, { blank: true }),
        showGrid: true,
      };

    case "toggle_cell": {
      const { x, y } = action.pos;
      const newBoard = state.board.map((row) => [...row]);
      newBoard[x][y] = Number(action.value);
      return { ...state, board: newBoard };
    }

    default:
      return state;
  }
}

export function GameOfLife() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const initBoardRef = useRef(initialState.board.map((row) => [...row]));
  const delayRef = useRef(null);

  useEffect(() => {
    if (state.shouldUpdateInitBoard) {
      initBoardRef.current = state.board.map((row) => [...row]);
      dispatch({ type: "clear_update_flag" });
    }
  }, [state.shouldUpdateInitBoard, state.board]);

  useEffect(() => {
    if (state.shouldResetBoard) {
      const resetBoard = initBoardRef.current.map((row) => [...row]);
      dispatch({ type: "set_board", board: resetBoard });
      dispatch({ type: "clear_reset_flag" });
    }
  }, [state.shouldResetBoard]);

  useEffect(() => {
    delayRef.current = state.delay;
  }, [state.delay]);

  useEffect(() => {
    if (!state.isRunning) return;
    let timeoutId;

    const tick = () => {
      dispatch({ type: "update_board" });
      timeoutId = setTimeout(tick, delayRef.current);
    };
    tick();
    return () => clearTimeout(timeoutId);
  }, [state.isRunning]);

  return (
    <div className="flex flex-col md:flex-row justify-center items-start gap-4">
      <Board
        className="w-full max-w-screen-sm"
        board={state.board}
        isRunning={state.isRunning}
        showGrid={state.showGrid}
        dispatch={dispatch}
      />
      <Controls
        className="w-full max-w-screen-sm"
        isRunning={state.isRunning}
        showGrid={state.showGrid}
        wrapWalls={state.wrapWalls}
        dispatch={dispatch}
      />
    </div>
  );
}
