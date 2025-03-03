export interface DatasetItem {
  color: string[];
  dash?: number[];
  pointRadius?: number;
  label?: string;
  data: { [key: string]: number };
}
export interface Axes {
  [key: string]: {
    lineWidth: number;
    grid?: boolean;
    strokeStyle?: string;
    dash?: number[];
    labels: {
      [key: string]: string
    },
  };
}

export interface Config {
  dataset: DatasetItem[];
  axes?: Axes;
  barThickness?: number,
  borderRadius?: number,
  dataLabels?: {
    display?: boolean,
    fillStyle?: string,
    position?: string
  }
}
