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
const bibliostatIBO: DatasetItem[] = [
  {
    label: 'По почте',
    color: ["#FDCF69"],
    data: { 'Адресные': -25, "Тематические": 30, "Уточняющие": 12, "Фактографические": 39, "Краеведческие": 30, "Социально-правовые и вообще много слов": 40 },
  },
  {
    label: 'В сети',
    color: ["#E18141"],
    data: { 'Адресные': 15, "Тематические": 6, "Уточняющие": 35, "Фактографические": 46, "Краеведческие": 30, "Социально-правовые и вообще много слов": 50 },
  },
  {
    label: 'По телефону',
    color: ["#59BBA6"],
    data: { 'Адресные': 65, "Тематические": 26, "Уточняющие": 45, "Фактографические": 16, "Краеведческие": 30, "Социально-правовые и вообще много слов": 60 },
  },
];
const bibliostat: DatasetItem[] = [
  {
    color: ["#1C707D"],
    data: { 'В библиотеке': 15, "Выездное": 6, "Онлайн": 35, "Для лиц с ОВЗ": 16, "Выездное для лиц с ОВЗ": 30 },
  },
  {
    color: ["#19A97B"],
    data: { 'В библиотеке': 9, "Выездное": 23, "Онлайн": 6, "Для лиц с ОВЗ": 20, "Выездное для лиц с ОВЗ": 30 },
  },
  {
    color: ["#82D6E3", "#314B99", "red", "orange"],
    data: { 'В библиотеке': 24, "Выездное": 13, "Онлайн": 124, "Для лиц с ОВЗ": 14, "Выездное для лиц с ОВЗ": 45 },
  },
];
const bibliostat2: DatasetItem[] = [
  {
    color: ["#C2D6FF", "#314B99"],
    data: { 'Выставка': 15, "Индивидуальная консультация": -6, "Групповое обучение": 35, "Лекция": 16, "Дополнительное обучение": 30 },
  },
];
const iboConfig = {
  dataset: bibliostatIBO,
  barThickness: 6,
  borderRadius: 6,
  dataLabels: {
    position: 'end top'
  },
  axes: {
    y: {
      labels: {
        fillStyle: "#7D8187",
        font: "12px sans-serif",
      }
    },
    x: {
      strokeStyle: "#D2D4D6",
      dash: [3, 3],
      labels: {
        textAlign: "center",
        fillStyle: "#7D8187",
        font: "12px sans-serif",
      }
    },
  },

}

const config = {
  dataset: [{
    color: ["#C2D6FF", "#314B99"],
    data: { 'Выставка': 15, "Индивидуальная консультация": 10 },
  }],
};

canvas!.options = iboConfig;

let line = document.querySelector("#line") as any;
line!.options = config;

const bibilostatConfig = {
  dataset: bibliostat,
  barThickness: 12,
  borderRadius: 8,
  dataLabels: {
    fillStyle: 'black',
    position: 'center top'
  },
  axes: {
    y: {
      offset: 40,
      fillStyle: "pink",
      strokeStyle: "#F4F4F5",
      labels: {
        fillStyle: "#16191D",
        font: "14px sans-serif",
        textBaseline: 'middle',
        textAlign: "start"
      },
    },
    x: {
      offset: 40,
      grid: false,
      labels: {
        fillStyle: '#C4C4C4',
        font: "12px sans-serif",
        textAlign: 'center'
      }
    },
  },
}

const bibilostatConfig2 = {
  dataset: bibliostat2,
  barThickness: 10,
  borderRadius: 10,
  dataLabels: {
    position: 'end top',
    fillStyle: '#314B99'
  },
  axes: {
    y: {
      fillStyle: "pink",
      strokeStyle: "#F4F4F5",
      labels: {
        fillStyle: "#16191D",
        font: "14px sans-serif",
        textBaseline: 'middle'
      },
    },
    x: {
      grid: false,
      labels: {
        fillStyle: '#C4C4C4',
        font: "12px sans-serif",
        textAlign: 'center'
      }
    },
  },
}
let stackedH = document.querySelector("#horizontalStacked") as any;

stackedH!.options = bibilostatConfig;

let stacked = document.querySelector("#verticalStacked") as any;

stacked!.options = bibilostatConfig;

let horizontal = document.querySelector("#canvas") as any;
horizontal!.options = bibilostatConfig2;