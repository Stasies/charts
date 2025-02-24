
import { stepX, stepY, originX, originY, ctx, stepSize, dataset, keys, height } from '../gridData'
const xLabelPosition = stepX / 2 + originX

export function drawLabels() {
  ctx.fillStyle = "#000";
  ctx.font = "14px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  // X-axis labels
  let position = xLabelPosition
  for (let item of keys) {
    let label = item
    ctx.fillText(label, position, height + 5);
    position += stepX
  }

  // Y-axis labels > 0
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  let positiveLabel = 0
  for (let y = height - originY; y < height; y += stepY) {
    ctx.fillText(String(positiveLabel), originX - 5, height - y);

    positiveLabel += stepSize
  }

  // Y-axis labels < 0
  let negativeLabel = 0
  for (let y = originY; y <= height; y += stepY) {
    if (y !== originY) {
      ctx.fillText(String(negativeLabel), originX - 5, y);
    }
    negativeLabel -= stepSize
  }
}