import { beforeAll, describe, expect, it, vi } from "vitest";
import "../charts/horizontal";
import { HorizontalChart } from "../charts/horizontal";

let chart: HorizontalChart = document.createElement('chart-horizontal-bar')
let height = 600
let width = 800

describe("horizontal-chart", async () => {
  beforeAll(() => {
    chart.setAttribute('width', `${width}`)
    chart.setAttribute('height', `${height}`)
    document.body.appendChild(chart)

    chart.options = {
      dataset: [{
        color: ['red'],
        data: {
          a: 10, b: 12
        }
      }]
    }
  })

  it("should render correctly", async () => {
    let canvas = chart.querySelector('canvas')
    let data = chart.getDataForTest()

    expect(canvas).not.toBeUndefined()
    expect(data.height).toEqual(height - data.offsetY)
    expect(data.width).toEqual(width - data.offsetX - data.paddingRight)
  });

  it('should calculate range correctly', () => {
    let data = chart.getDataForTest()
    expect(data.minValue).toEqual(0)
    expect(data.maxValue).toEqual(12)
  })

  it('should draw grid correctly', () => {
    let data = chart.getDataForTest()

    expect(data.originX).toEqual(data.offsetX)
    expect(data.originY).toEqual(data.height)

    expect(data.keys).toEqual(['a', 'b'])
    expect(data.stepSize).toEqual(2)
    expect(data.negativeSteps).toEqual(0)

    expect(data.stepY).toEqual((data.height - data.paddingTop) / 2)
    expect(Math.round(data.stepX * (data.steps.length - 1))).toEqual(data.width)
  })
});