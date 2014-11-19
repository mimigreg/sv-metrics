import {configuration} from 'configure/configuration';

export function DashsCfgCtrl($scope){

      $scope.configuration= configuration.getConfiguration();

}
