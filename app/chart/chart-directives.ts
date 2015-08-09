/// <reference path="../../typings/d3/d3.d.ts"/>

import {LineChart} from 'chart/line-chart';
import {BarChart} from 'chart/bar-chart';
import {HistogramChart} from 'chart/histogram-chart';
import {BulletChart} from 'chart/bullet-chart';
import {PieChart} from 'chart/pie-chart';
import {CHART_TYPES} from 'chart/types';

angular.module('sv-metrics.charts', [])
.directive('svmChart', [function(){

  var maxChartId= 0;

  return {

        restrict: 'EA',

        scope: {
            config: '='
        },

        controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs){

          $element.css({width:"100%",height:"100%","padding":"15px"});

        }],

        link: function(scope, element, attrs){

          var chartId= 'chart_'+maxChartId++;
          //var dataAttributeChartID= 'chartid' + Math.floor(Math.random()*1000000001);
          element.attr('data-chartid', chartId);

          switch(scope.config.type){
            case CHART_TYPES.LINE:
                  scope.chart= new LineChart(chartId, scope.config);
                  break;
            case CHART_TYPES.BAR:
                  scope.chart= new BarChart(chartId, scope.config);
                  break;
            case CHART_TYPES.HISTOGRAM:
                  scope.chart= new HistogramChart(chartId, scope.config);
                  break;
            case CHART_TYPES.BULLET:
                  scope.chart= new BulletChart(chartId, scope.config);
                  break;
            case CHART_TYPES.PIE:
                  scope.chart= new PieChart(chartId, scope.config);
                  break;
            default: console.error("unknown chart type: "+scope.config.type);
          }



          scope.$on("mx-ud",function(){
            scope.chart.update();
          });

        }
  };
}]);
