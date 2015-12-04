import {registry, MetricsValue, Timer} from 'core/MetricsRegistry';
import {Chart as ChartConfig} from 'configure/configuration';
import {CHART_TYPES} from 'chart/types';

'use strict';

export class TimerController {

  private metricId: string;
  private metric: MetricsValue;
  private value: Timer;
  private responseTimeChart: ChartConfig;
  // private rate1mChart: ChartConfig;
  private histogramChart: ChartConfig;

  constructor($routeParams, $scope) {
    this.metricId = $routeParams.metricId;
    this.metric = registry.getValue(this.metricId);
    this.value = <Timer>this.metric.value;

    this.responseTimeChart = new ChartConfig(this.metricId, '', CHART_TYPES.BAR);
    this.responseTimeChart.series.push({metricId: this.metricId, name: this.metricId});

    this.histogramChart = new ChartConfig(this.metricId, '', CHART_TYPES.HISTOGRAM);
    this.histogramChart.series.push({metricId: this.metricId, name: this.metricId});

    let unregisterCBs: Function = registry.onUpdate( () => $scope.$broadcast('mx-ud') );

    $scope.$destroy = function(): void {
        unregisterCBs();
    };
  }
}
