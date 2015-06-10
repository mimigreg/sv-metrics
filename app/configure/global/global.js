import {configuration,SAVE_ON_FLAG} from 'configure/configuration';

export function GlobalCfgCtrl($scope){

    $scope.configuration= configuration.getConfiguration();
    $scope.SAVE_ON_FLAG= SAVE_ON_FLAG;

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

    $scope.$destroy= function(){
      if($scope.form.$dirty){
        configuration.toBeSaved();
      }
    };
}
