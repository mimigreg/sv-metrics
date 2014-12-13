var charts=[
  { // 0
    name:"JVM Heap",
    series: [
      {
        name:"Heap Used",
        metricId:"jvm.memory.heap.used"
      },{
        name:"Heap Max",
        metricId:"jvm.memory.heap.max"
      }
    ]
  },{ // 1
    name:"JVM Memory",
    series: [
      {
        name:"Total Used",
        metricId:"jvm.memory.total.used"
      },{
        name:"Max",
        metricId: "jvm.memory.total.max"
      }
    ]
  },{ // 2
        name:"Heap (Node)",
        series: [
          {
            name:"total",
            metricId:"node.process.memory.heap.total"
          },{
            name:"used",
            metricId: "node.process.memory.heap.used"
          }
        ]
    },{ // 3
        name:"Load (Node)",
        series: [
          {
            name:"load - 1min",
            metricId:"node.os.loadavg1"
          },{
            name:"load - 5min",
            metricId:"node.os.loadavg5"
          },{
            name:"load - 15min",
            metricId:"node.os.loadavg15"
          }
        ]
    }
]

var dashboards= [
  {
    name: "dashboard JVM",
    desc: "View of main JVM Metrics",
    charts: [ charts[0],charts[1]]
  },
  {
    name: "dashboard NodeJS",
    desc: "Main Node.js metrics charts",
    charts: [charts[2],charts[3]]
  }
];


var conf= {

    metricsUrl: '/metrics',
    metricsInterval: 5, // seconds
    chartRefresh: 1 // 0 no automatic refresh, 1 refresh when new metrics data
};

export var configuration={

  getConfiguration: function(){
    return conf;
  },

  getDashboards: function(){
    return dashboards;
  },

  getCharts: function(){
    return charts;
  },

  removeChart: function(chartIdx){
    var ch= charts[chartIdx];
    for (var i = 0; i < dashboards.length; i++) {
      var dash= dashboards[i];
      for (var ii = 0; ii < dash.charts.length; ii++) {
        if(dash.charts[ii]===ch){
          dash.charts.splice(ii,1);
          break; // max. once per dashboard
        }
      }
    }
    charts.splice(chartIdx,1);
  }

}
