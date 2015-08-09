/// <reference path="../../typings/tsd.d.ts" />

var MAX_TIMELINE_LENGTH=100;

export enum TYPES {
  GAUGE= 0,
  METER= 1,
  TIMER= 2,
  HISTOGRAM= 3
};


interface MetricsBase{
}

export interface Meter extends MetricsBase{
  count:number,
  m1_rate:number,
  m5_rate:number,
  m15_rate:number,
  //currentRate:number, //  -> node-mesured
  mean_rate:number
}

export interface Gauge extends MetricsBase{
  value:number
}

export interface Timer extends Histogram,Meter{
  duration_units:string,
  rate_units:string
}

export interface Histogram extends MetricsBase{
  count:number,
  max:number, mean:number, median:number, min:number,
  p50:number, p75:number, p95:number, p99:number, p999:number,
  stddev:number ,sum:number, variance:number
}


export interface MetricsValue{
  type: TYPES,
  value: Histogram|Gauge|Timer|Meter,
  timeline: {date:Date,value:number}[]
}

export class MetricsRegistry{

  metrics: Map<string,MetricsValue>;
  listeners: Function[];

  //TODO: localstorage ...

  constructor(){
    console.log("constructor ....");

    this.metrics=  new Map<string,MetricsValue>(); // [id] -> {value,timeline}
    this.listeners= [];
  }

  register(id:string,type:TYPES){
    this.metrics.set(id,{type,value:undefined,timeline:[]});
  }

  getMetrics():Map<string,MetricsValue>{
    return this.metrics;
  }

  getValue(metric:string):MetricsValue{
    //console.info('get '+metric+', v='+ registry.values[metric]);
    return registry.metrics.get(metric);
  }

  updateGauges(gauges){
    for(let m in gauges ){
       if(!this.metrics.get(m)){
         this.register(m,TYPES.GAUGE);
       }

       if( gauges[m].value ){
         // java metrics
         this.metrics.get(m).value= gauges[m];
       }else{
         // node-measured
         this.metrics.get(m).value= {value:gauges[m]};
       }

       if(this.metrics.get(m).timeline.length>MAX_TIMELINE_LENGTH){
         this.metrics.get(m).timeline.shift();
       }
       this.metrics.get(m).timeline.push({date:new Date(),value:(<Gauge>this.metrics.get(m).value).value});
    }
  }


  // 1MinuteRate,5MinuteRate,15MinuteRate,count,currentRate,mean
  updateMeters(meters){
    for(let m in meters ){
       if(!this.metrics.get(m)){
         registry.register(m,TYPES.METER);
       }

       var value= <Meter>{
         m1_rate: <number>(meters[m].m1_rate?meters[m].m1_rate:meters[m]['1MinuteRate']), // dropwizard:nodemeasured
         m5_rate: <number>(meters[m].m1_rate?meters[m].m1_rate:meters[m]['5MinuteRate']),
         m15_rate: <number>(meters[m].m1_rate?meters[m].m1_rate:meters[m]['15MinuteRate']),
         count: <number>meters[m].count,
         currentRate:<number>meters[m].currentRate,
         mean_rate: <number>(meters[m].mean?meters[m].mean:meters[m].mean_rate)
       };

       registry.metrics.get(m).value= value;

        if(registry.metrics.get(m).timeline.length>MAX_TIMELINE_LENGTH){
          registry.metrics.get(m).timeline.shift();
        }
        registry.metrics.get(m).timeline.push({date:new Date(),value:value.m1_rate});
    }
  }


