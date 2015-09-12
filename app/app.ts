import {registry} from 'metrics/MetricsRegistry';
import {api} from 'metrics/api';
import {DashboardController} from 'view/dashboard/dashboard';
import {configuration,SAVE_ON_FLAG} from 'configure/configuration';
import {GlobalCfgCtrl} from 'configure/global/global';
import {DashListCtrl} from 'configure/dashboards/dash-list/dash-list';
import {DashEditCtrl} from 'configure/dashboards/dash-edit/dash-edit';
import {ChartsCfgCtrl} from 'configure/charts/charts-list/charts-list';
import {ChartEditCtrl} from 'configure/charts/chart-edit/chart-edit';
import {MetricsCfgCtrl} from 'configure/metrics/metrics';
import {MetricsViewCtrl} from 'view/metrics/metrics';
import {ToolbarCtrl} from 'toolbar/toolbar';
import 'chart/chart-directives';

export var app= angular.module('sv-metrics', ['ngMaterial','sv-metrics.charts','ngRoute']);
app.config(function($routeProvider, $locationProvider,$mdThemingProvider) {

   $mdThemingProvider.theme('default')
    .primaryPalette('deep-orange')
    .accentPalette('orange');

  $routeProvider
    .when('/view', {
        templateUrl: 'view/view.html',
        controller: function(){}
    })
    .when('/view/dashboard/:dashboardId', {
          templateUrl: 'view/dashboard/dashboard.html',
          controller: DashboardController
    })
    .when('/view/metrics', {
            templateUrl: 'view/metrics/metrics.html',
            controller: MetricsViewCtrl,
            controllerAs: 'metrics'
    })
    .when('/configure', {
        templateUrl: 'configure/global/global.html',
        controller: GlobalCfgCtrl
    })
    .when('/configure/dashboards', {
      templateUrl: 'configure/dashboards/dash-list/dash-list.html',
      controller: DashListCtrl
    })
    .when('/configure/dashboards/:dashboardId', {
      templateUrl: 'configure/dashboards/dash-edit/dash-edit.html',
      controller: DashEditCtrl,
      controllerAs: 'dashEdit'
    })
    .when('/configure/charts', {
      templateUrl: 'configure/charts/charts-list/charts-list.html',
      controller: ChartsCfgCtrl
    })
    .when('/configure/charts/:chartId', {
      templateUrl: 'configure/charts/chart-edit/chart-edit.html',
      controller: ChartEditCtrl
    })
    .when('/configure/metrics', {
      templateUrl: 'configure/metrics/metrics.html',
      controller: MetricsCfgCtrl
    })
    .otherwise("/view");

}).run(function($timeout,$http){

    var conf= configuration.getConfiguration();

    function getAndScheduelMetricsUpdate(){

      if(!conf.metricsFetch){
        $timeout(getAndScheduelMetricsUpdate, conf.metricsInterval*1000);
        return;
      }

      $http.get(conf.metricsUrl).success(
        function(data){
          registry.update(data);
          $timeout(getAndScheduelMetricsUpdate, conf.metricsInterval*1000);
        }
      ).error(
        function(e){
          console.error(e);
          $timeout(getAndScheduelMetricsUpdate, conf.metricsInterval*1000); // TODO: toast?, metricsInterval or failover interval?
        }
      );

    }

    getAndScheduelMetricsUpdate();

}).controller("MainCtrl",function MainCtrl($scope,$mdSidenav,$location){

      $scope.toggleSideNav = function() {
        //$mdSidenav('side-nav').toggle();
        $scope.showSideNav= ! $scope.showSideNav;
      };

      //$mdSidenav('side-nav').toggle();
      $scope.showSideNav= true;

      $scope.registry= registry;

     // $scope.$route = $route;
     $scope.$location = $location;
     // $scope.$routeParams = $routeParams;

     $scope.configuration= configuration.getConfiguration();

     window.addEventListener('beforeunload',function(){
       if( $scope.configuration.saveOn===SAVE_ON_FLAG.ON_EXIT){
         configuration.save();
       }
       return null;
     });

})
.controller("DashboardController",DashboardController)
.controller("ToolbarCtrl",ToolbarCtrl);
