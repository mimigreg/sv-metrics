import {configuration} from 'configure/configuration';
import {DashContentCtrl} from 'configure/dashboards/dash-content/dash-content';
import {chartTypes} from 'chart/types';


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

export function DashEditCtrl($scope,$routeParams,$mdDialog,$location){


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
      controller: DashContentCtrl,
      templateUrl: 'configure/dashboards/dash-content/dash-content.html',
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
