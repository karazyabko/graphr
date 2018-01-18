import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import 'd3-selection-multi';
import * as _ from 'lodash';

@Component({
  selector: 'app-graphr',
  templateUrl: './graphr.component.html',
  styleUrls: ['./graphr.component.css']
})
export class GraphrComponent implements OnInit {
  @Input('id') id = '';
  @Input('data') data: any = null;
  @Input('type') type = '';
  @Input('options') options: any = {};
  constructor() { }

  ngOnInit() {
    const chart = d3.select(`#${this.id}`);
    switch (this.type) {
      case 'bar':
        const barDefaultOptions = {
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
        const barChartOptions = _.merge(barDefaultOptions, this.options);

        const maxDataValue = d3.max(this.data.map(item => +item[barChartOptions.valueField]));
        chart.append('svg');
        const legendWidth = barChartOptions.showLegend ? barChartOptions.legend.width : 0;
        const axisHeight = barChartOptions.showAxis ? 50 : 0;

        const barSvg = chart.select('svg')
          .attr('width', barChartOptions.chart.width + barChartOptions.chart.spacing + legendWidth)
          .attr('height', this.data.length * (barChartOptions.bar.height + barChartOptions.bar.margin) + axisHeight)
          .attr('class', 'chart');

        const xScale = d3.scaleLinear()
          .domain([0, +maxDataValue])
          .range([0, barChartOptions.chart.width]);

        const bars = barSvg.selectAll('.bar')
          .data(this.data)
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
            .attr('transform', `translate(5, ${this.data.length * (barChartOptions.bar.height + barChartOptions.bar.margin )})`)
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
            .data(this.data)
            .attr('x', barChartOptions.bar.height + barChartOptions.legend.spacing)
            .attr('y', barChartOptions.bar.height - barChartOptions.legend.spacing)
            .text(function(d) {
              return `${d[barChartOptions.nameField]} (${d[barChartOptions.valueField]})`;
            });
        }
        break;
      case 'pie':
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
        const pieChartOptions = _.merge(pieDefaultOptions, this.options);

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
          .data(pie(this.data))
          .enter().append('g')
          .attr('class', 'arc');

        g.append('path')
          .attr('d', arc)
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
            .data(this.data)
            .attr('x', pieChartOptions.legend.rectSize + pieChartOptions.legend.spacing)
            .attr('y', pieChartOptions.legend.rectSize - pieChartOptions.legend.spacing)
            .text(function (d: any) {
              return `${d[pieChartOptions.nameField]} (${d[pieChartOptions.valueField]})`;
            });
        }

        break;
      case 'histogram':
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
        const histogramChartOptions = _.merge(histogramDefaultOptions, this.options);
        const data = this.data.map(item => +item[histogramChartOptions.valueField]);

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
          .domain(histoXScale.domain())
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
            .style('fill', histogramChartOptions.histogramColorScheme)
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
            .style('fill', histogramChartOptions.histogramColorScheme)
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

        break;
      case 'world-heat-map':
        const worldHeatDefaultOptions = {
          'valueField': '',
          'nameField': '',
          'chart': {
            'width': 800,
            'height': 600,
            'spacing': 30,
            'defaultScale': 75
          },
          'colors': {
            'minValue': '#FF0000',
            'maxValue': '#0000FF'
          },
          'scale': {
            'horizontal': '1.3',
            'vertical': '1'
          }
        };

        const worldHeatChartOptions = _.merge(worldHeatDefaultOptions, this.options);
        const mapData = this.data;

        const worldHeatSvg = chart.append('svg')
          .attr('width', worldHeatChartOptions.chart.width + 2 * worldHeatChartOptions.chart.spacing)
          .attr('height', worldHeatChartOptions.chart.height + 2 * worldHeatChartOptions.chart.spacing)
          .attr('class', 'world-heat-map');

        const worldHeatSvgChartArea = worldHeatSvg.append('g')
          .attr('transform', `scale(${worldHeatChartOptions.scale.horizontal} , ${worldHeatChartOptions.scale.vertical})`);

        const domain = d3.extent(this.data, function(d: any){
          return +d[worldHeatChartOptions.valueField];
        });

        const colorScale = d3.scaleLinear()
          .domain(domain)
          .range([worldHeatChartOptions.colors.minValue, worldHeatChartOptions.colors.maxValue]);

        d3.json('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json', function(error, world: any) {
          if (error) { throw error; }

          const center = d3.geoCentroid(world);
          let projection = d3.geoMercator()
            .center(center)
            .translate([
              worldHeatChartOptions.chart.width / 2 + worldHeatChartOptions.chart.spacing,
              worldHeatChartOptions.chart.height / 2 + worldHeatChartOptions.chart.spacing
            ])
            .scale(worldHeatChartOptions.chart.defaultScale);

          let path = d3.geoPath().projection(projection);

          const bounds  = path.bounds(world);
          const hscale  = worldHeatChartOptions.chart.defaultScale * worldHeatChartOptions.chart.width  / (bounds[1][0] - bounds[0][0]);
          const vscale  = worldHeatChartOptions.chart.defaultScale * worldHeatChartOptions.chart.height / (bounds[1][1] - bounds[0][1]);
          const scale   = (hscale < vscale) ? hscale : vscale;
          const offset  = [worldHeatChartOptions.chart.width - (bounds[0][0] + bounds[1][0]) / 2,
            worldHeatChartOptions.chart.height - (bounds[0][1] + bounds[1][1]) / 2];

          // new projection
          projection = d3.geoMercator().center(center)
            .scale(scale)
            .translate(offset);

          path = path.projection(projection);

          worldHeatSvgChartArea.selectAll('path')
            .data(world.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('fill', function(d: any): any{
              let color = '#ccc';
              mapData.map((item) => {
                if (item[worldHeatChartOptions.nameField] == d.properties.name){
                  color = colorScale(item[worldHeatChartOptions.valueField]);
                }
              });
              return color;
            })
            .attr('stroke', 'black')
            .attr('stroke-width', '0.5');
        });

        break;
      case 'detailed-stack-bar':
        const detailedStackBarDefaultOptions = {
          'valueField': '',
          'nameField': '',
          'chart': {
            'width': 400,
            'height': 400,
            'spacing': 30
          },
          'detailedStackBarColorScheme': d3.scaleOrdinal(d3.schemeCategory20b)
        };

        const detailedStackBarChartOptions = _.merge(detailedStackBarDefaultOptions, this.options);
        const detailedStackBarData = this.data;

        const detailedStackBarSvg = chart.append('svg')
          .attr('width', detailedStackBarChartOptions.chart.width + 2 * detailedStackBarChartOptions.chart.spacing)
          .attr('height', detailedStackBarChartOptions.chart.height + 2 * detailedStackBarChartOptions.chart.spacing)
          .attr('class', 'detailed-stack-bar');

        const detailedStackBarSvgChartArea = detailedStackBarSvg.append('g')
          .attr('class', 'mainGroup')
          .attr('transform', `translate(${detailedStackBarChartOptions.chart.spacing} , ${detailedStackBarChartOptions.chart.spacing})`);

        const detailedDataChartArea = detailedStackBarSvg.append('g')
          .attr('class', 'detailedGroup')
          .attr('transform', `translate(${4 * detailedStackBarChartOptions.chart.spacing}, ${detailedStackBarChartOptions.chart.spacing})`);

        const detailedStackBarYScale = d3.scaleLinear()
          .domain([0, d3.sum(this.data, function (d: any) {
            return +d.amount;
          })])
          .range([0, detailedStackBarChartOptions.chart.height]);

        detailedStackBarSvgChartArea.selectAll('rect')
          .data(detailedStackBarData)
          .enter()
          .append('rect')
          .attr('id', function(d: any){
            return d.title;
          })
          .attr('fill', function(d: any){
            return detailedStackBarChartOptions.detailedStackBarColorScheme(d.title);
          })
          .attr('width', 30)
          .attr('x', 0)
          .attr('height', function(d: any){
            return detailedStackBarYScale(+d.amount);
          })
          .attr('y', function(d: any, i: number){
            return (i == 0) ? 0 : detailedStackBarYScale(d3.sum(detailedStackBarData.slice(0, i), function(item: any){
              return +item.amount;
            }));
          })
          .attr('stroke', 'black')
          .attr('stroke-width', '1')
          .on('click', function(d: any){
            const mainContainer = this.getBBox();

            const detailedData = d.details;

            const detailedDataYScale = d3.scaleLinear()
              .domain([0, d3.sum(detailedData, function (d: any) {
                return +d.amount;
              })])
              .range([0, detailedStackBarChartOptions.chart.height]);

            if (!document.getElementsByClassName('detailedGroup')[0].hasChildNodes()) {
              detailedDataChartArea.selectAll('rect')
                .data(detailedData)
                .enter()
                .append('rect')
                // .transition().duration(500)
                .attr('fill', function(d: any){
                  return detailedStackBarChartOptions.detailedStackBarColorScheme(d.title);
                })
                .attr('width', detailedStackBarChartOptions.chart.spacing)
                .attr('x', 0)
                .attr('height', function(d: any){
                  return detailedDataYScale(+d.amount);
                })
                .attr('y', function(d: any, i: number){
                  return (i == 0) ? 0 : detailedDataYScale(d3.sum(detailedData.slice(0, i), function(item: any){
                    return +item.amount;
                  }));
                })
                .attr('stroke', 'black')
                .attr('stroke-width', '1');

              detailedDataChartArea.selectAll('rect').each(function(d: any){
                const bbox = this.getBBox();
                const mainTransform = d3.select('.mainGroup').attr('transform');
                const detailedTransform = d3.select(this.parentNode).attr('transform');
                const getTransformCoords = (transformAttr: string) => {
                  return transformAttr.slice(10, transformAttr.indexOf(')')).split(', ');
                };

                const mainTransformCoords = getTransformCoords(mainTransform);
                const detailedTransformCoords = getTransformCoords(detailedTransform);

                let polygonCoords = [];

                // First point
                polygonCoords.push(`${+bbox.x + +detailedTransformCoords[0]},` +
                                    `${detailedStackBarYScale(+bbox.y + +detailedTransformCoords[1])}`);

                // Second point
                polygonCoords.push(`${+bbox.x + +detailedTransformCoords[0]},` +
                                   `${detailedStackBarYScale(+bbox.y + +detailedTransformCoords[1] + +bbox.height)}`);

                // Third point
                polygonCoords.push(`${+mainTransformCoords[0] + +mainContainer.x + +mainContainer.width},` +
                  `${detailedStackBarYScale(+mainTransformCoords[1] + +mainContainer.y + +mainContainer.height / 2)}`);

                detailedStackBarSvg.append('polygon')
                  .transition().duration(500)
                  .attr('points', `${polygonCoords.join(' ')}`)
                  .attr('fill', detailedStackBarChartOptions.detailedStackBarColorScheme(d.title))
                  .attr('stroke', 'black')
                  .attr('stroke-width', '1');
              });
            } else {
              const detailedRects = detailedStackBarSvg.select('.detailedGroup')
                .selectAll('rect')
                .data(detailedData);

              const detailedPolygons = detailedStackBarSvg.selectAll('polygon');

              detailedRects.exit().remove();
              detailedPolygons.remove();

              detailedRects.enter().append('rect');

              detailedRects
                .attr('fill', function(d: any){
                  return detailedStackBarChartOptions.detailedStackBarColorScheme(d.title);
                })
                .attr('width', detailedStackBarChartOptions.chart.spacing)
                .attr('x', 0)
                .attr('height', function(d: any){
                  return detailedDataYScale(+d.amount);
                })
                .attr('y', function(d: any, i: number){
                  return (i == 0) ? 0 : detailedDataYScale(d3.sum(detailedData.slice(0, i), function(item: any){
                    return +item.amount;
                  }));
                })
                .attr('stroke', 'black')
                .attr('stroke-width', '1');

              detailedDataChartArea.selectAll('rect').each(function(d: any){
                const bbox = this.getBBox();
                const mainTransform = d3.select('.mainGroup').attr('transform');
                const detailedTransform = d3.select(this.parentNode).attr('transform');
                const getTransformCoords = (transformAttr: string) => {
                  return transformAttr.slice(10, transformAttr.indexOf(')')).split(', ');
                };

                const mainTransformCoords = getTransformCoords(mainTransform);
                const detailedTransformCoords = getTransformCoords(detailedTransform);

                let polygonCoords = [];

                // First point
                polygonCoords.push(`${bbox.x + detailedTransformCoords[0]},` +
                  `${detailedStackBarYScale(+bbox.y + +detailedTransformCoords[1])}`);

                // Second point
                polygonCoords.push(`${bbox.x + detailedTransformCoords[0]},` +
                  `${detailedStackBarYScale(+bbox.y + +detailedTransformCoords[1] + +bbox.height)}`);

                // Third point
                polygonCoords.push(`${+mainTransformCoords[0] + +mainContainer.x + +mainContainer.width},` +
                  `${detailedStackBarYScale(+mainTransformCoords[1] + +mainContainer.y + +mainContainer.height / 2)}`);

                detailedStackBarSvg.append('polygon')
                  .attr('points', `${polygonCoords.join(' ')}`)
                  .attr('fill', detailedStackBarChartOptions.detailedStackBarColorScheme(d.title))
                  .attr('stroke', 'black')
                  .attr('stroke-width', '1');
              });
            }
          });
        break;
    }
  }

}
