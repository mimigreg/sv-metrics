import {CHART_TYPES} from 'chart/types';

const DEFAULT_CHARTS=[
  { // 0
    name:"JVM Heap",
    desc:"JVM heap chart",
    type: CHART_TYPES.BAR,
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
    type: CHART_TYPES.LINE,
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
    name:"JVM Memory (Pie)",
    width:2,
    height:2,
    type: CHART_TYPES.PIE,
    series: [
      {
        name:"Heap Used",
        metricId:"jvm.memory.heap.used"
      },{
        name:"Non-Heap Used",
        metricId: "jvm.memory.non-heap.used"
      }
    ]
  },{ // 3
    name:"Heap (Node)",
    width:4,
    height:2,
    type: CHART_TYPES.LINE,
    series: [
      {
        name:"total",
        metricId:"node.memory.heap.total"
      },{
        name:"used",
        metricId: "node.memory.heap.used"
      }
    ]
  },{ // 4
    name:"RSS (Node)",
    width:2,
    height:2,
    type: CHART_TYPES.LINE,
    series: [
      {
        name:"total",
        metricId:"node.memory.rss"
      }
    ]
  },{ // 5
    name:"Load (Node)",
    width:6,
    height:2,
    type: CHART_TYPES.LINE,
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
  },{ // 6
    name:"Mem OS",
    width:6,
    height:2,
    type: CHART_TYPES.LINE,
    series: [
      {
        name:"freemem",
        metricId:"node.os.freemem"
      },{
        name:"totalmem",
        metricId:"node.os.totalmem"
      }
    ]
  },{ // 7
    name:"Requests per second",
    width:6,
    height:2,
    type: CHART_TYPES.LINE,
    series: [
      {
        name:"req/s",
        metricId:"api.metrics.requestsPerSecond"
      }
    ]
  },{ // 8
    name:"Response Time",
    width:4,
    height:2,
    type: CHART_TYPES.LINE,
    series: [
      {
        name:"resp.time",
        metricId:"api.metrics.responseTime"
      }
    ]
  },{ // 9
    name:"Response Time (histogram)",
    width:2,
    height:2,
    type: CHART_TYPES.HISTOGRAM,
    series: [
      {
        name:"resp.time",
        metricId:"api.metrics.responseTime"
      }
    ]
  },{ // 10
    name:"Rates (requests/sec)",
    width:2,
    height:2,
    type: CHART_TYPES.BULLET,
    series: [
      {
        name:"resp.web",
        metricId:"web.responseTime"
      },{
        name:"resp.metrics",
        metricId:"api.metrics.responseTime"
      },{
        name:"resp.test",
        metricId:"api.test.responseTime"
      }
    ]
  }
];

const DEFAULT_DASHBOARDS= [
  {
    name: "JVM",
    desc: "View of main JVM Metrics",
    charts: [0,1,2]
  },
  {
    name: "NodeJS",
    desc: "Main Node.js metrics charts",
    charts: [3,4,5]
  },
  {
    name: "System",
    desc: "OS metrics charts",
    charts: [5,6]
  },
  {
    name: "REST/APIs",
    desc: "REST/APIs",
    charts: [7,8,9,10]
  }
];


export const DEFAULT_CONF= {

  metricsUrl: '/metrics',
  metricsInterval: 5, // seconds
  chartRefresh: 1, // 0 no automatic refresh, 1 refresh when new metrics data

  charts: DEFAULT_CHARTS,
  dashboards: DEFAULT_DASHBOARDS
};
