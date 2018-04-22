import * as d3 from 'd3';
import * as _ from 'lodash';
import { BaseType } from 'd3-selection';
import { LineChartOptions } from '../interfaces/line-chart-options.interface';

export class LineChartRenderer {
  static render(chart: d3.Selection<BaseType, {}, HTMLElement, any>, chartData: Array<any>, chartOptions: LineChartOptions) {
    const lineDefaultOptions = {
      'valueField': [],
      'nameField': '',
      'showGrid': true,
      'showDots': true,
      'showLegend': true,
      'smoothLine': false,
      'chart': {
        'width': 800,
        'height': 400,
        'spacing': 30
      },
      'legend': {
        'width': 300,
        'size': 20,
        'spacing': 5
      },
      'lineColorScheme': d3.scaleOrdinal(d3.schemeCategory10)
    };
    const lineChartOptions = _.merge(lineDefaultOptions, chartOptions);
    const lineLegendWidth = lineChartOptions.showLegend ? lineChartOptions.legend.width : 0;

    const lineSvg = chart.append('svg')
      .attr('width', lineChartOptions.chart.width + 2 * lineChartOptions.chart.spacing + lineLegendWidth)
      .attr('height', lineChartOptions.chart.height + 2 * lineChartOptions.chart.spacing)
      .attr('class', 'line');

    const lineChartArea = lineSvg.append('g')
      .attr('class', 'line-chart')
      .attr('transform', `translate(${lineChartOptions.chart.spacing} , ${lineChartOptions.chart.spacing})`);

    let maxLineYScaleValue = 0;

    lineChartOptions.valueField.forEach(item => {
      const max = d3.max(chartData, function(d: any) {
        return Number(d[item]);
      });

      if (maxLineYScaleValue < max) { maxLineYScaleValue = max; }
    });

    const chartMappedData = lineChartOptions.valueField.map(value => {
      return {
        id: value,
        values: chartData.map(item => {
          return {
            key: item[lineChartOptions.nameField],
            value: item[value]
          };
        })
      };
    });

    lineChartOptions.lineColorScheme.domain(chartMappedData.map(chartItem => chartItem.id));

    const lineXScale = d3.scalePoint()
      .domain(chartData.map(item => {
        return item[lineChartOptions.nameField];
      }))
      .range([0, lineChartOptions.chart.width]);

    const lineYScale = d3.scaleLinear()
      .domain([0, maxLineYScaleValue])
      .range([lineChartOptions.chart.height, 0]);

    lineChartArea.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${lineChartOptions.chart.height})`)
      .call(d3.axisBottom(lineXScale));

    lineChartArea.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(0, 0)')
      .call(d3.axisLeft(lineYScale));

    const line = d3.line()
      .x(function(d: any) { return lineXScale(d.key); })
      .y(function(d: any) { return lineYScale(Number(d.value)); });

    if (lineChartOptions.smoothLine) {
      line.curve(d3.curveCardinal);
    }

    if (lineChartOptions.showGrid) {
      const xGridLines = d3.axisBottom(lineXScale)
        .tickSize(-lineChartOptions.chart.height)
        .tickFormat(() => '');

      const yGridLines = d3.axisLeft(lineYScale)
        .tickSize(-lineChartOptions.chart.width)
        .tickFormat(() => '');

      // X gridlines
      lineChartArea.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0, ${lineChartOptions.chart.height})`)
        .attr('stroke', 'lightgrey')
        .attr('stroke-opacity', '0.5')
        .attr('stroke-width', '0.5')
        .call(xGridLines);

      // Y gridlines
      lineChartArea.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0, 0)`)
        .attr('stroke', 'lightgrey')
        .attr('stroke-opacity', '0.5')
        .attr('stroke-width', '0.5')
        .call(yGridLines);
    }

    const graph = lineChartArea.selectAll('.chart')
      .data(chartMappedData)
      .enter()
      .append('g')
      .attr('class', 'chart');

    graph.append('path')
      .attr('fill', 'none')
      .attr('stroke',  function(d: any) {
        return lineChartOptions.lineColorScheme(d.id); })
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 1.5)
      .attr('d', function(d: any) {
        return line(d.values); });

    if (lineChartOptions.showDots) {
      graph.selectAll('circle')
        .data(function (item: any) {
          return item.values;
        })
        .enter()
        .append('circle')
        .attr('r', 3)
        .attr('cx', function(d: any) {
          return lineXScale(d.key); })
        .attr('cy', function(d: any) {
          return lineYScale(+d.value); });
    }

    if (lineChartOptions.showLegend) {
      const lineLegend = lineChartArea.selectAll('.legend')
        .data(lineChartOptions.lineColorScheme.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d: any, i: number) {
          const height = lineChartOptions.legend.size + lineChartOptions.legend.spacing;
          const offset =  height * lineChartOptions.lineColorScheme.domain().length / 2;
          const horz = lineChartOptions.chart.width + 2 * lineChartOptions.legend.size;
          const vert = i * height;
          return 'translate(' + horz + ',' + vert + ')';
        });

      lineLegend.append('rect')
        .attr('width', lineChartOptions.legend.size)
        .attr('height', lineChartOptions.legend.size)
        .style('fill', lineChartOptions.lineColorScheme)
        .style('stroke', lineChartOptions.lineColorScheme);

      lineLegend.append('text')
        .attr('x', lineChartOptions.legend.size + lineChartOptions.legend.spacing)
        .attr('y', lineChartOptions.legend.size - lineChartOptions.legend.spacing)
        .text(function(d: any) {
          return d;
        });
    }
  }
}
