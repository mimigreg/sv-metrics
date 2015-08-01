var MAX_TIMELINE_LENGTH=100;

export const TYPES={
  GAUGE:0,
  METER:1,
  TIMER:2,
  HISTOGRAM:3,
  COUNTER:4
};

class MetricsRegistry{

  //TODO: localstorage ...

  constructor(){
    console.log("constructor ....");

    this.metrics= {}; // [id] -> {id,type}
    this.values=  {}; // [id] -> {value,timeline}
    this.listeners= [];
  }

  register(id,type){
    this.metrics[id]= {id,type};
    this.values[id]= {value:undefined,timeline:[]};
  }

  /*Metrics[]*/ getMetrics(){
    return this.metrics;
  }

  getValue(metric){
    //console.info('get '+metric+', v='+ registry.values[metric]);
    return registry.values[metric];
  }


  updateGauges(gauges){
    for(let m in gauges ){
       if(!this.metrics[m]){
         this.register(m,TYPES.GAUGE);
       }

       if( gauges[m].value ){
         // java metrics
         this.values[m].value= gauges[m].value;
       }else{
         // node-measured
         this.values[m].value= gauges[m];
       }

       if(this.values[m].timeline.length>MAX_TIMELINE_LENGTH){
         this.values[m].timeline.shift();
       }
       this.values[m].timeline.push([new Date(),registry.values[m].value]);
    }
  }


  // 1MinuteRate,5MinuteRate,15MinuteRate,count,currentRate,mean
  updateMeters(meters){
    for(let m in meters ){
       if(!this.metrics[m]){
         registry.register(m,TYPES.METER);
       }

       registry.values[m].value= meters[m];

        if(registry.values[m].timeline.length>MAX_TIMELINE_LENGTH){
          registry.values[m].timeline.shift();
        }
        registry.values[m].timeline.push([new Date(),registry.values[m].value.currentRate]); //TODO: 1MinuteRate,5MinuteRate,15MinuteRate ?

    }

  }


  // meter (node-metered): 1MinuteRate,5MinuteRate,15MinuteRate,count,currentRate,mean
  // histogram (node-metered): count,max,mean,median,min,p75,p95,p99,p999,stddev,sum,variance
  // timer (java metrics): count,max,mean,min,p50,p75,p95,p98,p99,p999,stddev,m15_rate,m1_rate,m5_rate,mean_rate,duration_units,rate_units
  updateTimers(timers){
    for(let m in timers ){
       if(!this.metrics[m]){
         registry.register(m,TYPES.TIMER);
       }
       if(timers[m].meter && timers[m].histogram){
         // node-measured
         registry.values[m].value= timers[m].meter;
         registry.values[m].value.mean_rate= timers[m].meter.mean; // mean will be overwritten by histogram (TODO: dropwizzard metrics?)
         angular.extend(registry.values[m].value,timers[m].histogram);
       }else{
         // DropWizzard metrics
         registry.values[m].value= timers[m];
       }

       if(registry.values[m].timeline.length>MAX_TIMELINE_LENGTH){
             registry.values[m].timeline.shift();
        }
        // mean timeline
        registry.values[m].timeline.push([new Date(),registry.values[m].value.mean]); //TODO: 1MinuteRate,5MinuteRate,15MinuteRate ?
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

  onUpdate(callback){
    this.listeners.push(callback);
    var listeners= this.listeners;
    return function(){
      var idx= listeners.indexOf(callback);
      listeners.splice(idx,1);
    };
  }


  restoreRegistry(rgJson){

   function convertValues(values){
      for(let mx in values){
          if( values[mx].timeline ){
              var i, tmline= values[mx].timeline;
              for(i=0; i< tmline.length; i++){
                  tmline[i][0]= new Date(tmline[i][0]);
              }
          }
      }
      return values;
    }

    var rg= JSON.parse(rgJson);
    this.metrics= rg.metrics;
    this.values= convertValues(rg.values);
    this.notifyUpdate();
  }

  exportRegistry(){
    return {
      metrics: this.metrics,
      values: this.values
    };
  }

}


export var registry= new MetricsRegistry();
