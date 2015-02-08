const DEFAULT_CHARTS=[
  { // 0
    name:"JVM Heap",
    desc:"JVM heap chart",
    size:'S',
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
    size:'M',
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
    size:'L',
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
    size:'M',
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
    charts: [2,3]
  }
];


export const DEFAULT_CONF= {

  metricsUrl: '/metrics',
  metricsInterval: 5, // seconds
  chartRefresh: 1, // 0 no automatic refresh, 1 refresh when new metrics data

  charts: DEFAULT_CHARTS,
  dashboards: DEFAULT_DASHBOARDS
};
