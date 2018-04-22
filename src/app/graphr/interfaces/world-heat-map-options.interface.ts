export interface WorldHeatMapOptions {
  valueField: string,
  nameField: string,
  chart?: {
    width?: number,
    height?: number,
    spacing?: number,
    defaultScale?: number
  };
  colors?: {
    minValue?: string,
    maxValue?: string
  };
  scale?: {
    horizontal?: string,
    vertical?: string
  };
}
