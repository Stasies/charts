import { Chart } from "./index";
import type { DatasetItem, Config, Axes } from "../interfaces/Dataset.interface";

export class VerticalChart extends Chart {
  stepX: number = 0;
  stepY: number = 0;
  originX: number = 0;
  originY: number = 0;

  set options(options: any) {
    super.options = options;
    this.setCoords();
    this.drawLabels();
    this.drawGrid();
    this.drawChartData(options.dataset);
    this.drawAxes();
  }
  drawChartData(dataset: DatasetItem[]) {
    dataset.forEach((data, index) => {
      this.drawData(data, index);
    });
  }

  setCoords() {
    this.steps.forEach((step) => {
      this.offsetX = Math.max(this.ctx.measureText(String(step)).width + 10, this.offsetX)
    })
    this.width = this.ctx.canvas.width - this.offsetX

    this.stepX = this.width / this.keys.length;
    this.stepY = this.height / this.numberOfSteps;

    const negativeSpace = this.negativeSteps * this.stepY;
    this.originX = this.offsetX;
    this.originY = this.height - negativeSpace;
  }
  drawGrid() {
    super.drawGrid(this.stepX, this.stepY, this.originX, this.originY);
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
        this.ctx.fillText(String(item), this.offsetX - 5, position);
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

    let dataWidth = Math.min(barWidth, this.clientBarWidth);
    this.ctx.textAlign = "center";

    let count = 0;

    for (
      let x = this.originX + xOffset + barWidth / 2;
      count < Object.keys(data.data).length;
      x += this.stepX
    ) {
      const currentValue: number = Object.values(data.data)[count] as number;
      const dataHeight = (this.stepY / this.stepSize) * currentValue;
      const dataPosition = this.originY - dataHeight
      let textPosition = dataHeight > 0 ? dataPosition - 5 : dataPosition + 12;

      this.drawRoundedLine(x, this.originY, dataWidth, -dataHeight, [0, 0, this.borderRadius, this.borderRadius], data.color)

      this.ctx.fillText(String(currentValue), x, textPosition);

      count++;
    }
  }
}
if (!customElements.get("chart-vertical-bar")) {
  customElements.define("chart-vertical-bar", VerticalChart)
}