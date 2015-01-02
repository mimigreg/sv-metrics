import {DEFAULT_CONF} from "configure/defaults";

function copyProperties(propNames,source,target){
  for (var i = 0; i < propNames.length; i++) {
    target[propNames[i]]= source[propNames[i]];
  }
  return target;
}

function shallowCopy(source,target) {
  var cp=target?target:{};
  for(var p in source){
    if(typeof source[p]!=="object" && !p.startsWith('$$')){ // don't copy objects or angular properties ($$hashKey,...)
      cp[p]=source[p];
    }
  }
  return cp;
}

function shallowArrayCopy(array){
  var cp= [];
  for (var i = 0; i < array.length; i++) {
    cp[i]= shallowCopy(array[i]);
  }
  return cp;
}

function copyCharts(charts) {
  var copiedCharts= [];
  for (var i = 0; i < charts.length; i++) {
    copiedCharts[i]= shallowCopy(charts[i]);
    copiedCharts[i].series= shallowArrayCopy(charts[i].series);
  }
  return copiedCharts;
}

function restoreDash(dash,charts) {
  var restoredDash= shallowCopy(dash);
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
}

var conf= {

  global: {},
  charts: [],
  dashboards: []
};

restoreConfig(DEFAULT_CONF,conf);

export var configuration={

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
  },

  save: function() {

    var copiedConf= shallowCopy(conf);

    copiedConf.charts= copyCharts(conf.charts);

    var copiedDashs=
      conf.dashboards.map(function(d){
        // find indeces of contained charts (avoid stringifying references)
        var chartIdxs= d.charts.map(function(sc){
            return conf.charts.findIndex(function(c){
              return c===sc;
            });
        });
        var copiedDash= shallowCopy(d);
        copiedDash.charts= chartIdxs;
        return copiedDash;
      });
      copiedConf.dashboards= copiedDashs;

    window.localStorage.setItem("cfg",JSON.stringify(copiedConf));
  },

  restore: function(){
    var cfg= window.localStorage.getItem("cfg");
    conf= restoreConfig(JSON.parse(cfg),conf);
  },

  restoreDefault: function(){
    conf= restoreConfig(DEFAULT_CONF,conf);
  }

}
