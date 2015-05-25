import {registry} from 'metrics/MetricsRegistry';
import {CHART_TYPE_INFOS} from 'chart/types';

export function ChartContentCtrl($scope, $mdDialog, chart){

  var registeredMetrics= registry.getMetrics();

  function isCompatibleMetric(chart,mx){
    var allowed= CHART_TYPE_INFOS[chart.type].metrics;
    var mxType= registeredMetrics[mx].type;
    return allowed.indexOf(mxType)>-1;
  }

  $scope.metricsWrapper=[];
  for( var mx in registeredMetrics){
    if( isCompatibleMetric(chart,mx) ){ // only allowed types
      var m= {metricId:mx,inChart:false};
      for( var srs of chart.series){
        if(mx===srs.metricId){
          m.inChart=true;
          m.name=srs.name;
        }
      }
      $scope.metricsWrapper.push(m);
    }
  }


  $scope.ok = function(metricsWrapper) {
    $mdDialog.hide();
    chart.series= [];
    for(var w of metricsWrapper){
      if(w.inChart){
        chart.series.push(
          {
            metricId:w.metricId,
            name:w.name
          }
        );
      }
    }
    configuration.dirty= true;
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };
}
