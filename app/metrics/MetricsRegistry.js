var MAX_TIMELINE_LENGTH=100;


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
    this.values[id]= {value:undefined,timeline:[]}
  }

  /*Metrics[]*/ getMetrics(){
    return this.metrics;
  }

  getValue(metric){
    return registry.values[metric];
  }

  update(metrics){
    var gauges= metrics["gauges"];
    for(var m in gauges ){
       if(!this.metrics[m]){
         registry.register(m,"gauges");
       }

       if( gauges[m].value ){
         // java metrics
         registry.values[m].value= gauges[m].value;
       }else{
         // node-measured
         registry.values[m].value= gauges[m];
       }

       if(registry.values[m].timeline.length>MAX_TIMELINE_LENGTH){
         registry.values[m].timeline.shift();
       }
       registry.values[m].timeline.push([new Date(),registry.values[m].value]);
    }
    for(var l of this.listeners){
      l();
    }
  }

  onUpdate(callback){
    this.listeners.push(callback);
    return function(){
      var idx= this.listeners.indexOf(callback);
      this.listener.splice(idx,1);
    }
  }

}

export var registry= new MetricsRegistry();
