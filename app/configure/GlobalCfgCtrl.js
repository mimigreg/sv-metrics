import {configuration} from 'configure/configuration';

export function GlobalCfgCtrl($scope){

      $scope.configuration= configuration.getConfiguration();
}
