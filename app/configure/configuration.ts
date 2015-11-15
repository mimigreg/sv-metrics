import {DEFAULT_CONF} from 'configure/defaults';

function copyProperties(propNames, source, target){
  for (var i = 0; i < propNames.length; i++) {
    target[propNames[i]] = source[propNames[i]];
  }
  return target;
}

function shallowCopy<T>(source: any, target: T): T {
  for(var p in source){
    if(typeof source[p] !== 'object' && !p.startsWith('$$')){ // don't copy objects or angular properties ($$hashKey,...)
      target[p]=source[p];
    }
  }
  return target;
}

function shallowArrayCopy(array: any[]): any[]{
  var cp = [];
  for (var i = 0; i < array.length; i++) {
    cp[i]= shallowCopy(array[i],{});
  }
  return cp;
}

export class Chart {
  name: string;
  desc: string;
  type: number;
  width: number;
  height: number;
  series: {metricId: string, name: string}[];

  constructor(name?: string, desc?: string, type?: number){
    this.name = name;
    this.desc = desc;
    this.type = type;
    this.width = 2;
    this.height = 2;
    this.series = [];
  }

  public static restore(source: any): Chart {
    var chart = new Chart();
    chart = shallowCopy(source,new Chart());
    chart.series = shallowArrayCopy(source.series);
    return chart;
  }

  public save(): any {
    var savedChart: any = shallowCopy(this,{});
    savedChart.series = shallowArrayCopy(this.series);
    return savedChart;
  }
}

export class Dashboard {

  name: string;
  desc: string;
  charts: Chart[];

  constructor(name: string = '', desc: string = '', charts: Chart[] = []) {
    this.name = name;
    this.desc = desc;
    this.charts = charts;
  }

  public static restore(source: any, charts: Chart[]): Dashboard{
    var restoredDash = shallowCopy(source, new Dashboard());
    restoredDash.charts = source.charts.map(chartIdx => charts[chartIdx]);
    return restoredDash;
  }

  public save(): any{

    function findIndex(arr: any[], elm:any): number { // typescript missing Array.findIndex :-(
          for(let i = 0; i < arr.length; i++){
              if(arr[i] === elm) return i;
          }
    }

    // find indeces of contained charts (avoid stringifying references)
    var chartIdxs = this.charts.map(
      sc => findIndex(this.charts,sc)
    );
    var copiedDash: any = shallowCopy(this,{});
    copiedDash.charts = chartIdxs;
    return copiedDash;
  }
}

export enum SAVE_ON_FLAG {
  NEVER= 0,
  ON_MODIFICATION= 1,
  ON_EXIT= 2
};

class ConfigData{

    saved: string; // serialised Date
    global: any;
    metricsUrl: string;
    metricsInterval: number; // seconds (metrics fetch interval)
    metricsFetch: boolean; // false - metrics fetch is paused
    chartRefresh: number; // 0 no automatic refresh, 1 refresh when new metrics data
    saveOn: SAVE_ON_FLAG; // 0 - never, 1 - on modification, 2 - on exit

    charts: Chart[];
    dashboards: Dashboard[];

    constructor(){
        this.saveOn = SAVE_ON_FLAG.ON_EXIT;
        this.saved = undefined;
        this.global = {};
        this.charts = [];
        this.dashboards = []
    }

    private restoreCharts(charts: any[]): Chart[]{
      let copiedCharts: Chart[] = [];
      for (var i = 0; i < charts.length; i++) {
        copiedCharts.push(Chart.restore(charts[i]));
      }
      return copiedCharts;
    }

    public restore(source: any): void {
      shallowCopy(source, this);
      this.charts = this.restoreCharts(source.charts);
      this.dashboards = source.dashboards.map( d => Dashboard.restore(d, this.charts) );
    }

}


export class Configuration{

  dirty: boolean= false;

  conf: ConfigData= new ConfigData();

  /** save configuration immediatly or set dirty=false (depending on the 'saveOn' flag) */
  public toBeSaved(){
    if(this.conf.saveOn === SAVE_ON_FLAG.ON_MODIFICATION){
      this.save();
      this.dirty = false;
    }else{
      this.dirty = true;
    }
  };

  public getConfiguration(){
    return this.conf;
  };

  public getDashboards(){
    return this.conf.dashboards;
  };

  public getCharts(){
    return this.conf.charts;
  };

  public removeChart(chartIdx){
    var ch = this.conf.charts[chartIdx];
    for (var i = 0; i < this.conf.dashboards.length; i++) {
      var dash = this.conf.dashboards[i];
      for (var ii = 0; ii < dash.charts.length; ii++) {
        if(dash.charts[ii] === ch){
          dash.charts.splice(ii, 1);
          break; // max. once per dashboard
        }
      }
    }
    this.conf.charts.splice(chartIdx, 1);
    this.toBeSaved();
  };

  public save() {

    this.conf.saved = new Date().toISOString();

    var copiedConf: any = shallowCopy(this.conf,{});

    copiedConf.charts = this.conf.charts.map( chart => chart.save() );

    copiedConf.dashboards =  this.conf.dashboards.map( d => d.save() );

    window.localStorage.setItem('cfg', JSON.stringify(copiedConf));
    this.dirty= false;
  };

  public restore(cfgStr: string = undefined){
    if(!cfgStr){
        cfgStr = window.localStorage.getItem('cfg');
    }
    this.conf.restore(JSON.parse(cfgStr));
    this.dirty = false;
  };

  public restoreDefault(){
    this.conf.restore(DEFAULT_CONF);
    this.dirty = false;
  }
};

export var configuration = new Configuration();

try{
  configuration.restore();
}catch(err){
  console.error(err);
  window.alert('Error retoring configuration!');
  configuration.restoreDefault();
}
