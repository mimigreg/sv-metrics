import {DEFAULT_CONF} from "configure/defaults";

function copyProperties(propNames,source,target){
  for (var i = 0; i < propNames.length; i++) {
    target[propNames[i]]= source[propNames[i]];
  }
  return target;
}

function shallowCopy(source,target):any {
  for(var p in source){
    if(typeof source[p]!=="object" && !p.startsWith('$$')){ // don't copy objects or angular properties ($$hashKey,...)
      target[p]=source[p];
    }
  }
  return target;
}

function shallowArrayCopy(array:any[]):any[]{
  var cp= [];
  for (var i = 0; i < array.length; i++) {
    cp[i]= shallowCopy(array[i],{});
  }
  return cp;
}

function copyCharts(charts) {
  var copiedCharts= [];
  for (var i = 0; i < charts.length; i++) {
    copiedCharts[i]= shallowCopy(charts[i],{});
    copiedCharts[i].series= shallowArrayCopy(charts[i].series);
  }
  return copiedCharts;
}

function restoreDash(dash,charts) {
  var restoredDash= shallowCopy(dash,{});
  restoredDash.charts= dash.charts.map(chartIdx=>charts[chartIdx]);
  return restoredDash;
}

function resotreDashboards(dashs,charts) {
  return dashs.map( d => restoreDash(d,charts) );
}

function restoreConfig(sourceConf,targetConf) {
  shallowCopy(sourceConf,targetConf);
  targetConf.charts= copyCharts(sourceConf.charts);
  targetConf.dashboards= resotreDashboards(sourceConf.dashboards,targetConf.charts);
  return targetConf;
}

export interface Chart{
  name:string,
  desc:string,
  width:number,
  height:number,
  type:number,
  series:{metricId:string,name:string}[]
}

export interface Dashboard{
  name:string,
  desc:string,
  charts:Chart[]
}

export enum SAVE_ON_FLAG {
  NEVER= 0,
  ON_MODIFICATION= 1,
  ON_EXIT= 2
};

class ConfigData{

    saved:string; // serialised Date
    global: any;
    metricsUrl: string;
    metricsInterval: number; // seconds (metrics fetch interval)
    metricsFetch: boolean; // false - metrics fetch is paused
    chartRefresh: number; // 0 no automatic refresh, 1 refresh when new metrics data
    saveOn: SAVE_ON_FLAG; // 0 - never, 1 - on modification, 2 - on exit

    charts: Chart[];
    dashboards: Dashboard[];

    constructor(){
        this.saveOn= SAVE_ON_FLAG.ON_EXIT;
        this.saved= undefined;
        this.global= {};
        this.charts= [];
        this.dashboards= []
    }
}

var conf:ConfigData= new ConfigData();


export var configuration={

  dirty: false,

  /** save configuration immediatly or set dirty=false (depending on the 'saveOn' flag) */
  toBeSaved: function(){
    if(conf.saveOn===SAVE_ON_FLAG.ON_MODIFICATION){
      this.save();
      this.dirty= false;
    }else{
      this.dirty= true;
    }
  },

  getConfiguration: function(){
    return conf;
  },

  getDashboards: function(){
    return conf.dashboards;
  },

  getCharts: function(){
    return conf.charts;
  },

  removeChart: function(chartIdx){
    var ch= conf.charts[chartIdx];
    for (var i = 0; i < conf.dashboards.length; i++) {
      var dash= conf.dashboards[i];
      for (var ii = 0; ii < dash.charts.length; ii++) {
        if(dash.charts[ii]===ch){
          dash.charts.splice(ii,1);
          break; // max. once per dashboard
        }
      }
    }
    conf.charts.splice(chartIdx,1);
    this.toBeSaved();
  },

  save: function() {

    conf.saved= new Date().toISOString();

    var copiedConf= shallowCopy(conf,{});

    copiedConf.charts= copyCharts(conf.charts);

    var copiedDashs=
      conf.dashboards.map(function(d){

        function findIndex(arr:any[],elm:any):number{ // typescript missing Array.findIndex :-(
          for(let i=0; i<arr.length; i++){
            if(arr[i]===elm) return i;
          }
        }

        // find indeces of contained charts (avoid stringifying references)
        var chartIdxs= d.charts.map(function(sc){
            return findIndex(conf.charts,sc);
        });
        var copiedDash= shallowCopy(d,{});
        copiedDash.charts= chartIdxs;
        return copiedDash;
      });
      copiedConf.dashboards= copiedDashs;

    window.localStorage.setItem("cfg",JSON.stringify(copiedConf));
    this.dirty= false;
  },

  restore: function(cfgStr:string=undefined){
    if(!cfgStr){
        cfgStr= window.localStorage.getItem("cfg");
    }
    restoreConfig(JSON.parse(cfgStr),conf);
    this.dirty= false;
  },

  restoreDefault: function(){
    conf= restoreConfig(DEFAULT_CONF,conf);
    this.dirt= false;
  }
};

try{
  configuration.restore();
}catch(err){
  console.error(err);
  window.alert('Error retoring configuration!');
  configuration.restoreDefault();
}
