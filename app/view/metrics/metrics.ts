import {registry,MetricsValue} from 'metrics/MetricsRegistry';

export class MetricsViewCtrl{

  metricIds: string[]= [];
  metrics: Map<string,MetricsValue>;

  constructor(){
    this.metrics= registry.getMetrics();
    this.metrics.forEach(
      (v,k)=>this.metricIds.push(k)
    );
  }
}
