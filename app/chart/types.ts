import {TYPES} from 'core/MetricsRegistry';

export const CHART_TYPES={
  LINE: 0,
  HISTOGRAM: 1,
  BULLET: 2,
  BAR: 3,
  PIE:4
};

export const CHART_TYPE_INFOS=[
  {
    name:"Line Chart",
    metrics:[TYPES.GAUGE,TYPES.TIMER,TYPES.METER] // allowed metrics
  },
  {name:"Histogram",    metrics:[TYPES.TIMER,TYPES.HISTOGRAM]},
  {name:"Bullet Chart", metrics:[TYPES.TIMER,TYPES.METER]},
  {name:"Bar Chart",    metrics:[TYPES.GAUGE,TYPES.TIMER,TYPES.METER]},
  {name:"Pie Chart",    metrics:[TYPES.GAUGE,TYPES.TIMER,TYPES.METER]}
];
