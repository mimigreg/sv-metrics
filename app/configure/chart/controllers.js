import {configuration} from 'configure/configuration';
import {registry} from 'metrics/MetricsRegistry'

export function ChartsCfgCtrl($scope,$location){

      $scope.configuration= configuration.getConfiguration();
      $scope.charts= configuration.getCharts();

      $scope.add= function(){

        $location.path("/configure/charts/new");
      }

      $scope.remove= function(chartIdx){
        configuration.removeChart(chartIdx);
      }

};

function AddMetricsCtrl($scope, $mdDialog, chart){

  var registeredMetrics= registry.getMetrics();
  $scope.metricsWrapper=[];
  for( var mx in registeredMetrics){
    var m= {metricId:mx,inChart:false};
    for( var srs of chart.series){
      if(mx===srs.metricId){
        m.inChart=true;
        m.name=srs.name;
      }
    };
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
            name:w.name,
            width: width,
            height:height
          }
        );
      }
    }
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };
}

/** Shallow copy */
function copyChart(chart){
  var cp={
    name: chart.name,
    desc: chart.desc,
    width: chart.width,
    height:chart.height,
    series:[]
  };
  for(var s of chart.series){
    cp.series.push(s);
  }
  return cp;
}

export function ChartModifCtrl($scope,$routeParams,$mdDialog,$location){


  if($routeParams.chartId=='new'){
    $scope.chart= {
      name:"",
      desc:"",
      width:2,
      height:2,
      series:[]
    };
  }else{
    $scope.chartId= $routeParams.chartId;
    $scope.chart= copyChart(configuration.getCharts()[$scope.chartId])
  };

  $scope.addMetrics= function(ev){
    $mdDialog.show({
      controller: AddMetricsCtrl,
      templateUrl: 'configure/chart/metrics-list.html',
      targetEvent: ev,
      locals:{chart:$scope.chart}
    });
  };

  $scope.removeMetric= function(index){
    var series= $scope.chart.series;
    series.splice(index,1);
  };

  $scope.ok= function(){
    if($scope.chartId){
      var ch= configuration.getCharts()[$scope.chartId];
      ch.name= $scope.chart.name;
      ch.desc= $scope.chart.desc;
      ch.width= $scope.chart.width;
      ch.height= $scope.chart.height;
      ch.series= $scope.chart.series;
    }else{
      configuration.getCharts().push($scope.chart);
    }
    $location.path("/configure/charts");
  }

  $scope.cancel= function(){
    $location.path("/configure/charts");
  }

}
