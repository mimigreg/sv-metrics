import {registry} from 'metrics/MetricsRegistry';
import {configuration} from 'configure/configuration';


export function DashboardController($scope,$routeParams){

      $scope.dashboardId= $routeParams.dashboardId;

      $scope.selectedIndex= 0;
      $scope.dashboard= configuration.getDashboards()[$routeParams.dashboardId];
      $scope.charts= $scope.dashboard.charts;

      for(var chart of $scope.dashboard.charts){

          var unregisterCB= registry.onUpdate(function(){

                $scope.$broadcast("mx-ud");
          });

      };


      $scope.$destroy= function(){
        //console.log("$destroy "+$scope.$id);
        unregisterCB();
      };
}
