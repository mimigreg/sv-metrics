import {configuration} from 'configure/configuration';


export function DashContentCtrl($scope, $mdDialog, dashboard){

  $scope.chartsWrapper= configuration.getCharts().map(
    function(ch){
      return { chart:ch, inDash:dashboard.charts.some(e=>ch===e) };
    }
  );

  $scope.ok = function(chartsWrapper) {
    $mdDialog.hide();
    dashboard.charts= [];
    for(var w of chartsWrapper){
      if(w.inDash){
        dashboard.charts.push(w.chart);
      }
    }
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };
}

/** Shallow copy */
function copyDash(dash){
  var cp={
    name: dash.name,
    desc: dash.desc,
    charts:[]
  };
  for(var ch of dash.charts){
    cp.charts.push(ch);
  }
  return cp;
}
