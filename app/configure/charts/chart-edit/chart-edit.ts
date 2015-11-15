import {configuration,Chart} from 'configure/configuration';
import {ChartContentCtrl} from 'configure/charts/chart-content/chart-content';
import {CHART_TYPES,CHART_TYPE_INFOS} from 'chart/types';


export function ChartEditCtrl($scope, $routeParams, $mdDialog, $location) {


  if($routeParams.chartId === 'new'){
    $scope.chart = new Chart('', '', CHART_TYPES.LINE);
  }else{
    $scope.chartId = $routeParams.chartId;
    $scope.chart = copyChart(configuration.getCharts()[$scope.chartId]);
  }

  $scope.chartTypesInfos = CHART_TYPE_INFOS;

  $scope.addMetrics = function(ev){
    $mdDialog.show({
      controller: ChartContentCtrl,
      templateUrl: 'configure/charts/chart-content/chart-content.html',
      targetEvent: ev,
      locals: {chart: $scope.chart}
    });
  };

  $scope.removeMetric = function(index){
    var series = $scope.chart.series;
    series.splice(index, 1);
    configuration.toBeSaved();
  };

  $scope.ok = function(){
    var ch: Chart;
    if($scope.chartId){ // edit
      ch = configuration.getCharts()[$scope.chartId];
    }else{ // new
      ch = new Chart();
      configuration.getCharts().push(ch);
    }

    ch.name = $scope.chart.name;
    ch.desc = $scope.chart.desc;
    ch.width = $scope.chart.width;
    ch.height = $scope.chart.height;
    ch.type = parseInt($scope.chart.type);
    ch.series = $scope.chart.series;

    configuration.toBeSaved();

    $location.path('/configure/charts');
  };

  $scope.cancel = function(){
    $location.path('/configure/charts');
  };

}

/** Shallow copy */
function copyChart(chart: Chart): Chart {

  var cp = new Chart(chart.name, chart.desc, chart.type);

  cp.width = chart.width;
  cp.height = chart.height;

  for(var s of chart.series){
    cp.series.push(s);
  }
  return cp;
}
