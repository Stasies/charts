import { width, stepX, stepY, originX, originY, ctx, stepSize, offset, keys } from '../gridData'

function drawLabelsHorizontal() {
  ctx.fillStyle = "grey";
  ctx.font = "14px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  //Y-axis labels
  let position = 0 + stepY / 2
  for (let item of keys) {
    let label = item
    ctx.fillText(label, offset - 10, position);
    position += stepY
  }

  //X-axis labels > 0
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  let positiveLabel = 0
  for (let x = originX; x < width; x += stepX) {
    ctx.fillText(String(positiveLabel), x, originY + 5);
    positiveLabel += stepSize
  }

  //X-axis labels < 0
  let negativeLabel = 0
  for (let x = originX; x > offset; x -= stepX) {
    ctx.fillText(String(negativeLabel), x, originY + 5);
    negativeLabel -= stepSize
  }
}
drawLabelsHorizontal()