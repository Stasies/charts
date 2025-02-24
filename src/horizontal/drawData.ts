import { stepX, stepY, originX, originY, ctx, stepSize, dataset } from '../gridData'
import type { DatasetItem } from '../interfaces/Dataset.interface';

const clientBarWidth = 20

function drawData(data: DatasetItem, index: number) {
  const barWidth = stepY / dataset.length
  const yOffset = barWidth * index;

  ctx.strokeStyle = data.color;
  ctx.lineWidth = Math.min(barWidth, clientBarWidth);
  ctx.fillStyle = data.color

  let count = 0;

  for (let y = 0 + yOffset + barWidth / 2; count < Object.keys(data.data).length; y += stepY) {
    console.log(y)
    const currentValue: number = Object.values(data.data)[count] as number
    const dataWidth = (stepX / stepSize) * currentValue;

    ctx.beginPath();
    ctx.moveTo(originX, y);
    ctx.lineTo(originX + dataWidth, y);
    ctx.stroke();

    ctx.fillText(String(currentValue), originX + dataWidth, y - 10);

    count++;
  }
}

dataset.forEach((data, index) => {
  drawData(data, index);
})