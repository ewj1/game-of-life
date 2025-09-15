import { useState, useRef, useEffect } from "react";

export function Board({ board, showGrid }) {
  const numCols = board[0].length;
  const numRows = board.length;
  const resolution = 20;
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

        // ctx.strokeRect(
        //   Math.floor(strokeWidth + resolution * i),
        //   Math.floor(strokeWidth + resolution * j),
        //   resolution,
        //   resolution
        // );
      }
    }
  }, [numCols, numRows, board, showGrid]);

  return (
    <>
      <canvas ref={canvasRef} />
    </>
  );
}

// function AnimatedCanvas() {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     let x = 0;
//     let animationFrameId;

//     const render = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       ctx.fillStyle = "blue";
//       ctx.fillRect(x, 50, 50, 50);
//       x = (x + 2) % canvas.width;
//       animationFrameId = requestAnimationFrame(render);
//     };

//     render();

//     return () => cancelAnimationFrame(animationFrameId);
//   }, []);

//   return <canvas ref={canvasRef} width={400} height={200} style={{ border: "1px solid black" }} />;
// }
