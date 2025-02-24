import type { DatasetItem } from "./interfaces/Dataset.interface";

let canvas = document.querySelector("#coordinateCanvas") as any;
const dataset: DatasetItem[] = [
  {
    color: ["pink"],
    data: { a: 13, b: 140, c: 40, d: 10, e: 24 },
  },
  {
    color: ["orange", "yellow"],
    dash: [8, 5],
    data: { a: 18, b: -78, c: 480, d: 150, e: 2, f: 200 },
  },
  {
    color: ["lightyellow"],
    dash: [5, 5],
    pointRadius: 10,
    data: { a: 6, b: -240, c: 80, d: 270, e: 24, f: 51 },
  },
];
const config = {
  dataset: dataset,
  axes: {
    y: {
      lineWidth: 2,
      strokeStyle: "#ccc",
      dash: [5, 5],
    },
    x: {
      strokeStyle: "red",
    },
  },
};
canvas!.options = config;
let horizontal = document.querySelector("#canvas") as any;
horizontal!.options = config;

let line = document.querySelector("#line") as any;
line!.options = config;

let stacked = document.querySelector("#verticalStacked") as any;

stacked!.options = config;

let stackedH = document.querySelector("#horizontalStacked") as any;

stackedH!.options = config;
