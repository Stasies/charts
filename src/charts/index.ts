import type { DatasetItem, Config, Axes } from "../interfaces/Dataset.interface";
const writableProperties: (keyof CanvasRenderingContext2D)[] = [
  "font", "fillStyle", "textAlign", "textBaseline", "lineWidth", "lineCap", "lineJoin", "miterLimit", "shadowOffsetX", "shadowOffsetY", "shadowBlur", "shadowColor"
  // Add other writable properties here as needed
];

export class Chart extends HTMLElement {
  _data: DatasetItem[] = [];
  range: number = 0;
  offsetX: number = 20;
  offsetY: number = 40;
  width: number;
  height: number;
  stepSize: number = 0;
  numberOfSteps: number = 0;
  negativeSteps: number = 0;
  maxValue: number = -Infinity;
  minValue: number = Infinity;
  keys: string[] = [];
  ctx: CanvasRenderingContext2D;
  clientBarWidth: number = 20;
  borderRadius: number = 0;
  dataLabels: { [key: string]: string | boolean | number } = {}
  axes: Axes = {};
  steps: number[] = [];

  constructor() {
    super();
    this.ctx = (this.querySelector("canvas") as HTMLCanvasElement).getContext(
      "2d"
    )!;
    this.width = this.ctx?.canvas.width;
    this.height = this.ctx?.canvas.height - this.offsetY;
  }
  set options(options: Config) {
    this._data = options.dataset;
    this.axes = options.axes || {};
    if (this._data) {
      this.calculateRange();
      this.calculateSteps();
    }
    this.clientBarWidth = options.barThickness || 20
    this.dataLabels = options.dataLabels || {}
    this.borderRadius = options.borderRadius || 0
  }
  get chartDataset() {
    return this._data;
  }
  calculateRange() {
    this.keys = [
      ...new Set(this._data.flatMap((item) => Object.keys(item.data))),
    ];
    let values = [
      ...new Set(this._data.flatMap((item) => Object.values(item.data))),
    ];
    this.minValue = Math.min(...values)
    this.maxValue = Math.max(...values)
    this.range = this.maxValue - this.minValue;
  }
  calculateSteps() {
    this.stepSize = this.roundToNiceNumber(this.range / 10);
    this.numberOfSteps = Math.ceil((this.maxValue - this.minValue) / this.stepSize) + 2

    if (this.minValue < 0) {
      this.negativeSteps = +this.roundToNiceNumber(
        Math.abs(this.minValue / this.stepSize)
      ).toFixed() || 0;
    }
    this.steps = Array.from(
      { length: this.numberOfSteps },
      (_, i) => -this.negativeSteps * this.stepSize + i * this.stepSize
    );
  }
  roundToNiceNumber(num: number) {
    const magnitude = Math.pow(10, Math.floor(Math.log10(num)));
    const normalized = num / magnitude;
    let rounded = Math.ceil(normalized);

    return rounded * magnitude;
  }
  drawGrid(stepX: number, stepY: number, originX: number, originY: number) {
    // Draw vertical grid lines
    if (this.axes?.y?.grid !== false) {
      this.ctx.strokeStyle = this.axes?.y?.strokeStyle || "#ccc";
      this.ctx.lineWidth = this.axes?.y?.lineWidth || 1;
      this.ctx.setLineDash(this.axes?.y?.dash || []);
      for (let x = this.offsetX; x <= this.width + this.offsetX; x += stepX) {
        if (x !== originX) {
          this.drawLine(x, this.height, x, 0);
        }
      }
      this.ctx.setLineDash([]);
    }

    // Draw horizontal grid lines
    if (this.axes?.x?.grid !== false) {
      this.ctx.strokeStyle = this.axes?.x?.strokeStyle || "#ccc";
      this.ctx.lineWidth = this.axes?.x?.lineWidth || 1;
      this.ctx.setLineDash(this.axes?.x?.dash || []);
      for (let y = this.height; y > 0; y -= stepY) {
        if (Math.ceil(y) !== Math.ceil(originY)) {
          this.drawLine(this.offsetX, y, this.width + originX, y);
        }
      }
      this.ctx.setLineDash([]);
    }
  }
  drawAxes(x: number, y: number) {
    this.ctx.strokeStyle = "#ccc";
    this.ctx.lineWidth = 1;

    // X-axis
    this.drawLine(this.offsetX, y, this.width + this.offsetX, y);

    // Y-axis
    this.drawLine(x, this.height, x, 0);
  }
  drawLabels(
    position: number,
    labels: string[] | number[],
    step: number,
    axis: string
  ) {

    if (this.axes[axis]?.labels) {
      for (let property in this.axes[axis]?.labels) {
        if (writableProperties.includes(property as keyof CanvasRenderingContext2D)) {
          (this.ctx as any)[property] = this.axes[axis]?.labels[property]
        }
      }
    }
    for (let item of labels) {
      let wrappedText
      if (axis == "y") {
        wrappedText = this.wrapText(String(item), 0, position, this.offsetX)
      } else {
        wrappedText = this.wrapText(String(item), position, this.height + 15, step)
      }
      wrappedText.forEach((item) => this.ctx.fillText(String(item[0]), +item[1], +item[2]))
      position += step;
    }

  }
  drawLine(x0: number, y0: number, x1: number, y1: number, color?: string[]) {
    if (color) {
      this.ctx.strokeStyle = this.getBackgroundGradient(x0, y0, x1, y1, color);
    }
    this.ctx.beginPath();
    this.ctx.moveTo(x0, y0);
    this.ctx.lineTo(x1, y1);
    this.ctx.stroke();
  }
  drawRoundedLine(x0: number, y0: number, width: number, height: number, radius: any, color: string[]) {
    this.ctx.lineWidth = 1
    if (color) {
      this.ctx.strokeStyle = this.getBackgroundGradient(x0, y0, this.width, height, color);
      this.ctx.fillStyle = this.getBackgroundGradient(x0, y0, this.width, height, color)
    }
    this.ctx.beginPath();
    this.ctx.moveTo(x0, y0);
    this.ctx.roundRect(x0, y0, width, height, radius);
    this.ctx.stroke();
    this.ctx.fill();
  }
  getBackgroundGradient(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    color: string[]
  ) {
    let gradient = this.ctx.createLinearGradient(x0, y0, x1, y1 || y0);
    color.forEach((clr, index) => {
      gradient.addColorStop(index / color.length, clr);
    });
    return gradient;
  }
  wrapText(text: string, x: number, y: number, maxWidth: number) {
    const match = /(?<value>\d+\.?\d*)/;
    let lineHeight = Number(this.ctx.font.match(match)?.[0] || 14) * 1.1
    let words = text.split(' ');
    let line = '';
    let testLine = '';
    let lineArray = [];

    for (var n = 0; n < words.length; n++) {
      testLine += `${words[n]} `;
      let metrics = this.ctx.measureText(testLine);
      let testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
        lineArray.push([line, x, y]);
        y += lineHeight;
        line = `${words[n]} `;
        testLine = `${words[n]} `;
      }
      else {
        line += `${words[n]} `;
      }
      if (n === words.length - 1) {
        lineArray.push([line, x, y]);
      }
    }
    return lineArray;
  }
}
