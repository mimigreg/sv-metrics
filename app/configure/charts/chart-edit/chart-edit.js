import {configuration} from 'configure/configuration';
import {ChartContentCtrl} from 'configure/charts/chart-content/chart-content';
import {CHART_TYPES} from 'chart/types';


export function ChartEditCtrl($scope,$routeParams,$mdDialog,$location){


  if($routeParams.chartId=='new'){
    $scope.chart= {
      name:"",
      desc:"",
      width:2,
      height:2,
      type: CHART_TYPES.GAUGE,
      series:[]
    };
  }else{
    $scope.chartId= $routeParams.chartId;
    $scope.chart= copyChart(configuration.getCharts()[$scope.chartId]);
  }

  $scope.addMetrics= function(ev){
    $mdDialog.show({
      controller: ChartContentCtrl,
      templateUrl: 'configure/charts/chart-content/chart-content.html',
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
      ch.type= Number.parseInt($scope.chart.type);
      ch.series= $scope.chart.series;
    }else{
      configuration.getCharts().push($scope.chart);
    }
    $location.path("/configure/charts");
  };

  $scope.cancel= function(){
    $location.path("/configure/charts");
  };

}

/** Shallow copy */
function copyChart(chart){
  var cp={
    name: chart.name,
    desc: chart.desc,
    width: chart.width,
    height:chart.height,
    type: chart.type,
    series:[]
  };
  for(var s of chart.series){
    cp.series.push(s);
  }
  return cp;
}