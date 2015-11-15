import {configuration, SAVE_ON_FLAG} from 'configure/configuration';

export function GlobalCfgCtrl($scope, $mdDialog) {

    $scope.configuration = configuration.getConfiguration();
    $scope.SAVE_ON_FLAG = SAVE_ON_FLAG;

    $scope.exportURL = undefined; // import config. blob URL

    $scope.save = function(){
      configuration.save();
    };

    $scope.restore = function(){
      configuration.restore();
    };

    $scope.default = function(){
      configuration.restoreDefault();
      $scope.configuration = configuration.getConfiguration();
    };

    $scope.export = function(){
      if($scope.exportURL){
        URL.revokeObjectURL($scope.exportURL);
      }
      var cfg = JSON.stringify(configuration.getConfiguration());
      var blob = new Blob([cfg], {type: 'application/json'});
      $scope.exportURL = URL.createObjectURL(blob);
      var a: HTMLAnchorElement = <HTMLAnchorElement>document.querySelector('#export-config-link');
      a.href = $scope.exportURL;
      a.click();
    };


    function addImportOnChange(){
      var importInput: HTMLInputElement = <HTMLInputElement>document.querySelector('#import-config-input');
      importInput.onchange= function(evt: any){
        var files = evt.target.files;
        var file = files[0];
        var reader = new FileReader();
        reader.onload= function(evt: any){
          try{
            var cfg = evt.target.result;
            configuration.restore(cfg);
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.body))
                .title('Import')
                .content('Configuration imported!')
                .ariaLabel('Import OK')
                .ok('OK')
                // .targetEvent(evt)
            );
          }catch(err){
            console.error(err);
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.body))
                .title('Import Error')
                .content('Configuration import error!')
                .ariaLabel('Import Error')
                .ok('OK')
                // .targetEvent(evt)
            );
          }
        };
        reader.readAsText(file, 'UTF-8');
      };
      return importInput;
    }

    $scope.importInput = addImportOnChange();

    $scope.import = function(clickEvt){
      $scope.importInput.click();
    };

    $scope.$destroy = function(){
      if($scope.form.$dirty){
        configuration.toBeSaved();
      }
      if($scope.exportURL){
        URL.revokeObjectURL($scope.exportURL);
      }
    };
}
