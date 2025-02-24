import { height, stepX, stepY, originX, originY, ctx, stepSize, dataset } from '../gridData'
import type { DatasetItem } from '../interfaces/Dataset.interface';

function drawData(data: DatasetItem) {
  ctx.strokeStyle = data.color;
  ctx.lineWidth = 1.5;

  let index = 0;
  let prevValue = originY

  for (let x = originX; index <= Object.keys(data.data).length; x += stepX) {
    const currentValue: number = Object.values(data.data)[index] as number
    const dataHeight = (stepY / stepSize) * currentValue;
    let xPosition = x + stepX
    let yPosition = originY - dataHeight

    // draw lines
    ctx.beginPath();
    ctx.moveTo(x, prevValue);
    ctx.lineTo(xPosition, yPosition);
    ctx.stroke();

    //draw circle
    ctx.beginPath();
    ctx.arc(xPosition, yPosition, 3, 0, Math.PI * 2);
    ctx.fillStyle = data.color;
    ctx.fill();

    //add data value
    ctx.fillStyle = data.color
    ctx.fillText(String(currentValue), xPosition + 5, yPosition);

    prevValue = yPosition
    index++;
  }
}

dataset.forEach((data) => {
  drawData(data);
})