export function Controls({
  isRunning,
  setIsRunning,
  showGrid,
  setShowGrid,
  handleSpeedChange,
  handleGridSizeChange,
  resetBoard,
  clearBoard,
  handleWrapChange,
}) {
  return (
    <>
      <div className="flex flex-col align-center">
        <div>
          <input
            type="range"
            id="speed"
            min="1"
            max="100"
            onChange={(e) => {
              handleSpeedChange(e.target.value);
            }}
            defaultValue="75"
          />
          <label htmlFor="speed">Speed</label>
        </div>

        <button onClick={() => setShowGrid(!showGrid)}>
          {showGrid ? "hide grid" : "show grid"}
        </button>

        <button onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? "pause" : "play"}
        </button>

        <button
          onClick={() => {
            setIsRunning(false);
            resetBoard();
          }}
        >
          Reset board
        </button>
        <button
          onClick={() => {
            setIsRunning(false);
            setShowGrid(true);
            clearBoard();
          }}
        >
          Clear board
        </button>
        <div>
          <input
            id="wrapWalls"
            type="checkbox"
            onChange={() => handleWrapChange()}
          />
          <label htmlFor="wrapWalls">Wrap walls</label>
        </div>
        <div>
          <input
            type="range"
            id="gridSize"
            min="10"
            max="200"
            onChange={(e) => {
              handleGridSizeChange(e.target.value);
            }}
          />
          <label htmlFor="gridSize">Grid size</label>
        </div>
      </div>
    </>
  );
}
