import { beforeAll, describe, expect, it, vi } from "vitest";
import { elementUpdated, fixture, fixtureSync } from "@open-wc/testing";
import { html } from "lit";
import "../charts/vertical";
import { VerticalChart } from "../charts/vertical";

let chart: VerticalChart

describe("vertical-chart", async () => {
  it("should render correctly", async () => {
    chart = fixtureSync(html`
      <chart-vertical-bar>
      </chart-vertical-bar>
    `);
    chart.options = {
      dataset: [{
        color: ['red'],
        data: {
          a: 10, b: 12
        }
      }]
    }
    let canvas = chart.querySelector('canvas')

    await elementUpdated(chart);

    expect(canvas).not.toBeUndefined()
    expect(canvas?.width).not.toBeUndefined()
    expect(canvas?.height).not.toBeUndefined()
  });


  it("should handle options", async () => {
    chart = await fixture(html`
      <chart-vertical-bar>
      </chart-vertical-bar>
    `);
    chart.options = {
      dataset: [{
        color: ['red'],
        data: {
          a: 10, b: 12
        }
      }]
    }
    expect(chart?.keys).toEqual(['a', 'b'])
    expect(chart?.minValue).toEqual(0)
    expect(chart?.maxValue).toEqual(12)
    expect(chart?.stepSize).toEqual(2)
    console.log(chart.width)
  });

});