export interface DatasetItem {
  color: string[];
  dash?: number[];
  pointRadius?: number;
  data: { [key: string]: number };
}
export interface Axes {
  [key: string]: {
    lineWidth: number;
    grid?: boolean;
    strokeStyle?: string;
    dash?: number[];
  };
}
export interface Config {
  dataset: DatasetItem[];
  axes?: Axes;
}
