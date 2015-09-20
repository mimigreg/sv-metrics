
export class Metric{

  update(obj){
    throw Error('Not implemented!');
  }

  static importMetric(obj:any):Metric{
    var mx:Metric;
    if(obj.hasOwnProperty('m1_rate') & obj.hasOwnProperty('p75')){
      mx= new Timer();
    }else if( obj.hasOwnProperty('m1_rate') ){
      mx= new Meter();
    }else if( obj.hasOwnProperty('p75') ){
      mx= new Histogram();
    }else if( obj.hasOwnProperty('value') ){
      mx= new Gauge();
    }else if( obj.hasOwnProperty('count') ){
      mx= new Counter();
    }else{
      throw Error('Class not found!'+obj);
    }
    mx.update(obj);
    return mx;
  }
}

export class Gauge extends Metric{

  value:number;

  update(obj){
    if( obj.value ){
      // java metrics
      this.value= obj.value;
    }else{
      // node-measured
      this.value= obj;
    }
  }

}

export class Counter extends Metric{
  count:number
}

export class Meter extends Counter{
  m1_rate:number= 0;
  m5_rate:number= 0;
  m15_rate:number= 0;
  //currentRate:number, //  -> node-mesured
  mean_rate:number= 0;

  update(obj){
    this.m1_rate= <number>( obj.m1_rate ? obj.m1_rate : obj['1MinuteRate'] ); // dropwizard:nodemeasured
    this.m5_rate= <number>( obj.m1_rate ? obj.m1_rate: obj['5MinuteRate'] );
    this.m15_rate= <number>( obj.m1_rate ? obj.m1_rate : obj['15MinuteRate'] );
    this.count= <number>obj.count;
    //this.currentRate= <number>obj.currentRate,
    this.mean_rate= <number>( obj.mean ? obj.mean : obj.mean_rate )
  }
}

export class Histogram extends Counter{
  count:number;
  max:number; mean:number; median:number; min:number;
  p50:number; // not in node-mesured
  p75:number; p95:number; p98:number; p99:number; p999:number;
  stddev:number; sum:number; variance:number;

  update(obj){
    this.max= <number>obj.histogram.max;
    this.mean= <number>obj.histogram.mean;
    this.min= <number>obj.histogram.min;
    this.p50= <number>obj.histogram.p50;
    this.p75= <number>obj.histogram.p75;
    this.p95= <number>obj.histogram.p95;
    this.p98= <number>obj.histogram.p98;
    this.p99= <number>obj.histogram.p99;
    this.p999= <number>obj.histogram.p999;
    this.stddev= <number>obj.histogram.stddev;
    this.median= <number>obj.histogram.median;
    this.sum= <number>obj.histogram.sum;
    this.variance= <number>obj.histogram.variance;
  }
}

export class Timer extends Meter implements Histogram{

  // Histogram (implemented)
  max:number; mean:number; median:number; min:number;
  p50:number; // not in node-mesured
  p75:number; p95:number; p98:number; p99:number; p999:number;
  stddev:number; sum:number; variance:number;

  duration_units:string;
  rate_units:string;

  update(obj){
    if(obj.meter && obj.histogram){
      // node-measured
      this.m1_rate= <number>obj.meter['1MinuteRate'];
      this.m5_rate= <number>obj.meter['5MinuteRate'];
      this.m15_rate= <number>obj.meter['15MinuteRate'];
      this.count= <number>obj.meter.count;
      //this.currentRate= <number>obj.meter.currentRate;  // node-mesured
      this.mean_rate= <number>obj.meter.mean;
      this.max= <number>obj.histogram.max;
      this.mean= <number>obj.histogram.mean;
      this.min= <number>obj.histogram.min;
      this.p50= <number>obj.histogram.p50;
      this.p75= <number>obj.histogram.p75;
      this.p95= <number>obj.histogram.p95;
      this.p98= <number>obj.histogram.p98;
      this.p99= <number>obj.histogram.p99;
      this.p999= <number>obj.histogram.p999;
      this.stddev= <number>obj.histogram.stddev;
      this.median= <number>obj.histogram.median;
      this.sum= <number>obj.histogram.sum;
      this.variance= <number>obj.histogram.variance;
      this.duration_units= <string>obj.histogram.duration_units;
      this.rate_units= <string>obj.histogram.rate_units;
  }else{
      // DropWizzard metrics
      this.m1_rate= <number>obj.m1_rate;
      this.m5_rate= <number>obj.m5_rate;
      this.m15_rate= <number>obj.m15_rate;
      this.count= <number>obj.count;
      this.mean_rate= <number>obj.mean_rate;
      this.max= <number>obj.max;
      this.mean= <number>obj.mean;
      this.min= <number>obj.min;
      this.p50= <number>obj.p50;
      this.p75= <number>obj.p75;
      this.p95= <number>obj.p95;
      this.p98= <number>obj.p98;
      this.p99= <number>obj.p99;
      this.p999= <number>obj.p999;
      this.stddev= <number>obj.stddev;
      this.median= <number>obj.median;
      this.sum= <number>obj.sum;
      this.variance= <number>obj.variance;
      this.duration_units= <string>obj.duration_units;
      this.rate_units= <string>obj.rate_units;
    }
  }
}
