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
  getDataForTest() {
    let data = super.getDataForTest()
    return {
      ...data,
      stepX: this.stepX,
      stepY: this.stepY,
      originX: this.originX,
      originY: this.originY,
    }
  }
  drawChartData(dataset: DatasetItem[]) {
    dataset.forEach((data, index) => {
      this.drawData(data, index);
    });
  }
  setCoords() {
    this.keys.forEach((key) => {
      this.offsetX = Math.max(this.ctx.measureText(String(key)).width + this.paddingRight, this.offsetX)
    })
    this.width = this.ctx.canvas.width - this.offsetX - this.paddingRight

    this.stepX = this.width / this.numberOfSteps;
    this.stepY = (this.height - this.paddingTop) / this.keys.length;

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
    super.drawLabels(this.paddingTop + this.stepY / 2, this.keys, this.stepY, "y");
    super.drawLabels(this.offsetX, this.steps, this.stepX, "x");
  }

  drawData(data: DatasetItem, index: number) {
    const barWidth = this.stepY / this._data.length;
    const yOffset = barWidth * index;
    let count = 0;

    for (
      let y = this.paddingTop + yOffset + barWidth / 2;
      count < Object.keys(data.data).length;
      y += this.stepY
    ) {
      const currentValue: number = Object.values(data.data)[count] as number;
      const dataWidth = (this.stepX / this.stepSize) * currentValue;

      this.drawRoundedLine(this.originX, y - this.clientBarWidth / 2, dataWidth, this.clientBarWidth, [0, this.borderRadius, this.borderRadius, 0], data.color)
      this.positionDataLabels(String(currentValue), this.originX, y, dataWidth, this.clientBarWidth)

      count++;
    }
  }
  positionDataLabels(text: string, x: number, y: number, width: number, height: number) {
    if (this.dataLabels?.display == false) return
    if (this.dataLabels?.fillStyle) {
      this.ctx.fillStyle = this.dataLabels?.fillStyle
    }
    let labelPositionX = x
    if (this.dataLabels.position?.match('center')) {
      labelPositionX = x + width / 2
    } else if (this.dataLabels.position?.match('start')) {
      labelPositionX = x + 4
      this.ctx.textAlign = 'start'
    } else if (this.dataLabels.position?.match('end')) {
      this.ctx.textAlign = 'end'
      labelPositionX = x + width
    }

    let labelPositionY = y
    if (this.dataLabels.position?.match('middle')) {
      labelPositionY -= height / 2
      this.ctx.textBaseline = 'top'
    } else if (this.dataLabels.position?.match('top')) {
      labelPositionY -= height / 2
      this.ctx.textBaseline = 'bottom'
    } else if (this.dataLabels.position?.match('bottom')) {
      labelPositionY += height
      this.ctx.textBaseline = 'top'
    }
    this.ctx.fillText(text, labelPositionX, labelPositionY);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "chart-horizontal-bar": HorizontalChart;
  }
}

if (!customElements.get("chart-horizontal-bar")) {
  customElements.define("chart-horizontal-bar", HorizontalChart)
}