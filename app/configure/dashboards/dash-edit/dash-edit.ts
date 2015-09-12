import {configuration,Dashboard} from 'configure/configuration';
import {DashContentCtrl} from 'configure/dashboards/dash-content/dash-content';
import {CHART_TYPES} from 'chart/types';


/** Shallow copy */
function copyDash(dash:Dashboard):Dashboard{
  return new Dashboard(dash.name,dash.desc,
    dash.charts.map(ch=>ch)
  );
}

export class DashEditCtrl{

  dashboard:Dashboard;
  dashboardId:string;

  $mdDialog: any;
  $location: any;


  constructor($scope,$routeParams,$mdDialog,$location){

    this.$mdDialog= $mdDialog;
    this.$location= $location;

    if($routeParams.dashboardId=='new'){
      this.dashboard= new Dashboard("","",[]);
    }else{
      this.dashboardId= $routeParams.dashboardId;
      this.dashboard= copyDash(configuration.getDashboards()[this.dashboardId]);
    }

    $scope.chartTypes= CHART_TYPES;
  }

  addChart(ev){
    this.$mdDialog.show({
      controller: DashContentCtrl,
      templateUrl: 'configure/dashboards/dash-content/dash-content.html',
      targetEvent: ev,
      locals:{dashboard:this.dashboard}
    });
  };

  removeChart(chart){
    var charts= this.dashboard.charts;
    var idx= charts.indexOf(chart);
    charts.splice(idx,1);
  };

  ok(){
    if(this.dashboardId){
      configuration.getDashboards()[this.dashboardId]= this.dashboard;
    }else{
      configuration.getDashboards().push(this.dashboard);
    }
    this.$location.path("/configure/dashboards");
  };

  cancel(){
    this.$location.path("/configure/dashboards");
  };

}
