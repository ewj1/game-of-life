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
  const containerRef = useRef(null);
  const isDrawingRef = useRef(false);
  const drawValueRef = useRef(null);
  let resolution;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const size = Math.min(container.clientWidth, window.innerHeight * 0.8);
    resolution = size / gridSize;

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

  function getClickPos(e) {
    setIsRunning(false);
    const x = Math.floor(e.nativeEvent.offsetX / resolution);
    const y = Math.floor(e.nativeEvent.offsetY / resolution);
    return { x, y };
  }

  function toggleCell(x, y) {
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
    updateInitBoardRef();
  }

  function handleMouseLeave() {
    isDrawingRef.current = false;
    drawValueRef.current = null;
    updateInitBoardRef();
  }

  // function getTouchPos(touch) {
  //   const canvas = canvasRef.current;
  //   const rect = canvas.getBoundingClientRect();
  //   const x = Math.floor(((touch.clientX - rect.left) / rect.width) * gridSize);
  //   const y = Math.floor(((touch.clientY - rect.top) / rect.height) * gridSize);
  //   return { x, y };
  // }

  // function handleTouchStart(e) {
  //   e.preventDefault();
  //   isDrawingRef.current = true;
  //   drawValueRef.current = null;
  //   const { x, y } = getTouchPos(e.touches[0]);
  //   toggleCell(x, y);
  // }

  // function handleTouchMove(e) {
  //   e.preventDefault();
  //   if (!isDrawingRef.current) return;
  //   const { x, y } = getTouchPos(e.touches[0]);
  //   toggleCell(x, y);
  // }

  // function handleTouchEnd() {
  //   isDrawingRef.current = false;
  //   drawValueRef.current = null;
  //   updateInitBoardRef();
  // }

  return (
    <>
      <div ref={containerRef}>
        <canvas
          className="cursor-crosshair"
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />
      </div>
    </>
  );
}
