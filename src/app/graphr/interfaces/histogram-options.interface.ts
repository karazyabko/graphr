export interface HistogramOptions {
  valueField: string,
  animated?: boolean,
  ticks?: number,
  chart?: {
    width?: number,
    height?: number,
    spacing?: number
  };
  histogramColorScheme?: any;
}
