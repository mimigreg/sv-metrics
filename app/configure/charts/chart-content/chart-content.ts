import {registry} from 'metrics/MetricsRegistry';
import {CHART_TYPE_INFOS} from 'chart/types';
import {Chart,configuration} from 'configure/configuration';

export function ChartContentCtrl($scope, $mdDialog, chart:Chart){

  var registeredMetrics= registry.getMetrics();

  function isCompatibleMetric(chart:Chart,mx:string){
    var allowed= CHART_TYPE_INFOS[chart.type].metrics;
    var mxType= registeredMetrics.get(mx).getType();
    return allowed.indexOf(mxType)>-1;
  }

  $scope.metricsWrapper=[];
  registeredMetrics.forEach(function(mxVal,mx){
    if( isCompatibleMetric(chart,mx) ){ // only allowed types
      var m= {name:'',metricId:mx,inChart:false};
      for( var srs of chart.series){
        if(mx===srs.metricId){
          m.inChart=true;
          m.name=srs.name;
        }
      }
      $scope.metricsWrapper.push(m);
    }
  });


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
    configuration.toBeSaved();
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };
}
