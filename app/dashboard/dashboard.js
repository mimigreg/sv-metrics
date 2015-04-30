import {registry} from 'metrics/MetricsRegistry';
import {configuration} from 'configure/configuration';


export function DashboardController($scope,$routeParams){

      $scope.dashboardId= $routeParams.dashboardId;

      $scope.dashboard= configuration.getDashboards()[$routeParams.dashboardId];
      $scope.charts= $scope.dashboard.charts;

      var unregisterCBs= [];

      for(var chart of $scope.dashboard.charts){

          unregisterCBs.push(
            registry.onUpdate(function(){

                $scope.$broadcast("mx-ud");
          }));

      };


      $scope.$destroy= function(){
        //console.log("$destroy "+$scope.$id);
        for(let cb of unregisterCBs){
          cb();  
        }

      };
}
