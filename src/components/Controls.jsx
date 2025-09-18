export function Controls({ isRunning, showGrid, wrapWalls, dispatch }) {
  return (
    <div className="flex flex-col items-center space-y-6 p-6 ml-8 bg-white text-black border-black rounded-none shadow-none min-w-[260px]">
      {/* Speed Control */}
      <div className="w-full space-y-1">
        <label
          htmlFor="speed"
          className="block text-xs uppercase tracking-wider"
        >
          Speed
        </label>
        <input
          type="range"
          id="speed"
          min="1"
          max="100"
          defaultValue="75"
          onChange={(e) =>
            dispatch({ type: "set_speed", value: Number(e.target.value) })
          }
          className="w-full h-1 bg-gray-700 cursor-pointer"
        />
      </div>

      {/* Main Controls */}
      <div className="flex flex-col space-y-2 w-full">
        <button
          onClick={() =>
            dispatch({ type: "toggle_running", value: !isRunning })
          }
          className={`px-4 py-2 border border-black uppercase tracking-wide 
                     transition-colors duration-200 ${
                       isRunning
                         ? "bg-white text-black"
                         : "bg-black text-white hover:bg-white hover:text-black"
                     }`}
        >
          {isRunning ? "Pause" : "Play"}
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => dispatch({ type: "reset_board" })}
            className="px-2 py-1 border border-white uppercase text-xs hover:bg-white hover:text-black"
          >
            Reset
          </button>

          <button
            onClick={() => dispatch({ type: "clear_board" })}
            className="px-2 py-1 border border-white uppercase text-xs hover:bg-white hover:text-black"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Toggle Controls */}
      <div className="flex flex-col space-y-3 w-full">
        <label className="flex items-center justify-between cursor-pointer text-xs uppercase tracking-wider">
          <span>Show Grid</span>
          <input
            type="checkbox"
            checked={showGrid}
            onChange={() => dispatch({ type: "toggle_grid" })}
            className="appearance-none w-3 h-3 border border-black bg-white checked:bg-black checked:border-black"
            // className="form-checkbox rounded-none accent-white"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer text-xs uppercase tracking-wider">
          <span>Wrap Walls</span>
          <input
            type="checkbox"
            checked={wrapWalls}
            onChange={() => dispatch({ type: "toggle_wrap" })}
            className="appearance-none w-3 h-3 border border-black bg-white checked:bg-black checked:border-black"
          />
        </label>
      </div>

      {/* Grid Size Control */}
      <div className="w-full space-y-1">
        <label
          htmlFor="gridSize"
          className="block text-xs uppercase tracking-wider"
        >
          Grid Size
        </label>
        <input
          type="range"
          id="gridSize"
          min="10"
          max="200"
          onChange={(e) =>
            dispatch({ type: "set_grid_size", value: Number(e.target.value) })
          }
          className="w-full h-1 bg-gray-700 cursor-pointer"
        />
      </div>
    </div>
  );
}
