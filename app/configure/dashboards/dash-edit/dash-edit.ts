import {configuration,Dashboard} from 'configure/configuration';
import {DashContentCtrl} from 'configure/dashboards/dash-content/dash-content';
import {CHART_TYPES} from 'chart/types';


/** Shallow copy */
function copyDash(dash: Dashboard): Dashboard {
  return new Dashboard(dash.name, dash.desc,
    dash.charts.map(ch => ch)
  );
}

export class DashEditCtrl {

  private dashboard: Dashboard;
  private dashboardId: string;

  private $mdDialog: any;
  private $location: any;


  constructor($scope, $routeParams, $mdDialog, $location){

    this.$mdDialog = $mdDialog;
    this.$location = $location;

    if($routeParams.dashboardId === 'new'){
      this.dashboard = new Dashboard('', '', []);
    }else{
      this.dashboardId = $routeParams.dashboardId;
      this.dashboard = copyDash(configuration.getDashboards()[this.dashboardId]);
    }

    $scope.chartTypes = CHART_TYPES;
  }

  public addChart(ev): void{
    this.$mdDialog.show({
      controller: DashContentCtrl,
      templateUrl: 'configure/dashboards/dash-content/dash-content.html',
      targetEvent: ev,
      locals: {dashboard:this.dashboard}
    });
  };

  public removeChart(chart): void{
    let charts = this.dashboard.charts;
    let idx = charts.indexOf(chart);
    charts.splice(idx, 1);
  };

  public ok(): void{
    if(this.dashboardId){
      configuration.getDashboards()[this.dashboardId] = this.dashboard;
    }else{
      configuration.getDashboards().push(this.dashboard);
    }
    this.$location.path('/configure/dashboards');
  };

  public cancel(): void{
    this.$location.path('/configure/dashboards');
  };

}
