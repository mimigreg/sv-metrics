import {configuration} from 'configure/configuration';
import {CHART_TYPE_INFOS} from 'chart/types';

export function ChartsCfgCtrl($scope, $location): void {

      'use strict';

      $scope.configuration = configuration.getConfiguration();
      $scope.charts = configuration.getCharts();
      $scope.chartTypeInfos = CHART_TYPE_INFOS;

      $scope.add = function(){
        $location.path('/configure/charts/new');
      };

      $scope.remove = function(chartIdx){
        configuration.removeChart(chartIdx);
      };

}
