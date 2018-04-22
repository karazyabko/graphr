export interface BarChartOptions {
  nameField: string;
  valueField: string;
  showLegend?: boolean;
  showAxis?: boolean;
  animated?: true;
  chart?: {
    width?: number,
    height?: number,
    spacing?: number
  };
  bar?: {
    height: number,
    margin?: number
  };
  legend?: {
    width?: number,
    spacing?: number
  };
  barColorScheme?: any;
}
