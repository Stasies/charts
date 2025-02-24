import { width, height, originX, originY, ctx, offset } from './gridData'

export function drawAxes() {
  ctx.strokeStyle = "grey";
  ctx.lineWidth = 2;

  // X-axis
  ctx.beginPath();
  ctx.moveTo(offset, originY);
  ctx.lineTo(width + offset, originY);
  ctx.stroke();

  // Y-axis
  ctx.beginPath();
  ctx.moveTo(originX, height);
  ctx.lineTo(originX, 0);
  ctx.stroke();
}

