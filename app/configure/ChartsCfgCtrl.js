import {configuration} from 'configure/configuration';


export function ChartsCfgCtrl($scope){

  $scope.charts= configuration.getCharts();
}
