import {registry} from 'core/MetricsRegistry';
import {configuration} from 'configure/configuration';


export function DashboardController($scope, $routeParams) {

      $scope.dashboardId = $routeParams.dashboardId;

      $scope.dashboard = configuration.getDashboards()[$routeParams.dashboardId];
      $scope.charts = $scope.dashboard.charts;

      let unregisterCBs: Function[] = [];

      for(var chart of $scope.dashboard.charts){
          unregisterCBs.push(
            registry.onUpdate( () => $scope.$broadcast('mx-ud') )
          );

      }


      $scope.$destroy = function(){
        for(let cb of unregisterCBs){
          cb();
        }

      };
}
