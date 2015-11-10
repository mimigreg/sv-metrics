import {registry,MetricsValue,Timer} from 'core/MetricsRegistry';

'use strict';

export class TimerController{
  
  metricId: string;
  metric: MetricsValue;
  value: Timer;
  
  constructor($routeParams){
    this.metricId= $routeParams.metricId;
    this.metric= registry.getValue(this.metricId);
    this.value= <Timer>this.metric.value;
  }
}