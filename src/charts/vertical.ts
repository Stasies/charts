import { Chart } from "./index";
import type { DatasetItem, Config, Axes } from "../interfaces/Dataset.interface";

export class VerticalChart extends Chart {
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

  setCoords() {
    this.steps.forEach((step) => {
      this.offsetX = Math.max(this.ctx.measureText(String(step)).width + this.paddingRight, this.offsetX)
    })
    this.width = this.ctx.canvas.width - this.offsetX - this.paddingRight

    this.stepX = this.width / this.keys.length;
    this.stepY = (this.height - this.paddingTop) / this.numberOfSteps;

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
  drawLabels() {
    super.drawLabels(this.stepX / 2 + this.originX, this.keys, this.stepX, "x");
    super.drawLabels(this.height, this.steps, -this.stepY, "y");
  }

  drawData(data: DatasetItem, index: number) {
    const barWidth = this.stepX / this._data.length;
    const xOffset = barWidth * index;

    let dataWidth = Math.min(barWidth, this.clientBarWidth);
    let count = 0;

    for (
      let x = this.originX + xOffset + (barWidth - dataWidth) / 2;
      count < Object.keys(data.data).length;
      x += this.stepX
    ) {
      const currentValue: number = Object.values(data.data)[count] as number;
      const dataHeight = (this.stepY / this.stepSize) * currentValue;
      const dataPosition = this.originY - dataHeight
      let textPosition = dataHeight > 0 ? dataPosition - 5 : dataPosition + 12;

      this.drawRoundedLine(x, this.originY, dataWidth, -dataHeight, [0, 0, this.borderRadius, this.borderRadius], data.color)
      this.positionDataLabels(String(currentValue), x, textPosition, dataWidth, dataHeight)
      count++;
    }
  }
  positionDataLabels(text: string, x: number, y: number, width: number, height: number) {
    if (this.dataLabels?.display == false) return
    if (this.dataLabels?.fillStyle) {
      this.ctx.fillStyle = this.dataLabels?.fillStyle
    }
    if (this.dataLabels.position?.match('start')) {
      this.ctx.textAlign = 'end'
      x -= width
    } else if (this.dataLabels.position?.match('center')) {
      this.ctx.textAlign = 'center'
    } else if (this.dataLabels.position?.match('end')) {
      this.ctx.textAlign = 'start'
      x += width
    }
    if (this.dataLabels.position?.match('top')) {
      this.ctx.textBaseline = 'top'
      y -= 10
    } else if (this.dataLabels.position?.match('middle')) {
      this.ctx.textBaseline = 'middle'
      y += height / 2
    } else if (this.dataLabels.position?.match('bottom')) {
      this.ctx.textBaseline = 'bottom'
      y += height
    }
    this.ctx.fillText(text, x, y);
  }
}
declare global {
  interface HTMLElementTagNameMap {
    "chart-vertical-bar": VerticalChart;
  }
}

if (!customElements.get("chart-vertical-bar")) {
  customElements.define("chart-vertical-bar", VerticalChart)
}