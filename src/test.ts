import type { DatasetItem, Config, Axes } from "./interfaces/Dataset.interface";

export class Chart extends HTMLElement {
  _data: DatasetItem[] = [];
  range: number = 0;
  offset: number = 40;
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
  axes: Axes = {};
  steps: number[] = [];

  constructor() {
    super();
    this.ctx = (this.querySelector("canvas") as HTMLCanvasElement).getContext(
      "2d"
    )!;
    this.width = this.ctx?.canvas.width! - this.offset;
    this.height = this.ctx?.canvas.height! - this.offset;
  }
  set options(options: Config) {
    this._data = options.dataset;
    this.axes = options.axes || {};
    if (this._data) {
      this.calculateRange();
      this.calculateSteps();
    }
  }
  get chartDataset() {
    return this._data;
  }
  calculateRange() {
    this.keys = [
      ...new Set(this._data.flatMap((item) => Object.keys(item.data))),
    ];

    for (let key of this.keys) {
      let sum = 0;
      let negativeSum = 0;
      this._data.forEach((data) => {
        if (data.data[key] < 0) {
          negativeSum += data.data[key] || 0;
          this.minValue = Math.min(negativeSum, this.minValue);
        } else {
          sum += data.data[key] || 0;
          this.maxValue = Math.max(sum, this.maxValue);
        }
      });
    }
    this.range = this.maxValue - this.minValue;
  }
  calculateSteps() {
    this.stepSize = this.roundToNiceNumber(this.range / 10);
    this.numberOfSteps = Math.max(
      Math.ceil((this.maxValue - this.minValue) / this.stepSize) + 2,
      10
    );

    this.negativeSteps = +this.roundToNiceNumber(
      Math.abs(this.minValue / this.stepSize)
    ).toFixed();
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
  drawGrid(stepX: number, stepY: number, originX: number) {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw vertical grid lines
    if (this.axes?.x?.grid !== false) {
      this.ctx.strokeStyle = this.axes?.x?.strokeStyle || "#ccc";
      this.ctx.lineWidth = this.axes?.x?.lineWidth || 1;
      this.ctx.setLineDash(this.axes?.x?.dash || []);
      for (let x = this.offset; x <= this.width + this.offset; x += stepX) {
        this.drawLine(x, this.height, x, 0);
      }
      this.ctx.setLineDash([]);
    }

    // Draw horizontal grid lines
    if (this.axes?.y?.grid !== false) {
      this.ctx.strokeStyle = this.axes?.y?.strokeStyle || "#ccc";
      this.ctx.lineWidth = this.axes?.y?.lineWidth || 1;
      this.ctx.setLineDash(this.axes?.y?.dash || []);
      for (let y = this.height; y > 0; y -= stepY) {
        this.drawLine(this.offset, y, this.width + originX, y);
      }
      this.ctx.setLineDash([]);
    }
  }
  drawAxes(x: number, y: number) {
    this.ctx.strokeStyle = "grey";
    this.ctx.lineWidth = 2;

    // X-axis
    this.drawLine(this.offset, y, this.width + this.offset, y);

    // Y-axis
    this.drawLine(x, this.height, x, 0);
  }
  drawLabels(
    position: number,
    labels: string[] | number[],
    step: number,
    axis: string
  ) {
    this.ctx.fillStyle = "grey";
    this.ctx.font = "14px";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    for (let item of labels) {
      if (axis == "y") {
        this.ctx.fillText(String(item), this.offset - 10, position);
      } else {
        this.ctx.fillText(String(item), position, this.height + 10);
      }
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
    // this.ctx.arcTo(x0, y0, x1, y1, 40);
    this.ctx.stroke();
  }
  getBackgroundGradient(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    color: string[]
  ) {
    let gradient = this.ctx.createLinearGradient(x0, y0, x1, y1 || y0);
    color.forEach((color, index) => {
      gradient.addColorStop((index + 1) / color.length, color);
    });
    return gradient;
  }
}

class VerticalChart extends Chart {
  stepX: number = 0;
  stepY: number = 0;
  originX: number = 0;
  originY: number = 0;

  set options(options: any) {
    super.options = options;
    this.setCoords();
    this.drawGrid();
    this.drawLabels();
    this.drawChartData(options.dataset);
    this.drawAxes();
  }
  drawChartData(dataset: DatasetItem[]) {
    dataset.forEach((data, index) => {
      this.drawData(data, index);
    });
  }

  setCoords() {
    this.stepX = this.width / this.keys.length;
    this.stepY = this.height / this.numberOfSteps;

    const negativeSpace = this.negativeSteps * this.stepY;

    this.originX = this.offset;
    this.originY = this.height - negativeSpace;
  }
  drawGrid() {
    super.drawGrid(this.stepX, this.stepY, this.originX);
  }
  drawAxes() {
    super.drawAxes(this.originX, this.originY);
  }

  testMethod(
    position: number,
    labels: string[] | number[],
    step: number,
    axis: string
  ) {
    for (let item of labels) {
      if (axis == "y") {
        this.ctx.fillText(String(item), this.offset - 5, position);
      } else {
        this.ctx.fillText(String(item), position, this.height + 10);
      }
      position += step;
    }
  }
  drawLabels() {
    super.drawLabels(this.height, this.steps, -this.stepY, "y");
    super.drawLabels(this.stepX / 2 + this.originX, this.keys, this.stepX, "x");
  }

  drawData(data: DatasetItem, index: number) {
    const barWidth = this.stepX / this._data.length;
    const xOffset = barWidth * index;

    this.ctx.lineWidth = Math.min(barWidth, this.clientBarWidth);
    this.ctx.textAlign = "center";

    let count = 0;

    for (
      let x = this.originX + xOffset + barWidth / 2;
      count < Object.keys(data.data).length;
      x += this.stepX
    ) {
      const currentValue: number = Object.values(data.data)[count] as number;
      const dataHeight = (this.stepY / this.stepSize) * currentValue;

      this.drawLine(x, this.originY, x, this.originY - dataHeight, data.color);

      // this.ctx.fillStyle = gradient;
      const dataPosition = this.originY - dataHeight;
      let textPosition = dataHeight > 0 ? dataPosition - 5 : dataPosition + 12;
      this.ctx.fillText(String(currentValue), x, textPosition);

      count++;
    }
  }
}
class VerticalStackedChart extends VerticalChart {
  set options(options: Config) {
    super.options = options;
  }
  drawChartData(dataset: DatasetItem[]) {
    let x0: number, y0: number, x1: number, y1: number;

    const xLabelPosition = this.stepX / 2 + this.originX;

    this.keys.forEach((key, i) => {
      const x = xLabelPosition + i * this.stepX;

      const sortedBars = [...dataset]
        .map((d) => ({
          color: d.color,
          value: d.data[key],
        }))
        .sort((a, b) => (b.value > 0 ? a.value - b.value : b.value - a.value));

      let positiveStack = 0; // Starting position for positive values
      let negativeStack = 0; // Starting position for negative values

      sortedBars.forEach((bar) => {
        const dataHeight = (this.stepY / this.stepSize) * bar.value;
        this.ctx.lineWidth = 30;

        x0 = x;
        x1 = x;
        if (bar.value > 0) {
          y0 = this.originY - positiveStack;
          y1 = this.originY - positiveStack - dataHeight;
          positiveStack += dataHeight;
        } else {
          y0 = this.originY - negativeStack;
          y1 = this.originY - negativeStack - dataHeight;
          negativeStack += dataHeight;
        }
        this.ctx.fillText(String(bar.value), x + 20, y1);
        this.drawLine(x0, y0, x1, y1, bar.color);
      });
    });
  }
}

class HorizontalChart extends Chart {
  stepX: number = 0;
  stepY: number = 0;
  originX: number = 0;
  originY: number = 0;

  set options(options: Config) {
    super.options = options;
    this.setCoords();
    this.drawGrid();
    this.drawAxes();
    this.drawLabels();
    this.drawChartData(options.dataset);
  }
  drawChartData(dataset: DatasetItem[]) {
    dataset.forEach((data, index) => {
      this.drawData(data, index);
    });
  }
  setCoords() {
    this.stepX = this.width / this.numberOfSteps;
    this.stepY = this.height / this.keys.length;

    const negativeSpace = this.negativeSteps * this.stepX;

    this.originY = this.height;
    this.originX = negativeSpace + this.offset;
  }
  drawGrid() {
    super.drawGrid(this.stepX, this.stepY, this.originX);
  }
  drawAxes() {
    super.drawAxes(this.originX, this.originY);
  }
  drawLabels() {
    super.drawLabels(this.height - this.stepY / 2, this.keys, -this.stepY, "y");
    super.drawLabels(this.offset, this.steps, this.stepX, "x");
  }

  drawData(data: DatasetItem, index: number) {
    const barWidth = this.stepY / this._data.length;
    const yOffset = barWidth * index;
    this.ctx.lineWidth = Math.min(barWidth, this.clientBarWidth);
    let count = 0;

    for (
      let y = 0 + yOffset + barWidth / 2;
      count < Object.keys(data.data).length;
      y += this.stepY
    ) {
      const currentValue: number = Object.values(data.data)[count] as number;
      const dataWidth = (this.stepX / this.stepSize) * currentValue;

      this.drawLine(this.originX, y, this.originX + dataWidth, y, data.color);
      this.ctx.fillText(String(currentValue), this.originX + dataWidth, y - 10);

      count++;
    }
  }
}
class HorizontalStackedChart extends HorizontalChart {
  drawChartData(dataset: DatasetItem[]) {
    let x0: number, y0: number, x1: number, y1: number;

    const xLabelPosition = this.stepY / 2;

    this.keys.forEach((key, i) => {
      const y = xLabelPosition + i * this.stepY;
      y0 = y;
      y1 = y;

      const sortedBars = [...dataset]
        .map((d) => ({
          color: d.color,
          value: d.data[key],
        }))
        .sort((a, b) => (b.value > 0 ? a.value - b.value : b.value - a.value));

      let positiveStack = this.originX; // Starting position for positive values
      let negativeStack = this.originX; // Starting position for negative values

      sortedBars.forEach((bar) => {
        const dataWidth = (this.stepX / this.stepSize) * bar.value;
        this.ctx.lineWidth = 30;

        if (bar.value >= 0) {
          x0 = positiveStack;
          x1 = positiveStack + dataWidth;
          positiveStack += dataWidth; // Shift for next positive bar
        } else {
          x0 = negativeStack;
          x1 = negativeStack + dataWidth;
          negativeStack += dataWidth; // Shift for next negative bar
        }

        this.ctx.fillText(String(bar.value), x1, y1 - 20);
        this.drawLine(x0, y0, x1, y1, bar.color);
      });
    });
  }
}
class LineChart extends VerticalChart {
  drawData(data: DatasetItem) {
    let x0: number, y0: number, x1: number, y1: number;

    this.ctx.strokeStyle = data.color[0];
    this.ctx.lineWidth = 1.5;

    let index = 0;
    y0 = this.originY;

    for (
      x0 = this.originX;
      index <= Object.keys(data.data).length;
      x0 += this.stepX
    ) {
      const currentValue: number = Object.values(data.data)[index] as number;
      const dataHeight = (this.stepY / this.stepSize) * currentValue;
      x1 = x0 + this.stepX;
      y1 = this.originY - dataHeight;

      // draw lines
      if (data.dash) {
        this.ctx.setLineDash(data.dash);
      }
      this.drawLine(x0, y0, x1, y1, data.color);
      this.ctx.setLineDash([]);

      //draw circle
      this.ctx.beginPath();
      this.ctx.arc(x1, y1, data.pointRadius || 3, 0, Math.PI * 2);
      this.ctx.fillStyle = data.color[0];
      this.ctx.fill();

      //add data value
      this.ctx.fillStyle = data.color[0];
      this.ctx.fillText(String(currentValue), x1, y1);

      y0 = y1;
      index++;
    }
  }
}
customElements.define("chart-vertical-bar", VerticalChart);
customElements.define("vertical-stacked-bar", VerticalStackedChart);
customElements.define("horizontal-stacked-bar", HorizontalStackedChart);
customElements.define("chart-horizontal-bar", HorizontalChart);
customElements.define("line-chart", LineChart);
