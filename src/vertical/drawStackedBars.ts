import { height, stepX, stepY, originX, ctx, stepSize, dataset, originY, keys } from '../gridData'

function drawStackedData() {
  const xLabelPosition = stepX / 2 + originX;

  keys.forEach((key, i) => {
    const x = xLabelPosition + i * stepX;

    const sortedBars = [...dataset]
      .map(d => ({
        color: d.color,
        value: d.data[key]
      }))
      .sort((a, b) => b.value > 0 ? a.value - b.value : b.value - a.value);

    let positiveStack = 0; // Starting position for positive values
    let negativeStack = 0; // Starting position for negative values

    sortedBars.forEach(bar => {
      const dataHeight = (stepY / stepSize) * bar.value;
      ctx.strokeStyle = bar.color;
      ctx.lineWidth = 30;
      ctx.fillStyle = bar.color

      ctx.beginPath();

      if (bar.value > 0) {
        ctx.moveTo(x, originY - positiveStack);
        ctx.lineTo(x, originY - positiveStack - dataHeight);
        ctx.fillText(String(bar.value), x + 20, originY - positiveStack - dataHeight);

        positiveStack += dataHeight;
      } else {
        ctx.moveTo(x, originY - negativeStack);
        ctx.lineTo(x, originY - negativeStack - dataHeight);
        ctx.fillText(String(bar.value), x + 20, originY - negativeStack - dataHeight);

        negativeStack += dataHeight;
      }
      ctx.stroke();
    });
  });
}

drawStackedData();