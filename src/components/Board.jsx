import { useRef, useEffect } from "react";

export function Board({ board, showGrid, dispatch }) {
  const gridSize = board.length;
  const strokeWidth = 0.1;
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const isDrawingRef = useRef(false);
  const drawValueRef = useRef(null);
  const resolutionRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const size = Math.min(container.clientWidth, window.innerHeight * 0.8);
    resolutionRef.current = size / gridSize;

    //CANVAS SIZING
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = size + 2 * strokeWidth;
    const displayHeight = size + 2 * strokeWidth;

    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    canvas.style.width = displayWidth + "px";
    canvas.style.height = displayHeight + "px";

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;

    function draw() {
      //erase
      ctx.clearRect(0, 0, displayWidth, displayHeight);

      //draw cells
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          ctx.fillStyle = board[i][j] ? "black" : "white";

          ctx.fillRect(
            resolutionRef.current * i,
            resolutionRef.current * j,
            resolutionRef.current + strokeWidth,
            resolutionRef.current + strokeWidth
          );
          ctx.lineWidth = strokeWidth;
          if (!showGrid) continue;
          ctx.strokeRect(
            resolutionRef.current * i,
            resolutionRef.current * j,
            resolutionRef.current,
            resolutionRef.current
          );
        }
      }
    }
    draw();
  }, [gridSize, board, showGrid]);

  function toggleCell(x, y) {
    if (drawValueRef.current === null) {
      drawValueRef.current = !board[x][y];
    }
    dispatch({
      type: "toggle_cell",
      pos: { x, y },
      value: Number(drawValueRef.current),
    });
  }

  function getClickPos(e) {
    dispatch({ type: "toggle_running", value: false });
    const x = Math.floor(e.nativeEvent.offsetX / resolutionRef.current);
    const y = Math.floor(e.nativeEvent.offsetY / resolutionRef.current);
    return { x, y };
  }

  function handleMouseDown(e) {
    isDrawingRef.current = true;
    drawValueRef.current = null;
    const { x, y } = getClickPos(e);
    toggleCell(x, y);
  }

  function handleMouseMove(e) {
    if (isDrawingRef.current) {
      const { x, y } = getClickPos(e);
      toggleCell(x, y);
    }
  }

  function handleMouseUp() {
    isDrawingRef.current = false;
    drawValueRef.current = null;
  }

  function handleMouseLeave() {
    isDrawingRef.current = false;
    drawValueRef.current = null;
    dispatch({ type: "user_finished_editing" });
  }

  function getTouchPos(touch) {
    dispatch({ type: "toggle_running", value: false });
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((touch.clientX - rect.left) / rect.width) * gridSize);
    const y = Math.floor(((touch.clientY - rect.top) / rect.height) * gridSize);
    return { x, y };
  }

  function handleTouchStart(e) {
    isDrawingRef.current = true;
    drawValueRef.current = null;
    const { x, y } = getTouchPos(e.touches[0]);
    toggleCell(x, y);
  }

  function handleTouchMove(e) {
    if (!isDrawingRef.current) return;
    const { x, y } = getTouchPos(e.touches[0]);
    toggleCell(x, y);
  }

  function handleTouchEnd() {
    isDrawingRef.current = false;
    drawValueRef.current = null;
    dispatch({ type: "user_finished_editing" });
  }

  return (
    <>
      <div ref={containerRef}>
        <canvas
          className="cursor-crosshair touch-none"
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>
    </>
  );
}
