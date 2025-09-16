import { useRef, useEffect } from "react";

export function Board({
  board,
  setBoard,
  showGrid,
  initBoardRef,
  setIsRunning,
}) {
  const gridSize = board.length;
  const strokeWidth = 0.1;
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const drawValueRef = useRef(null);

  useEffect(() => {
    const resolution = 450 / gridSize;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    //CANVAS SIZING
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = 450 + 2 * strokeWidth;
    const displayHeight = 450 + 2 * strokeWidth;
    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    canvas.style.width = displayWidth + "px";
    canvas.style.height = displayHeight + "px";
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
            resolution * i,
            resolution * j,
            resolution + strokeWidth,
            resolution + strokeWidth
          );
          ctx.lineWidth = strokeWidth;
          if (!showGrid) continue;
          ctx.strokeRect(
            resolution * i,
            resolution * j,
            resolution,
            resolution
          );
        }
      }
    }
    draw();
  }, [gridSize, board, showGrid]);

  function updateInitBoardRef() {
    initBoardRef.current = board.map((row) => [...row]);
  }

  function handleCellInteraction(e) {
    setIsRunning(false);

    const resolution = 450 / gridSize;
    const x = Math.floor(e.nativeEvent.offsetX / resolution);
    const y = Math.floor(e.nativeEvent.offsetY / resolution);

    setBoard((draft) => {
      if (drawValueRef.current === null) {
        drawValueRef.current = !draft[x][y];
      }
      draft[x][y] = Number(drawValueRef.current);
    });
  }

  function handleMouseDown(e) {
    isDrawingRef.current = true;
    drawValueRef.current = null;
    handleCellInteraction(e);
  }

  function handleMouseMove(e) {
    if (isDrawingRef.current) {
      handleCellInteraction(e);
    }
  }

  function handleMouseUp() {
    isDrawingRef.current = false;
    drawValueRef.current = null;
    updateInitBoardRef();
  }

  function handleMouseLeave() {
    isDrawingRef.current = false;
    drawValueRef.current = null;
    updateInitBoardRef();
  }
  return (
    <>
      <canvas
        className="cursor-crosshair"
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
    </>
  );
}
