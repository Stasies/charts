import { width, height, stepX, stepY, originX, ctx, offset } from "./gridData";

export function drawGrid() {
  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = "#ccc";
  ctx.lineWidth = 1;

  // Draw vertical grid lines
  for (let x = offset; x <= width + offset; x += stepX) {
    console.log(x);
    ctx.beginPath();
    ctx.moveTo(x, height);
    ctx.lineTo(x, 0);
    ctx.stroke();
  }

  // Draw horizontal grid lines
  for (let y = height; y > 0; y -= stepY) {
    ctx.beginPath();
    ctx.moveTo(offset, y);
    ctx.lineTo(width + originX, y);
    ctx.stroke();
  }
}
