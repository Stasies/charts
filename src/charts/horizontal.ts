import { Chart } from "./index";
import type { DatasetItem, Config, Axes } from "../interfaces/Dataset.interface";

export class HorizontalChart extends Chart {
  stepX: number = 0;
  stepY: number = 0;
  originX: number = 0;
  originY: number = 0;

  set options(options: Config) {
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
    this.keys.forEach((key) => {
      this.offsetX = Math.max(this.ctx.measureText(String(key)).width + 10, this.offsetX)
    })
    this.width = this.ctx.canvas.width - this.offsetX

    this.stepX = this.width / this.numberOfSteps;
    this.stepY = this.height / this.keys.length;

    const negativeSpace = this.negativeSteps ? this.negativeSteps * this.stepX : 0;
    this.originX = negativeSpace + this.offsetX;
    this.originY = this.height;
  }
  drawGrid() {
    super.drawGrid(this.stepX, this.stepY, this.originX, this.originY);
  }
  drawAxes() {
    super.drawAxes(this.originX, this.originY);
  }
  drawLabels() {
    super.drawLabels(this.stepY / 2, this.keys, this.stepY, "y");
    super.drawLabels(this.offsetX, this.steps, this.stepX, "x");
  }

  drawData(data: DatasetItem, index: number) {
    const barWidth = this.stepY / this._data.length;
    const yOffset = barWidth * index;
    let count = 0;

    for (
      let y = 0 + yOffset + barWidth / 2;
      count < Object.keys(data.data).length;
      y += this.stepY
    ) {
      const currentValue: number = Object.values(data.data)[count] as number;
      const dataWidth = (this.stepX / this.stepSize) * currentValue;

      this.drawRoundedLine(this.originX, y - this.clientBarWidth / 2, dataWidth, this.clientBarWidth, [0, this.borderRadius, this.borderRadius, 0], data.color)
      this.positionDataLabels(this.originX, this.originX + dataWidth, y, String(currentValue))

      count++;
    }
  }
  positionDataLabels(x0: number, x1: number, y1: number, text: string) {
    if (!this.dataLabels.display) return
    for (let property in this.dataLabels) {
      (this.ctx as any)[property] = this.dataLabels[property]
    }
    // let labelPositionX = x1
    // if (this.ctx.textAlign == 'center') {
    //   labelPositionX = x1 - (x1 - x0) / 2
    // } else if (this.ctx.textAlign == 'start') {
    //   labelPositionX = x0
    // } else if (this.ctx.textAlign == 'end') {
    //   labelPositionX = x1
    // }

    let labelPositionY = y1
    // if (this.ctx.textBaseline == 'middle') {
    //   labelPositionY += this.clientBarWidth * 0.5
    // } else if (this.ctx.textBaseline == 'top') {
    //   labelPositionY -= this.clientBarWidth
    // } else if (this.ctx.textBaseline == 'bottom') {
    //   labelPositionY += this.clientBarWidth * 2.5
    // }

    this.ctx.fillText(text, x1, y1);
  }
}
if (!customElements.get("chart-horizontal-bar")) {
  customElements.define("chart-horizontal-bar", HorizontalChart)
}