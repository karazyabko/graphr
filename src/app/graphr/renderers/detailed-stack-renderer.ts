import * as d3 from 'd3';
import * as _ from 'lodash';
import { BaseType } from 'd3-selection';
import { DetailedStackOptions } from '../interfaces/detailed-stack-options.interface';

export class DetailedStackRenderer {
  static render(chart: d3.Selection<BaseType, {}, HTMLElement, any>, chartData: Array<any>, chartOptions: DetailedStackOptions) {
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

    const detailedStackBarChartOptions = _.merge(detailedStackBarDefaultOptions, chartOptions);
    const detailedStackBarData = chartData;

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
      .domain([0, d3.sum(chartData, function (d: any) {
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
        return detailedStackBarYScale(Number(d.amount));
      })
      .attr('y', function(d: any, i: number){
        return (i === 0) ? 0 : detailedStackBarYScale(d3.sum(detailedStackBarData.slice(0, i), function(item: any){
          return Number(item.amount);
        }));
      })
      .attr('stroke', 'black')
      .attr('stroke-width', '1')
      .on('click', function(clickData: any){
        const mainContainer = (this as any).getBBox();

        const detailedData = clickData.details;

        const detailedDataYScale = d3.scaleLinear()
          .domain([0, d3.sum(detailedData, function (data: any) {
            return Number(data.amount);
          })])
          .range([0, detailedStackBarChartOptions.chart.height]);

        if (!document.getElementsByClassName('detailedGroup')[0].hasChildNodes()) {
          detailedDataChartArea.selectAll('rect')
            .data(detailedData)
            .enter()
            .append('rect')
            .attr('fill', function(fillData: any){
              return detailedStackBarChartOptions.detailedStackBarColorScheme(fillData.title);
            })
            .attr('width', detailedStackBarChartOptions.chart.spacing)
            .attr('x', 0)
            .attr('height', function(hData: any){
              return detailedDataYScale(Number(hData.amount));
            })
            .attr('y', function(yData: any, i: number){
              return (i === 0) ? 0 : detailedDataYScale(d3.sum(detailedData.slice(0, i), function(item: any){
                return Number(item.amount);
              }));
            })
            .attr('stroke', 'black')
            .attr('stroke-width', '1');
        } else {
          const detailedRects = detailedStackBarSvg.select('.detailedGroup')
            .selectAll('rect')
            .data(detailedData);

          const detailedPolygons = detailedStackBarSvg.selectAll('polygon');

          detailedRects.exit().remove();
          detailedPolygons.remove();

          detailedRects.enter().append('rect');

          detailedRects
            .attr('fill', function(childFillData: any){
              return detailedStackBarChartOptions.detailedStackBarColorScheme(childFillData.title);
            })
            .attr('width', detailedStackBarChartOptions.chart.spacing)
            .attr('x', 0)
            .attr('height', function(childHeightData: any){
              return detailedDataYScale(Number(childHeightData.amount));
            })
            .attr('y', function(childYData: any, i: number){
              return (i === 0) ? 0 : detailedDataYScale(d3.sum(detailedData.slice(0, i), function(item: any){
                return Number(item.amount);
              }));
            })
            .attr('stroke', 'black')
            .attr('stroke-width', '1');
        }

        detailedDataChartArea.selectAll('rect').each(function(rectData: any){
          const bbox = (this as any).getBBox();
          const mainTransform = d3.select('.mainGroup').attr('transform');
          const detailedTransform = d3.select((this as any).parentNode).attr('transform');
          const getTransformCoords = (transformAttr: string) => {
            return transformAttr.slice(10, transformAttr.indexOf(')')).split(', ');
          };

          const mainTransformCoords = getTransformCoords(mainTransform);
          const detailedTransformCoords = getTransformCoords(detailedTransform);

          const polygonCoords = [];

          // First point
          polygonCoords.push(`${Number(bbox.x) + Number(detailedTransformCoords[0])},` +
            `${detailedStackBarYScale(Number(bbox.y) + Number(detailedTransformCoords[1]))}`);

          // Second point
          polygonCoords.push(`${Number(bbox.x) + Number(detailedTransformCoords[0])},` +
            `${detailedStackBarYScale(Number(bbox.y) + Number(detailedTransformCoords[1]) + Number(bbox.height))}`);

          // Third point
          polygonCoords.push(`${Number(mainTransformCoords[0]) + Number(mainContainer.x) + Number(mainContainer.width)},` +
            `${detailedStackBarYScale(Number(mainTransformCoords[1]) + Number(mainContainer.y) + Number(mainContainer.height / 2))}`);

          detailedStackBarSvg.append('polygon')
            .transition().duration(500)
            .attr('points', `${polygonCoords.join(' ')}`)
            .attr('fill', detailedStackBarChartOptions.detailedStackBarColorScheme(rectData.title))
            .attr('stroke', 'black')
            .attr('stroke-width', '1');
        });
      });
  }
}
