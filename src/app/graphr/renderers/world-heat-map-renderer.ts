import * as d3 from 'd3';
// import * as topojson from 'topojson';
// import 'd3-selection-multi';
import * as _ from 'lodash';
import { BaseType } from 'd3-selection';
import { WorldHeatMapOptions } from '../interfaces/world-heat-map-options.interface';

export class WorldHeatMapRenderer {
  static render(chart: d3.Selection<BaseType, {}, HTMLElement, any>, chartData: Array<any>, chartOptions: WorldHeatMapOptions) {
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

    const worldHeatChartOptions = _.merge(worldHeatDefaultOptions, chartOptions);
    const mapData = chartData;

    const worldHeatSvg = chart.append('svg')
      .attr('width', worldHeatChartOptions.chart.width + 2 * worldHeatChartOptions.chart.spacing)
      .attr('height', worldHeatChartOptions.chart.height + 2 * worldHeatChartOptions.chart.spacing)
      .attr('class', 'world-heat-map');

    const worldHeatSvgChartArea = worldHeatSvg.append('g')
      .attr('transform', `scale(${worldHeatChartOptions.scale.horizontal} , ${worldHeatChartOptions.scale.vertical})`);

    const domain = d3.extent(chartData, function(d: any){
      return +d[worldHeatChartOptions.valueField];
    });

    const colorScale = d3.scaleLinear()
      .domain(domain)
      .range(<any>[worldHeatChartOptions.colors.minValue, worldHeatChartOptions.colors.maxValue]);

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
        .translate(<any>offset);

      path = path.projection(projection);

      worldHeatSvgChartArea.selectAll('path')
        .data(world.features)
        .enter()
        .append('path')
        .attr('d', path)
        .attr('fill', function(d: any): any{
          let color: any = '#ccc';
          mapData.map((item) => {
            if (item[worldHeatChartOptions.nameField] === d.properties.name) {
              color = colorScale(item[worldHeatChartOptions.valueField]);
            }
          });
          return color;
        })
        .attr('stroke', 'black')
        .attr('stroke-width', '0.5');
    });

  }
}
