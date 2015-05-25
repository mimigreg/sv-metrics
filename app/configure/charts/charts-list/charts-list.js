import {configuration} from 'configure/configuration';
import {registry} from 'metrics/MetricsRegistry';
import {CHART_TYPE_INFOS} from 'chart/types';

export function ChartsCfgCtrl($scope,$location){

      $scope.configuration= configuration.getConfiguration();
      $scope.charts= configuration.getCharts();
      $scope.chartTypeInfos= CHART_TYPE_INFOS;

      $scope.add= function(){
        $location.path("/configure/charts/new");
      };

      $scope.remove= function(chartIdx){
        configuration.removeChart(chartIdx);
      };

}
