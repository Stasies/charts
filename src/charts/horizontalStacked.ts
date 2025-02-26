import type { DatasetItem, Config, Axes } from "../interfaces/Dataset.interface";
import { HorizontalChart } from './horizontal'

class HorizontalStackedChart extends HorizontalChart {
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
        this.minValue = Math.min(negativeSum, this.minValue);
        this.maxValue = Math.max(sum, this.maxValue);
      });
    }
    this.range = this.maxValue - this.minValue;
    console.log(this.maxValue, this.minValue)
  }

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

      let positiveStack = this.originX; // Starting position for positive values
      let negativeStack = this.originX; // Starting position for negative values

      sortedBars.forEach((bar, index) => {
        const dataWidth = (this.stepX / this.stepSize) * bar.value;

        if (bar.value >= 0) {
          x0 = positiveStack;
          x1 = positiveStack + dataWidth;
          positiveStack += dataWidth; // Shift for next positive bar
        } else {
          x0 = negativeStack;
          x1 = negativeStack + dataWidth;
          negativeStack += dataWidth; // Shift for next negative bar
        }
        let radius = 0
        if (index == sortedBars.length - 1) {
          radius = this.borderRadius
        }

        this.drawRoundedLine(x0, y0 - this.clientBarWidth / 2, dataWidth, this.clientBarWidth, [0, radius, radius, 0], bar.color)
        this.positionDataLabels(x0, x1, y1, String(bar.value))
      });
    });
  }
}

customElements.define("horizontal-stacked-bar", HorizontalStackedChart);