import {configuration} from 'configure/configuration';
import {chartTypes} from 'chart/types';

export function DashsCfgCtrl($scope,$location){

      $scope.configuration= configuration.getConfiguration();

      $scope.add= function(){

        $location.path("/configure/dashboards/new");
      };

      $scope.remove= function(dashIdx){
        var dashboards= configuration.getDashboards();
        dashboards.splice(dashIdx,1);
      };

}

function addChartCtrl($scope, $mdDialog, dashboard){

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

export function DashModifCtrl($scope,$routeParams,$mdDialog,$location){


  if($routeParams.dashboardId=='new'){
    $scope.dashboard= {
      name:"",
      desc:"",
      charts:[]
    };
  }else{
    $scope.dashboardId= $routeParams.dashboardId;
    $scope.dashboard= copyDash(configuration.getDashboards()[$scope.dashboardId]);
  }

  $scope.chartTypes= chartTypes;

  $scope.addChart= function(ev){
    $mdDialog.show({
      controller: addChartCtrl,
      templateUrl: 'configure/dashboard/charts-list.html',
      targetEvent: ev,
      locals:{dashboard:$scope.dashboard}
    });
  };

  $scope.removeChart= function(index){
    var charts= $scope.dashboard.charts;
    charts.splice(index,1);
  };

  $scope.ok= function(){
    if($scope.dashboardId){
      configuration.getDashboards()[$scope.dashboardId]= $scope.dashboard;
    }else{
      configuration.getDashboards().push($scope.dashboard);
    }
    $location.path("/configure/dashboards");
  };

  $scope.cancel= function(){
    $location.path("/configure/dashboards");
  };

}
