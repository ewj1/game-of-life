export function Controls({
  isRunning,
  setIsRunning,
  showGrid,
  setShowGrid,
  setSpeed,
  resetBoard,
}) {
  const MIN_DELAY = 30;
  const MAX_DELAY = 500;
  function handleSpeedChange(value) {
    const pct = Number(value) / 100; // 0 → 1
    const delay = MIN_DELAY + (MAX_DELAY - MIN_DELAY) * (1 - pct);
    setSpeed(delay);
  }
  return (
    <>
      <input
        type="range"
        id="speed"
        min="1"
        max="100"
        onChange={(e) => handleSpeedChange(e.target.value)}
      />
      <label htmlFor="speed">Speed</label>

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
    </>
  );
}
