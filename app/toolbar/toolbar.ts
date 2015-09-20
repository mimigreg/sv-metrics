import {configuration} from 'configure/configuration';
import {registry} from 'core/MetricsRegistry';

export function ToolbarCtrl($scope,$mdDialog){


  $scope.exportRyURL= undefined; // import config. blob URL

  $scope.toogleMetricsFetch= function(){

    console.log($scope.configuration.metricsFetch,$scope);

    if( $scope.configuration.metricsFetch ){
      $scope.configuration.metricsFetch= false;
    }else{
      $scope.configuration.metricsFetch= true;
    }
  };

  $scope.exportMetricsRegistry= function(){

      if($scope.exportRyURL){
        URL.revokeObjectURL($scope.exportRyURL);
      }
      var cfg= JSON.stringify(registry.exportRegistry());
      var blob = new Blob([cfg],{type:'application/json'});
      $scope.exportRyURL = URL.createObjectURL(blob);
      var a= <HTMLAnchorElement>document.querySelector('#export-registry-link');
      a.href= $scope.exportRyURL;
      a.click();
  };


  function addRestoreRgOnChange(){
        var restoreInput:any= document.querySelector('#restore-registry-input');
        restoreInput.onchange= function(evt){
          var files = evt.target.files;
          var file= files[0];
          var reader = new FileReader();
          reader.onload= function(evt:any){
            try{
              var rg= evt.target.result;
              registry.restoreRegistry(rg);
              $mdDialog.show(
                $mdDialog.alert()
                  .parent(angular.element(document.body))
                  .title('Registry Restore')
                  .content('Registry restored!')
                  .ariaLabel('OK')
                  .ok('OK')
                  //.targetEvent(evt)
              );
            }catch(err){
              console.error(err);
              $mdDialog.show(
                $mdDialog.alert()
                  .parent(angular.element(document.body))
                  .title('Restore Error')
                  .content('Registry restore error!')
                  .ariaLabel('Restore Error')
                  .ok('OK')
                  //.targetEvent(evt)
              );
            }
          };
          //var content=
          reader.readAsText(file,'UTF-8');
          //console.log(content);
        };
        return restoreInput;
  }


  $scope.restoreMxInput= addRestoreRgOnChange();

  $scope.restoreMetricsRegistry= function(clickEvt){
    $scope.restoreMxInput.click();
  };



  $scope.$destroy= function(){
        if($scope.exportRyURL){
          URL.revokeObjectURL($scope.exportRyURL);
        }
  };

}
