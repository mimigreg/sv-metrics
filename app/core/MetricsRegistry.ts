/// <reference path="../../typings/tsd.d.ts" />

import {Metric, Histogram, Gauge, Counter, Timer, Meter} from 'core/metrics';

var MAX_TIMELINE_LENGTH = 100;

export enum TYPES {
  GAUGE = 0,
  METER = 1,
  TIMER = 2,
  HISTOGRAM = 3,
  COUNTER = 4,
  UNKNOWN = 5
};

export class Timeline {

  id: string;
  timeline: {date: Date, value: number}[];

  constructor(id: string, tmln: Array<any>){
    this.id = id;
    this.timeline = tmln ? tmln : [];
  }

  public update(value: number): void{
    if(this.timeline.length > MAX_TIMELINE_LENGTH){
      this.timeline.shift();
    }
    this.timeline.push({date: new Date(), value: value});
  }
}

export class MetricsValue{

  value: Metric | Histogram | Gauge | Timer | Meter;
  timeline: Timeline;

  constructor(value: Metric){
    this.value = value;
  }

  public getType(): TYPES{
    if( this.value.constructor === Gauge ) return TYPES.GAUGE;
    if( this.value.constructor === Counter ) return TYPES.COUNTER;
    if( this.value.constructor === Histogram ) return TYPES.HISTOGRAM;
    if( this.value.constructor === Timer ) return TYPES.TIMER;
    if( this.value.constructor === Meter ) return TYPES.METER;
    return TYPES.UNKNOWN;
  }
}

export class MetricsRegistry {

  metrics: Map<string,MetricsValue>;
  listeners: Function[];

  //TODO: localstorage ...

  constructor(){

    this.metrics =  new Map<string, MetricsValue>(); // [id] -> {value,timeline}
    this.listeners = [];
  }

  public register(id: string, value: Metric): MetricsValue {
    var mv = new MetricsValue(value);
    this.metrics.set(id, mv);
    return mv;
  }

  public getMetrics(): Map<string, MetricsValue> {
    return this.metrics;
  }

  public getValue(metric:string): MetricsValue {
    return registry.metrics.get(metric);
  }

  public updateGauges(gauges): void {
    for(let m in gauges){
      var mx = this.metrics.get(m);
       if(!mx){
         mx = this.register(m,new Gauge());
         mx.timeline = new Timeline('value',[]);
       }
       mx.value.update(gauges[m]);

       mx.timeline.update((<Gauge>mx.value).value);
    }
  }


  // 1MinuteRate,5MinuteRate,15MinuteRate,count,currentRate,mean
  public updateMeters(meters): void{
    for(let m in meters ){
       var mx= this.metrics.get(m);
       if(!mx){
         mx= registry.register(m, new Meter());
         mx.timeline= new Timeline('m1_rate',[]);
       }
       mx.value.update(meters[m]);

      mx.timeline.update((<Meter>mx.value).m1_rate);
    }
  }


  // meter (node-metered): 1MinuteRate,5MinuteRate,15MinuteRate,count,currentRate,mean
  // histogram (node-metered): count,max,mean,median,min,p75,p95,p99,p999,stddev,sum,variance
  // timer (java metrics): count,max,mean,min,p50,p75,p95,p98,p99,p999,stddev,m15_rate,m1_rate,m5_rate,mean_rate,duration_units,rate_units
  public updateTimers(timers): void{
    for(let m in timers ){
       var mx = this.metrics.get(m);
       if(!mx){
         mx= registry.register(m, new Timer());
         mx.timeline= new Timeline('mean',[]);
       }
       mx.value.update(timers[m]);

       mx.timeline.update((<Timer>registry.metrics.get(m).value).mean); //TODO: 1MinuteRate,5MinuteRate,15MinuteRate ?
        // TODO: + rate timeline ?
     }
  }

  public notifyUpdate(): void{
    for(var l of this.listeners){
      l();
    }
  }

  public update(metrics): void{
    this.updateGauges(metrics.gauges);
    this.updateMeters(metrics.meters);
    this.updateTimers(metrics.timers);
    this.notifyUpdate();
  }

  public onUpdate(callback: Function){
    this.listeners.push(callback);
    var listeners = this.listeners;
    return function(){
      var idx= listeners.indexOf(callback);
      listeners.splice(idx, 1);
    };
  }


  public restoreRegistry(rgJson){

    var metrics = new Map<string, MetricsValue>();

    function restoreMetricValue(obj): MetricsValue{
          var mx = Metric.importMetric(obj.value);
          return new MetricsValue(mx);
    }

   function convertValues(metrics: string[], values: any[]): Map<string, MetricsValue>{
     var mxs = new Map<string,MetricsValue>();
      for(let i=0; i<values.length; i++){
        var mxVal= restoreMetricValue(values[i]);
        mxs.set(metrics[i],mxVal);
          if( values[i].timeline ){
              var tmLine: {date: Date, value: number}[] = [];
              var j;
              var tlObj = values[i].timeline;
              for(j=0; j< tlObj.timeline.length; j++){
                  tmLine.push({date:new Date(<string>tlObj.timeline[j].date),value:<number>tlObj.timeline[j].value});
              }
              mxVal.timeline = new Timeline( tlObj.id, tmLine );
          }
      }
      return mxs;
    }

    var rg = JSON.parse(rgJson);
    this.metrics = convertValues(rg.metrics,rg.values);
    this.notifyUpdate();
  }

  public exportRegistry(){

    var values: MetricsValue[] = [];
    var mx: string[] = [];
    this.metrics.forEach(function(value, index, map){
      values.push(value);
      mx.push(index);
    });

    return {
      metrics: mx,
      values: values
    };
  }
}


export var registry = new MetricsRegistry();

export {Counter, Gauge, Meter, Histogram, Timer} from 'core/metrics';
