const DEFAULT_CHARTS=[
  { // 0
    name:"JVM Heap",
    desc:"JVM heap chart",
    width:4,
    height:2,
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
    width:2,
    height:2,
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
    width:4,
    height:2,
    series: [
      {
        name:"total",
        metricId:"node.memory.heap.total"
      },{
        name:"used",
        metricId: "node.memory.heap.used"
      }
    ]
  },{ // 3
    name:"RSS (Node)",
    width:2,
    height:2,
    series: [
      {
        name:"total",
        metricId:"node.memory.rss"
      }
    ]
  },{ // 4
    name:"Load (Node)",
    width:6,
    height:2,
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
  },{ // 5
    name:"Mem OS",
    width:6,
    height:2,
    series: [
      {
        name:"freemem",
        metricId:"node.os.freemem"
      },{
        name:"totalmem",
        metricId:"node.os.totalmem"
      }
    ]
  }
];

const DEFAULT_DASHBOARDS= [
  {
    name: "dashboard JVM",
    desc: "View of main JVM Metrics",
    charts: [0,1]
  },
  {
    name: "dashboard NodeJS",
    desc: "Main Node.js metrics charts",
    charts: [2,3,4]
  },
  {
    name: "dashboard System",
    desc: "OS metrics charts",
    charts: [4,5]
  }
];


export const DEFAULT_CONF= {

  metricsUrl: '/metrics',
  metricsInterval: 5, // seconds
  chartRefresh: 1, // 0 no automatic refresh, 1 refresh when new metrics data

  charts: DEFAULT_CHARTS,
  dashboards: DEFAULT_DASHBOARDS
};
