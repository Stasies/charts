import { drawGrid } from "./createGrid";
import { drawAxes } from "./drawAxis";
import { roundToNiceNumber } from "./getNiceNumber";
import type { DatasetItem } from "./interfaces/Dataset.interface";

let vertical = false;

const canvas = document.getElementById("test") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

const dataset: DatasetItem[] = [
  {
    color: "pink",
    data: { a: 13, b: 140, c: 40, d: 10, e: 24 },
  },
  {
    color: "blue",
    data: { a: 18, b: -78, c: 480, d: 150, e: 2, f: 200 },
  },
  {
    color: "orange",
    data: { a: 6, b: -140, c: 80, d: 270, e: 24, f: 51 },
  },
];

const keys: string[] = [
  ...new Set(
    dataset.reduce((arr: string[], item) => {
      arr.push(...Object.keys(item.data));
      return arr;
    }, [])
  ),
];

let minValue = Infinity;
let maxValue = -Infinity;

for (let key of keys) {
  let sum = 0;
  let negativeSum = 0;
  dataset.forEach((data) => {
    if (data.data[key] < 0) {
      negativeSum += data.data[key] || 0;
      if (minValue > negativeSum) {
        minValue = negativeSum;
      }
    } else {
      sum += data.data[key] || 0;
      if (maxValue < sum) {
        maxValue = sum;
      }
    }
  });
}
const range = maxValue - minValue;

const offset = 40;
const width = canvas.width - offset;
const height = canvas.height - offset;

let stepSize = roundToNiceNumber(range / 10);
let numberOfStepsY = Math.max(
  Math.ceil((maxValue - minValue) / stepSize) + 2,
  10
);
const negativeSteps = +roundToNiceNumber(
  Math.abs(minValue / stepSize)
).toFixed();

let stepX: number, stepY: number, originX: number, originY: number;

if (vertical) {
  stepX = width / keys.length;
  stepY = height / numberOfStepsY;

  const negativeSpace = negativeSteps * stepY;

  originX = offset;
  originY = height - negativeSpace;
} else {
  stepX = width / numberOfStepsY;
  stepY = height / keys.length;

  const negativeSpace = negativeSteps * stepX;

  originY = height;
  originX = negativeSpace + offset;
  console.log(negativeSteps, stepX);
}

export {
  width,
  height,
  numberOfStepsY,
  stepX,
  stepY,
  originX,
  originY,
  ctx,
  stepSize,
  offset,
  dataset,
  minValue,
  keys,
};
drawGrid();
drawAxes();
