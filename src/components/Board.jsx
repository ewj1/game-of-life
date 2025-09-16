import { useRef, useEffect } from "react";

export function Board({ board, showGrid }) {
  const gridSize = board.length;
  const strokeWidth = 0.5;
  const canvasRef = useRef(null);

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

  return (
    <>
      <canvas ref={canvasRef} />
    </>
  );
}
