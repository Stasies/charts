import { stepX, stepY, originX, ctx, stepSize, dataset, originY, keys } from '../gridData'

function drawStackedData() {
  const xLabelPosition = stepY / 2;

  keys.forEach((key, i) => {
    const y = xLabelPosition + i * stepY;

    const sortedBars = [...dataset]
      .map(d => ({
        color: d.color,
        value: d.data[key]
      }))
      .sort((a, b) => b.value > 0 ? a.value - b.value : b.value - a.value);

    let positiveStack = originX; // Starting position for positive values
    let negativeStack = originX; // Starting position for negative values

    sortedBars.forEach(bar => {
      const dataWidth = (stepX / stepSize) * bar.value;
      ctx.strokeStyle = bar.color;
      ctx.fillStyle = bar.color
      ctx.lineWidth = 30;

      ctx.beginPath();
      if (bar.value >= 0) {
        ctx.moveTo(positiveStack, y);
        ctx.lineTo(positiveStack + dataWidth, y);
        ctx.fillText(String(bar.value), positiveStack + dataWidth, y - 20);

        positiveStack += dataWidth; // Shift for next positive bar
      } else {
        ctx.moveTo(negativeStack, y);
        ctx.lineTo(negativeStack + dataWidth, y);
        ctx.fillText(String(bar.value), negativeStack + dataWidth, y - 20);

        negativeStack += dataWidth; // Shift for next negative bar
      }
      ctx.stroke();
    });
  });
}

drawStackedData();