import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';
import 'd3-selection-multi';
import { BarChartRenderer } from './renderers/bar-chart-renderer';
import { PieChartRenderer } from './renderers/pie-chart-renderer';
import { HistogramRenderer } from './renderers/histogram-renderer';
import { DetailedStackRenderer } from './renderers/detailed-stack-renderer';
import { LineChartRenderer } from './renderers/line-chart-renderer';
import { AreaChartRenderer } from './renderers/area-chart-renderer';
import { WorldHeatMapRenderer } from './renderers/world-heat-map-renderer';

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
        BarChartRenderer.render(chart, this.data, this.options);
        break;
      case 'pie':
        PieChartRenderer.render(chart, this.data, this.options);
        break;
      case 'histogram':
        HistogramRenderer.render(chart, this.data, this.options);
        break;
      case 'detailed-stack-bar':
        DetailedStackRenderer.render(chart, this.data, this.options);
        break;
      case 'line':
        LineChartRenderer.render(chart, this.data, this.options);
        break;
      case 'area':
        AreaChartRenderer.render(chart, this.data, this.options);
        break;
      case 'world-heat-map':
        WorldHeatMapRenderer.render(chart, this.data, this.options);
        break;
    }
  }

}
