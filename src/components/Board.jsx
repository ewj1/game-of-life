import { useRef, useEffect } from "react";

export function Board({ board, showGrid }) {
  const numCols = board[0].length;
  const numRows = board.length;
  const resolution = 3;
  const strokeWidth = 1;
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    //CANVAS SIZING
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = numCols * resolution + 2 * strokeWidth;
    const displayHeight = numRows * resolution + 2 * strokeWidth;
    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    canvas.style.width = displayWidth + "px";
    canvas.style.height = displayHeight + "px";
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = false;

    function draw() {
      //erase
      ctx.clearRect(0, 0, displayWidth, displayHeight);

      //draw cells
      for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
          ctx.fillStyle = board[i][j] ? "black" : "white";

          ctx.fillRect(
            Math.floor(strokeWidth + resolution * i),
            Math.floor(strokeWidth + resolution * j),
            resolution,
            resolution
          );
          if (!showGrid) continue;
          ctx.strokeRect(
            Math.floor(strokeWidth + resolution * i),
            Math.floor(strokeWidth + resolution * j),
            resolution,
            resolution
          );
        }
      }
    }
    draw();
  }, [numCols, numRows, board, showGrid]);

  return (
    <>
      <canvas ref={canvasRef} />
    </>
  );
}