  // meter (node-metered): 1MinuteRate,5MinuteRate,15MinuteRate,count,currentRate,mean
  // histogram (node-metered): count,max,mean,median,min,p75,p95,p99,p999,stddev,sum,variance
  // timer (java metrics): count,max,mean,min,p50,p75,p95,p98,p99,p999,stddev,m15_rate,m1_rate,m5_rate,mean_rate,duration_units,rate_units
  updateTimers(timers){
    for(let m in timers ){
       if(!this.metrics.get(m)){
         registry.register(m,TYPES.TIMER);
       }
       if(timers[m].meter && timers[m].histogram){
         // node-measured
         registry.metrics.get(m).value= timers[m].meter;
         (<Timer>registry.metrics.get(m).value).mean_rate= timers[m].meter.mean; // mean will be overwritten by histogram (TODO: dropwizzard metrics?)

        registry.metrics.get(m).value= <Timer>{
              m1_rate: <number>timers[m].meter['1MinuteRate'],
              m5_rate: <number>timers[m].meter['5MinuteRate'],
              m15_rate: <number>timers[m].meter['15MinuteRate'],
              count: <number>timers[m].meter.count,
                       currentRate:<number>timers[m].meter.currentRate,
                       mean_rate: <number>timers[m].meter.mean,
                       max:<number>timers[m].histogram.max,
                       mean:<number>timers[m].histogram.mean,
                       min:<number>timers[m].histogram.min,
                       p50:<number>timers[m].histogram.p50,
                       p75:<number>timers[m].histogram.p75,
                       p95:<number>timers[m].histogram.p95,
                       p98:<number>timers[m].histogram.p98,
                       p99:<number>timers[m].histogram.p99,
                       p999:<number>timers[m].histogram.p999,
                       stddev:<number>timers[m].histogram.stddev,
                       median:<number>timers[m].histogram.median,
                       sum:<number>timers[m].histogram.sum,
                       variance:<number>timers[m].histogram.variance,
                       duration_units:<string>timers[m].histogram.duration_units,
                       rate_units:<string>timers[m].histogram.rate_units
          };
       }else{
         // DropWizzard metrics
         //registry.metrics.get(m).value= timers[m];

         registry.metrics.get(m).value= <Timer>{
              m1_rate: <number>timers[m].m1_rate,
              m5_rate: <number>timers[m].m5_rate,
              m15_rate: <number>timers[m].m15_rate,
              count: <number>timers[m].count,
              currentRate:<number>timers[m].currentRate,
              mean_rate: <number>timers[m].mean_rate,
              max:<number>timers[m].max,
              mean:<number>timers[m].mean,
              min:<number>timers[m].min,
              p50:<number>timers[m].p50,
              p75:<number>timers[m].p75,
              p95:<number>timers[m].p95,
              p98:<number>timers[m].p98,
              p99:<number>timers[m].p99,
              p999:<number>timers[m].p999,
              stddev:<number>timers[m].stddev,
              median:<number>timers[m].median,
              sum:<number>timers[m].sum,
              variance:<number>timers[m].variance,
              duration_units:<string>timers[m].duration_units,
              rate_units:<string>timers[m].rate_units
        };
       }

       if(registry.metrics.get(m).timeline.length>MAX_TIMELINE_LENGTH){
             registry.metrics.get(m).timeline.shift();
        }
        // mean timeline
        registry.metrics.get(m).timeline.push({date:new Date(),value:(<Timer>registry.metrics.get(m).value).mean}); //TODO: 1MinuteRate,5MinuteRate,15MinuteRate ?
        // TODO: + rate timeline ?
     }
  }

  notifyUpdate(){
    for(var l of this.listeners){
      l();
    }
  }

  update(metrics){
    this.updateGauges(metrics.gauges);
    this.updateMeters(metrics.meters);
    this.updateTimers(metrics.timers);
    this.notifyUpdate();
  }

  onUpdate(callback:Function){
    this.listeners.push(callback);
    var listeners= this.listeners;
    return function(){
      var idx= listeners.indexOf(callback);
      listeners.splice(idx,1);
    };
  }


  restoreRegistry(rgJson){

    var metrics= new Map<string,MetricsValue>();

   function convertValues(metrics:string[],values:any[]):Map<string,MetricsValue>{
     var mxs= new Map<string,MetricsValue>();
      for(let i=0; i<values.length; i++){
        mxs.set(metrics[i],values[i]);
          if( values[i].timeline ){
              var j, tmline= values[i].timeline;
              for(j=0; j< tmline.length; j++){
                  tmline[j].date= new Date(<string>tmline[j].date);
              }
          }
      }
      return mxs;
    }

    var rg= JSON.parse(rgJson);
    this.metrics= convertValues(rg.metrics,rg.values);
    this.notifyUpdate();
  }

  exportRegistry(){

    var values: MetricsValue[]= [];
    var mx: string[]= [];
    this.metrics.forEach(function(value,index,map){
      values.push(value);
      mx.push(index);
    });

    return {
      metrics: mx,
      values: values
    };
  }
}


export var registry= new MetricsRegistry();
