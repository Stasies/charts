import { stepX, stepY, originX, originY, ctx, stepSize, dataset } from '../gridData'
import type { DatasetItem } from '../interfaces/Dataset.interface';


const clientBarWidth = 30

function drawData(data: DatasetItem, index: number) {
  const barWidth = stepX / dataset.length
  const xOffset = barWidth * index;

  ctx.strokeStyle = data.color;
  ctx.lineWidth = Math.min(barWidth, clientBarWidth);
  ctx.textAlign = "center";

  let count = 0;

  for (let x = originX + xOffset + barWidth / 2; count < Object.keys(data.data).length; x += stepX) {
    const currentValue: number = Object.values(data.data)[count] as number
    const dataHeight = (stepY / stepSize) * currentValue;
    const dataPosition = originY - dataHeight

    ctx.beginPath();
    ctx.moveTo(x, originY);
    ctx.lineTo(x, originY - dataHeight);
    ctx.stroke();

    ctx.fillStyle = data.color
    let textPosition = dataHeight > 0 ? dataPosition - 5 : dataPosition + 12
    ctx.fillText(String(currentValue), x, textPosition);

    count++;
  }
}
export function drawBarChart() {
  dataset.forEach((data, index) => {
    drawData(data, index);
  })
}