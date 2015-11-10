import {registry,MetricsValue,Meter} from 'core/MetricsRegistry';

'use strict';

export class MeterController{
  
  metricId: string;
  metric: MetricsValue;
  value: Meter;
  
  constructor($routeParams){
    this.metricId= $routeParams.metricId;
    this.metric= registry.getValue(this.metricId);
    this.value= <Meter>this.metric.value;
  }
}