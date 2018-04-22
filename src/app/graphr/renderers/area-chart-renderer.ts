import * as d3 from 'd3';
import * as _ from 'lodash';
import { BaseType } from 'd3-selection';
import { AreaChartOptions } from '../interfaces/area-chart-options.interface';

export class AreaChartRenderer {
  static render(chart: d3.Selection<BaseType, {}, HTMLElement, any>, chartData: Array<any>, chartOptions: AreaChartOptions) {
    const areaDefaultOptions = {
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
      'areaColorScheme': d3.scaleOrdinal(d3.schemeCategory10)
    };
    const areaChartOptions = _.merge(areaDefaultOptions, chartOptions);
    const areaLegendWidth = areaChartOptions.showLegend ? areaChartOptions.legend.width : 0;

    const areaSvg = chart.append('svg')
      .attr('width', areaChartOptions.chart.width + 2 * areaChartOptions.chart.spacing + areaLegendWidth)
      .attr('height', areaChartOptions.chart.height + 2 * areaChartOptions.chart.spacing)
      .attr('class', 'area');

    const areaChartArea = areaSvg.append('g')
      .attr('class', 'area-chart')
      .attr('transform', `translate(${areaChartOptions.chart.spacing} , ${areaChartOptions.chart.spacing})`);

    let maxAreaYScaleValue = 0;

    areaChartOptions.valueField.forEach(item => {
      const max = d3.max(chartData, function(d: any) {
        return Number(d[item]);
      });

      if (maxAreaYScaleValue < max) { maxAreaYScaleValue = max; }
    });

    const areaChartData = areaChartOptions.valueField.map(value => {
      return {
        id: value,
        values: chartData.map(item => {
          return {
            key: item[areaChartOptions.nameField],
            value: item[value]
          };
        })
      };
    });

    areaChartOptions.areaColorScheme.domain(areaChartData.map(chartItem => chartItem.id));

    const areaXScale = d3.scalePoint()
      .domain(chartData.map(item => {
        return item[areaChartOptions.nameField];
      }))
      .range([0, areaChartOptions.chart.width]);

    const areaYScale = d3.scaleLinear()
      .domain([0, maxAreaYScaleValue])
      .range([areaChartOptions.chart.height, 0]);

    areaChartArea.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${areaChartOptions.chart.height})`)
      .call(d3.axisBottom(areaXScale));

    areaChartArea.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(0, 0)')
      .call(d3.axisLeft(areaYScale));

    const area = d3.area()
      .x(function(d: any) { return areaXScale(d.key); })
      .y0(function() { return +areaChartOptions.chart.height; })
      .y1(function(d: any) { return areaYScale(+d.value); });

    const areaLine = d3.line()
      .x(function(d: any) { return areaXScale(d.key); })
      .y(function(d: any) { return areaYScale(+d.value); });

    if (areaChartOptions.smoothLine) {
      area.curve(d3.curveCardinal);
      areaLine.curve(d3.curveCardinal);
    }

    if (areaChartOptions.showGrid) {
      const xAreaGridLines = d3.axisBottom(areaXScale)
        .tickSize(-areaChartOptions.chart.height)
        .tickFormat(() => '');

      const yAreaGridLines = d3.axisLeft(areaYScale)
        .tickSize(-areaChartOptions.chart.width)
        .tickFormat(() => '');

      // X gridlines
      areaChartArea.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0, ${areaChartOptions.chart.height})`)
        .attr('stroke', 'lightgrey')
        .attr('stroke-opacity', '0.5')
        .attr('stroke-width', '0.5')
        .call(xAreaGridLines);

      // Y gridlines
      areaChartArea.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0, 0)`)
        .attr('stroke', 'lightgrey')
        .attr('stroke-opacity', '0.5')
        .attr('stroke-width', '0.5')
        .call(yAreaGridLines);
    }

    const areaGraph = areaChartArea.selectAll('.chart')
      .data(areaChartData)
      .enter()
      .append('g')
      .attr('class', 'chart');

    areaGraph.append('path')
      .attr('fill', 'none')
      .attr('stroke',  function(d: any) {
        return areaChartOptions.areaColorScheme(d.id); })
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', '1.5')
      .attr('d', function(d: any) {
        return areaLine(d.values); });

    areaGraph.append('path')
      .attr('fill', function(d: any) {
        return areaChartOptions.areaColorScheme(d.id); })
      .attr('fill-opacity', '0.3')
      .attr('d', function(d: any) {
        return area(d.values); });

    if (areaChartOptions.showDots) {
      areaGraph.selectAll('circle')
        .data(function (item: any) {
          return item.values;
        })
        .enter()
        .append('circle')
        .attr('r', 3)
        .attr('cx', function(d: any) {
          return areaXScale(d.key); })
        .attr('cy', function(d: any) {
          return areaYScale(+d.value); });
    }

    if (areaChartOptions.showLegend) {
      const areaLegend = areaChartArea.selectAll('.legend')
        .data(areaChartOptions.areaColorScheme.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d: any, i: number) {
          const height = areaChartOptions.legend.size + areaChartOptions.legend.spacing;
          const offset =  height * areaChartOptions.areaColorScheme.domain().length / 2;
          const horz = areaChartOptions.chart.width + 2 * areaChartOptions.legend.size;
          const vert = i * height;
          return 'translate(' + horz + ',' + vert + ')';
        });

      areaLegend.append('rect')
        .attr('width', areaChartOptions.legend.size)
        .attr('height', areaChartOptions.legend.size)
        .style('fill', areaChartOptions.areaColorScheme)
        .style('stroke', areaChartOptions.areaColorScheme);

      areaLegend.append('text')
        .attr('x', areaChartOptions.legend.size + areaChartOptions.legend.spacing)
        .attr('y', areaChartOptions.legend.size - areaChartOptions.legend.spacing)
        .text(function(d: any) {
          return d;
        });
    }

  }
}
