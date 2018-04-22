import * as d3 from 'd3';
import * as _ from 'lodash';
import { BaseType } from 'd3-selection';
import { HistogramOptions } from '../interfaces/histogram-options.interface';

export class HistogramRenderer {

  static render(chart: d3.Selection<BaseType, {}, HTMLElement, any>, chartData: Array<any>, chartOptions: HistogramOptions) {
    const histogramDefaultOptions = {
      'valueField': '',
      'animated': true,
      'ticks': 10,
      'chart': {
        'width': 500,
        'height': 300,
        'spacing': 30
      },
      'histogramColorScheme': d3.scaleOrdinal(d3.schemeCategory20b)
    };
    const histogramChartOptions = _.merge(histogramDefaultOptions, chartOptions);
    const data = chartData.map(item => Number(item[histogramChartOptions.valueField]));

    const histogramSvg = chart.append('svg')
      .attr('width', histogramChartOptions.chart.width + 2 * histogramChartOptions.chart.spacing)
      .attr('height', histogramChartOptions.chart.height + 2 * histogramChartOptions.chart.spacing)
      .attr('class', 'histogram');

    const histogramSvgChartArea = histogramSvg.append('g')
      .attr('transform', 'translate(' + histogramChartOptions.chart.spacing + ',' + histogramChartOptions.chart.spacing + ')');

    const histoXScale = d3.scaleLinear()
      .domain([0, +d3.max(data) * 1.1])
      .range([0, histogramChartOptions.chart.width]);

    const histogram = d3.histogram()
      .domain(<any>histoXScale.domain())
      .thresholds(histoXScale.ticks(histogramChartOptions.ticks));

    const bins = histogram(data);

    const histoYScale = d3.scaleLinear()
      .domain([0, d3.max(bins, function (d: any) {
        return +d.length;
      })])
      .range([histogramChartOptions.chart.height, 0]);

    const histoBar = histogramSvgChartArea.selectAll('.bar')
      .data(bins)
      .enter().append('g')
      .attr('class', 'bar')
      .attr('transform', function(d: any) {
        return 'translate(' + histoXScale(d.x0) + ',' + histoYScale(d.length) + ')';
      });

    if (histogramChartOptions.animated) {
      histoBar.append('rect')
        .attr('x', 1)
        .attr('width', histoXScale(bins[0].x1) - histoXScale(bins[0].x0) - 1)
        .style('fill', <any>histogramChartOptions.histogramColorScheme)
        .attr('height', 0);

      histoBar.selectAll('rect')
        .transition()
        .styleTween('height', function(d: any): any {
          return d3.interpolateNumber(0, histogramChartOptions.chart.height - histoYScale(d.length));
        })
        .ease(d3.easeLinear)
        .duration(2000).delay(0);
    } else {
      histoBar.append('rect')
        .attr('x', 1)
        .attr('width', histoXScale(bins[0].x1) - histoXScale(bins[0].x0) - 1)
        .style('fill', <any>histogramChartOptions.histogramColorScheme)
        .attr('height', function(d: any) {
          return histogramChartOptions.chart.height - histoYScale(d.length);
        });
    }

    histogramSvgChartArea.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${histogramChartOptions.chart.height})`)
      .call(d3.axisBottom(histoXScale));

    histogramSvgChartArea.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(0, 0)')
      .call(d3.axisLeft(histoYScale));
  }
}
