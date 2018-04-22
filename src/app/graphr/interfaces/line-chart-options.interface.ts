export interface LineChartOptions {
  valueField: Array<string>;
  nameField: string;
  showGrid?: boolean;
  showDots?: boolean;
  showLegend?: boolean;
  smoothLine?: boolean;
  chart?: {
    width?: number,
    height?: number,
    spacing?: number
  };
  legend?: {
    width?: number,
    size?: number,
    spacing?: number
  },
  lineColorScheme?: any;
}
