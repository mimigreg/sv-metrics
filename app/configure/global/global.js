import {configuration} from 'configure/configuration';

export function GlobalCfgCtrl($scope){

    $scope.configuration= configuration.getConfiguration();


    $scope.save= function(){
      configuration.save();
    };

    $scope.restore= function(){
      configuration.restore();
    };

    $scope.default= function(){
      configuration.restoreDefault();
      $scope.configuration= configuration.getConfiguration();
    };

}
