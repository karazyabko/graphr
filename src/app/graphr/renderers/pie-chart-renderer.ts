import * as d3 from 'd3';
import * as _ from 'lodash';
import { BaseType } from 'd3-selection';
import { PieChartOptions } from '../interfaces/pie-chart-options.interface';

export class PieChartRenderer {

  static render(chart: d3.Selection<BaseType, {}, HTMLElement, any>, chartData: Array<any>, chartOptions: PieChartOptions) {
    const pieDefaultOptions = {
      'nameField': '',
      'valueField': '',
      'showLegend': true,
      'animated': true,
      'chart': {
        'width': 300,
        'height': 300,
        'spacing': 20
      },
      'pie': {
        'radius': 150,
        'arc': {
          'innerRadius': 0,
          'outerRadius': 150
        }
      },
      'legend': {
        'width': 300,
        'rectSize': 20,
        'spacing': 5
      },
      'pieColorScheme': d3.scaleOrdinal(d3.schemeCategory20b)
    };
    const pieChartOptions = _.merge(pieDefaultOptions, chartOptions);

    const arc = d3.arc()
      .outerRadius(pieChartOptions.pie.arc.outerRadius)
      .innerRadius(pieChartOptions.pie.arc.innerRadius);

    const pie = d3.pie()
      .sort(null)
      .value(function(d: any) { return d.amount; });

    const pieLegendWidth = pieChartOptions.showLegend ? pieChartOptions.legend.width : 0;

    const svg = chart.append('svg')
      .attr('width', pieChartOptions.chart.width + pieChartOptions.chart.spacing + pieLegendWidth)
      .attr('height', pieChartOptions.chart.height)
      .attr('class', 'piechart')
      .append('g')
      .attr('transform', 'translate(' + pieChartOptions.pie.radius + ',' + pieChartOptions.chart.width / 2 + ')');

    const g = svg.selectAll('.arc')
      .data(pie(chartData))
      .enter().append('g')
      .attr('class', 'arc');

    g.append('path')
      .attr('d', <any>arc)
      .style('fill', function(d: any) { return pieChartOptions.pieColorScheme( d.data[pieChartOptions.nameField ]); });

    if (pieChartOptions.animated) {
      g.selectAll('path')
        .transition()
        .duration(1000)
        .attrTween('d', function(d: any) {
          const i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
          return function(t) {
            d.endAngle = i(t);
            return arc(d);
          };
        });
    }
    if (pieChartOptions.showLegend) {
      const legend = svg.selectAll('.legend')
        .data(pieChartOptions.pieColorScheme.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function (d, i) {
          const height = pieChartOptions.legend.rectSize + pieChartOptions.legend.spacing;
          const offset = height * pieChartOptions.pieColorScheme.domain().length / 2;
          const horz = 2 * pieChartOptions.pie.radius + 2 * pieChartOptions.legend.rectSize;
          const vert = i * height - offset;
          return 'translate(' + horz + ',' + vert + ')';
        });

      legend.append('rect')
        .attr('width', pieChartOptions.legend.rectSize)
        .attr('height', pieChartOptions.legend.rectSize)
        .style('fill', pieChartOptions.pieColorScheme)
        .style('stroke', pieChartOptions.pieColorScheme);

      legend.append('text')
        .data(chartData)
        .attr('x', pieChartOptions.legend.rectSize + pieChartOptions.legend.spacing)
        .attr('y', pieChartOptions.legend.rectSize - pieChartOptions.legend.spacing)
        .text(function (d: any) {
          return `${d[pieChartOptions.nameField]} (${d[pieChartOptions.valueField]})`;
        });
    }
  }
}
