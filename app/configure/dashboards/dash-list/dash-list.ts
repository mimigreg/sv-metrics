import {configuration} from 'configure/configuration';

export function DashListCtrl($scope, $location): void {

      'use strict';

      $scope.configuration = configuration.getConfiguration();

      $scope.add = function(){

        $location.path('/configure/dashboards/new');
      };

      $scope.remove = function(dashIdx){
        let dashboards = configuration.getDashboards();
        dashboards.splice(dashIdx, 1);
        configuration.toBeSaved();
      };

}
