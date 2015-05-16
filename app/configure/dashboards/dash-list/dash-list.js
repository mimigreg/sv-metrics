import {configuration} from 'configure/configuration';

export function DashListCtrl($scope,$location){

      $scope.configuration= configuration.getConfiguration();

      $scope.add= function(){

        $location.path("/configure/dashboards/new");
      };

      $scope.remove= function(dashIdx){
        var dashboards= configuration.getDashboards();
        dashboards.splice(dashIdx,1);
      };

}
