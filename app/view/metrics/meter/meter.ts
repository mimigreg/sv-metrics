import {registry, MetricsValue, Meter} from 'core/MetricsRegistry';
import {Chart as ChartConfig} from 'configure/configuration';
import {CHART_TYPES} from 'chart/types';

'use strict';

export class MeterController {

  private metricId: string;
  private metric: MetricsValue;
  private value: Meter;
  private chart: ChartConfig;

  constructor($routeParams, $scope) {
    this.metricId = $routeParams.metricId;
    this.metric = registry.getValue(this.metricId);
    this.value = <Meter>this.metric.value;

    this.chart = new ChartConfig(this.metricId, '', CHART_TYPES.BAR);
    this.chart.series.push({metricId: this.metricId, name: this.metricId});

    let unregisterCBs: Function = registry.onUpdate( () => $scope.$broadcast('mx-ud') );

    $scope.$destroy = function(){
        unregisterCBs();
    };
  }
}
