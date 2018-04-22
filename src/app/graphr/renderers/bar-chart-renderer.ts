import * as d3 from 'd3';
import * as _ from 'lodash';
import { BaseType } from 'd3-selection';
import { BarChartOptions } from '../interfaces/bar-chart-options.interface';

export class BarChartRenderer {
  static render(chart: d3.Selection<BaseType, {}, HTMLElement, any>, chartData: Array<any>, chartOptions: BarChartOptions) {
    const barDefaultOptions: BarChartOptions = {
      'nameField': '',
      'valueField': '',
      'showLegend': true,
      'showAxis': true,
      'animated': true,
      'chart': {
        'width': 420,
        'height': 300,
        'spacing': 20
      },
      'bar': {
        'height': 20,
        'margin': 5
      },
      'legend': {
        'width': 300,
        'spacing': 5
      },
      'barColorScheme': d3.scaleOrdinal(d3.schemeCategory20b)
    };
    const barChartOptions = _.merge(barDefaultOptions, chartOptions);

    const maxDataValue = d3.max(chartData.map(item => +item[barChartOptions.valueField]));
    chart.append('svg');
    const legendWidth = barChartOptions.showLegend ? barChartOptions.legend.width : 0;
    const axisHeight = barChartOptions.showAxis ? 50 : 0;

    const barSvg = chart.select('svg')
      .attr('width', barChartOptions.chart.width + barChartOptions.chart.spacing + legendWidth)
      .attr('height', chartData.length * (barChartOptions.bar.height + barChartOptions.bar.margin) + axisHeight)
      .attr('class', 'chart');

    const xScale = d3.scaleLinear()
      .domain([0, +maxDataValue])
      .range([0, barChartOptions.chart.width]);

    const bars = barSvg.selectAll('.bar')
      .data(chartData)
      .enter().append('g')
      .attr('class', 'bar');

    if (barChartOptions.animated) {
      bars.append('rect')
        .style('height', barChartOptions.bar.height - 1)
        .style('width', 0)
        .style('fill', function(d: any) { return barChartOptions.barColorScheme(d[barChartOptions.nameField]); })
        .attr('transform', function(d: any, i: number) {
          return 'translate(5,' + i * (barChartOptions.bar.height + barChartOptions.bar.margin) + ')';
        });

      bars.selectAll('rect')
        .transition()
        .styleTween('width', function(d: any): any {
          return d3.interpolateNumber(0, xScale(+d.amount));
        })
        .ease(d3.easeLinear)
        .duration(2000).delay(0);
    } else {
      bars.append('rect')
        .style('height', barChartOptions.bar.height - 1)
        .style('width', function(d: any) { return xScale(+d[barChartOptions.valueField]); })
        .style('fill', function(d: any) { return barChartOptions.barColorScheme(d[barChartOptions.nameField]); })
        .attr('transform', function(d: any, i: number) {
          return 'translate(5,' + i * (barChartOptions.bar.height + barChartOptions.bar.margin) + ')';
        });
    }


    if (barChartOptions.showAxis) {
      const xAxis = d3.axisBottom(xScale);
      barSvg.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(5, ${chartData.length * (barChartOptions.bar.height + barChartOptions.bar.margin )})`)
        .call(xAxis);
    }

    if (barChartOptions.showLegend) {
      const barLegend = barSvg.selectAll('.legend')
        .data(barChartOptions.barColorScheme.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
          const height = barChartOptions.bar.height + barChartOptions.legend.spacing;
          const offset =  height * barChartOptions.barColorScheme.domain().length / 2;
          const horz = barChartOptions.chart.width + 2 * barChartOptions.bar.height;
          const vert = i * height;
          return 'translate(' + horz + ',' + vert + ')';
        });

      barLegend.append('rect')
        .attr('width', barChartOptions.bar.height)
        .attr('height', barChartOptions.bar.height)
        .style('fill', barChartOptions.barColorScheme)
        .style('stroke', barChartOptions.barColorScheme);

      barLegend.append('text')
        .data(chartData)
        .attr('x', barChartOptions.bar.height + barChartOptions.legend.spacing)
        .attr('y', barChartOptions.bar.height - barChartOptions.legend.spacing)
        .text(function(d) {
          return `${d[barChartOptions.nameField]} (${d[barChartOptions.valueField]})`;
        });
    }
  }
}
