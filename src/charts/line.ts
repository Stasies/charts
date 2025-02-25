import { VerticalChart } from "./vertical";
import type { DatasetItem, Config, Axes } from "../interfaces/Dataset.interface";

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
customElements.define("line-chart", LineChart);