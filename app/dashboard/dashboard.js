import {registry} from 'metrics/MetricsRegistry';
import {configuration} from 'configure/configuration';

export function DashboardController($scope,$routeParams){

      $scope.dashboardId= $routeParams.dashboardId;

      $scope.selectedIndex= 0;
      $scope.charts=[];
      $scope.dashboard= configuration.getDashboards()[$routeParams.dashboardId];

      for(var chart of $scope.dashboard.charts){
        var c= [];
        for(var s of chart.series){
          var val= registry.getValue(s.metricId);
          c.push(
            {
              key:s.name,
              metricId: s.metricId,
              values: val ? val.timeline : []
            }
          );
        };
        c.unregister= registry.onUpdate(function(){
          for(var ch of $scope.charts){
            for(var d of ch.data){
              var val= registry.getValue(d.metricId);
              d.values= val?val.timeline:[];
              //d.values= registry.getValue(d.metricId).timeline;
            }
          };
          $scope.$broadcast("mx-ud");
        });
        $scope.charts.push({name:chart.name,data:c});
      };

      /*
      $scope.$destroy= function(){
        //TODO unregister metrics callback listeners
      };*/
}
