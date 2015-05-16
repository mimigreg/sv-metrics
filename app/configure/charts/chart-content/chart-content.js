import {registry} from 'metrics/MetricsRegistry';


export function ChartContentCtrl($scope, $mdDialog, chart){

  var registeredMetrics= registry.getMetrics();
  $scope.metricsWrapper=[];
  for( var mx in registeredMetrics){
    var m= {metricId:mx,inChart:false};
    for( var srs of chart.series){
      if(mx===srs.metricId){
        m.inChart=true;
        m.name=srs.name;
      }
    }
    $scope.metricsWrapper.push(m);
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
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };
}
