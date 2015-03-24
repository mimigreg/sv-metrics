var os= require('os');
var Measured= require('measured');

var metrics={
  meters: Measured.createCollection(),
  timers: Measured.createCollection(),
  gauges: Measured.createCollection(),
  toJSON: function(){
            return {
              meters:metrics.meters.toJSON(),
              timers:metrics.timers.toJSON(),
              gauges:metrics.gauges.toJSON()
            }
          }
};

var jvmMock= {
      "jvm.memory.heap.used":{"value":31000000},
      "jvm.memory.heap.max":{"value":53703504},
      "jvm.memory.total.used":{"value":38703504},
      "jvm.memory.total.max":{"value":58703504},
      "jvm.memory.total":{"value":51703504},
      "jvm.memory.free":{"value":28274864},
      "jvm.memory.max":{"value":71849728}
};


metrics.gauges.gauge('jvm.memory.heap.used',function() {
  jvmMock["jvm.memory.heap.used"].value+=Math.round(Math.random()*4000000-2000000);
  return jvmMock["jvm.memory.heap.used"].value;
});
metrics.gauges.gauge('jvm.memory.heap.max',function() {
  jvmMock["jvm.memory.heap.max"].value+=Math.round(Math.random()*4000000-2000000);
  return jvmMock["jvm.memory.heap.max"].value;
});
metrics.gauges.gauge('jvm.memory.total.used',function() {
  jvmMock["jvm.memory.total.used"].value+=Math.round(Math.random()*4000000-2000000);
  return jvmMock["jvm.memory.total.used"].value;
});
metrics.gauges.gauge('jvm.memory.total.max',function() {
  jvmMock["jvm.memory.total.max"].value+=Math.round(Math.random()*4000000-2000000);
  return jvmMock["jvm.memory.total.max"].value;
});
metrics.gauges.gauge('jvm.memory.total',function() {
  jvmMock["jvm.memory.total"].value+=Math.round(Math.random()*4000000-2000000);
  return jvmMock["jvm.memory.total"].value;
});
metrics.gauges.gauge('jvm.memory.free',function() {
  jvmMock["jvm.memory.free"].value+=Math.round(Math.random()*4000000-2000000);
  return jvmMock["jvm.memory.free"].value;
});
metrics.gauges.gauge('jvm.memory.max',function() {
  jvmMock["jvm.memory.max"].value+=Math.round(Math.random()*4000000-2000000);
  return jvmMock["jvm.memory.max"].value;
});

metrics.gauges.gauge('node.memory.heap.total',function() {
  return process.memoryUsage().heapTotal;
});
metrics.gauges.gauge('node.memory.heap.used',function() {
  return process.memoryUsage().heapUsed;
});
metrics.gauges.gauge('node.memory.rss',function() {
  return process.memoryUsage().rss;
});
metrics.gauges.gauge('node.os.loadavg1',function() {
  return os.loadavg()[0];
});
metrics.gauges.gauge('node.os.loadavg5',function() {
  return os.loadavg()[1];
});
metrics.gauges.gauge('node.os.loadavg15',function() {
  return os.loadavg()[2];
});
metrics.gauges.gauge('node.os.totalmem',function() {
  return os.totalmem();
});
metrics.gauges.gauge('node.os.freemem',function() {
  return os.freemem();
});

var requestsPerSecond= metrics.meters.meter('requestsPerSecond');
var responseTime= metrics.timers.timer('responseTime');

module.exports= function(req,res,next){

  console.log("url: "+req.url+", method:"+req.method);

  requestsPerSecond.mark();

  var stopWatch= responseTime.start();
  res.on('finish',function(){
    stopWatch.end();
  });

  if(req.url=='/metrics'){
    var jsonRes = JSON.stringify(metrics.toJSON());
    //console.log(jsonRes);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Length', jsonRes.length);
    res.end(jsonRes);
  }else{
    next();
  }
}
