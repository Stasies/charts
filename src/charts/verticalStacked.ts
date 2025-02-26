import { VerticalChart } from "./vertical";
import type { DatasetItem, Config, Axes } from "../interfaces/Dataset.interface";

class VerticalStackedChart extends VerticalChart {
  set options(options: Config) {
    super.options = options;
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
        } else {
          sum += data.data[key] || 0;
        }
      });
      this.minValue = Math.min(negativeSum, this.minValue);
      this.maxValue = Math.max(sum, this.maxValue);
    }
    this.range = this.maxValue - this.minValue;
  }
  drawChartData(dataset: DatasetItem[]) {
    let x0: number, y0: number, x1: number, y1: number;
    let barWidth = Math.min(this.stepX / this._data.length, this.clientBarWidth);

    const xLabelPosition = this.stepX / 2 + this.originX;

    this.keys.forEach((key, i) => {
      const x = xLabelPosition + i * this.stepX;

      const sortedBars = [...dataset]
        .map((d) => ({
          color: d.color,
          value: d.data[key],
        }))

      let positiveStack = 0; // Starting position for positive values
      let negativeStack = 0; // Starting position for negative values
      let dataHeight = 0

      sortedBars.forEach((bar, index) => {
        dataHeight = (this.stepY / this.stepSize) * bar.value;

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
        let radius = 0
        if (index == sortedBars.length - 1) {
          radius = this.borderRadius
        }

        this.drawRoundedLine(x0 - barWidth / 2, y0, barWidth, -dataHeight, [0, 0, radius, radius], bar.color)
        this.ctx.fillText(String(bar.value), x + 20, y1);
      });
    });
  }
}
customElements.define("vertical-stacked-bar", VerticalStackedChart);