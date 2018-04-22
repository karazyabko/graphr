export interface PieChartOptions {
  nameField: string;
  valueField: string;
  showLegend?: boolean,
  animated: boolean,
  chart?: {
    width?: number,
    height?: number,
    spacing?: number
  };
  pie?: {
    radius?: number,
    arc?: {
      innerRadius?: number,
      outerRadius?: number
    }
  };
  legend?: {
    width?: number,
    rectSize?: number,
    spacing?: number
  };
  pieColorScheme?: any;
}
