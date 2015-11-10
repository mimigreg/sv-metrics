import {registry,MetricsValue,Gauge} from 'core/MetricsRegistry';


export class GaugeController{
  
  metricId: string;
  metric: MetricsValue;
  value: Gauge;
  
  constructor($routeParams){
    this.metricId= $routeParams.metricId;
    this.metric= registry.getValue(this.metricId);
    this.value= <Gauge>this.metric.value;
  }
}