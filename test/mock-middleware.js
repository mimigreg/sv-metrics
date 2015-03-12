var os= require('os');

var mock= {
  "gauges":{
      "jvm.memory.heap.used":{"value":31000000},
      "jvm.memory.heap.max":{"value":53703504},
      "jvm.memory.total.used":{"value":38703504},
      "jvm.memory.total.max":{"value":58703504},

      "threads.count":{"value":57},
      "threads.peakCount":{"value":58},
      "jvm.threads.http":{"value":5},
      "jvm.threads.ajp":{"value":3},
      "jvm.memory.total":{"value":51703504},
      "jvm.memory.free":{"value":28274864},
      "jvm.memory.max":{"value":71849728},
      "os.loadAverage":{"value":1.0},

      "cometd.channels":{"value":60},
      "cometd.sessions":{"value":7},

      "node.process.memory.rss":{"value":0},
      "node.process.memory.heap.total":{"value":0},
      "node.process.memory.heap.used":{"value":0},
      "node.os.loadavg1":{"value":1},
      "node.os.loadavg5":{"value":5},
      "node.os.loadavg15":{"value":3},
      "node.os.totalmem":{"value":3},
      "node.os.freemem":{"value":3}
  }
};

function change(){

  mock.gauges["jvm.memory.heap.used"].value+=Math.round(Math.random()*4000000-2000000);
  mock.gauges["jvm.memory.heap.max"].value+=Math.round(Math.random()*4000000-2000000);
  mock.gauges["jvm.memory.total.used"].value+=Math.round(Math.random()*4000000-2000000);
  mock.gauges["jvm.memory.total.max"].value+=Math.round(Math.random()*4000000-2000000);

  mock.gauges["jvm.memory.total"].value+=Math.round(Math.random()*1000000-500000);
  mock.gauges["jvm.memory.free"].value+=Math.round(Math.random()*1000000-500000);
  mock.gauges["jvm.memory.max"].value+=Math.round(Math.random()*1000000-500000);

  mock.gauges["cometd.channels"].value= Math.round(Math.random()*20+2);
  mock.gauges["cometd.sessions"].value= Math.round(Math.random()*20+10);

  mock.gauges["node.process.memory.rss"].value= process.memoryUsage().rss;
  mock.gauges["node.process.memory.heap.total"].value= process.memoryUsage().heapTotal;
  mock.gauges["node.process.memory.heap.used"].value= process.memoryUsage().heapUsed;

  mock.gauges["node.os.loadavg1"].value= os.loadavg()[0];
  mock.gauges["node.os.loadavg5"].value= os.loadavg()[1];
  mock.gauges["node.os.loadavg15"].value= os.loadavg()[2];

  mock.gauges["node.os.totalmem"].value= os.totalmem();
  mock.gauges["node.os.freemem"].value= os.freemem();
}

module.exports= function(req,res,next){
  console.log("url: "+req.url+", method:"+req.method);
  if(req.url=='/metrics'){
    change();
    var jsonRes = JSON.stringify(mock);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Length', jsonRes.length);
    res.end(jsonRes);
  }else{
    next();
  }
}
