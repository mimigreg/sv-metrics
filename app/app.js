import {registry} from 'metrics/MetricsRegistry';
import {api} from 'metrics/api';
import {DashboardController} from 'dashboard/dashboard';
import {configuration} from 'configure/configuration';
import {GlobalCfgCtrl} from 'configure/GlobalCfgCtrl';
import {DashsCfgCtrl} from 'configure/DashsCfgCtrl';
import {ChartsCfgCtrl} from 'configure/ChartsCfgCtrl';
import {MetricsCfgCtrl} from 'configure/MetricsCfgCtrl';
import {chart} from 'chart/chart-directives.js';

export var app= angular.module('sv-metrics', ['ngMaterial','sv-metrics.charts','ngRoute']);
app.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/view', {
        templateUrl: 'view/view.html',
        controller: function(){}
    })
    .when('/view/dashboard/:dashboardId', {
          templateUrl: 'dashboard/dashboard.html',
          controller: DashboardController
      })
    .when('/configure', {
        templateUrl: 'configure/configure.html',
        controller: GlobalCfgCtrl
    })
    .when('/configure/dashboards', {
      templateUrl: 'configure/dashboards.html',
      controller: DashsCfgCtrl
    })
    .when('/configure/charts', {
      templateUrl: 'configure/charts.html',
      controller: ChartsCfgCtrl
    })
    .when('/configure/metrics', {
      templateUrl: 'configure/metrics.html',
      controller: MetricsCfgCtrl
    })
    .otherwise("/view");

}).run(function($timeout,$http){

    var conf= configuration.getConfiguration();

    function getMetrics(){
      $http.get(conf.metricsUrl).success(
        function(data){
          registry.update(data);
          $timeout(getMetrics,conf.metricsInterval*1000);
        }
      ).error(
        function(e){
          console.error(e);
          $timeout(getMetrics,conf.metricsInterval*1000); // TODO: toast?, metricsInterval or failover interval?
        }
      );

    }

    function scheduleUpdate(){

    }

    $timeout(getMetrics,conf.metricsInterval*1000)

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

     $scope.dashboards= configuration.getDashboards();
})
.controller("DashboardController",DashboardController);
